import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Loader2, ArrowLeft } from 'lucide-react';
import AgoraRTC from 'agora-rtc-react';
import {
  AgoraRTCProvider,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
  useRemoteAudioTracks,
  LocalVideoTrack,
  RemoteUser,
} from 'agora-rtc-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

// ── Wrapper: fetches Agora config, then renders the call ──
const VideoCall = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user, userRole, isAuthenticated, isLoading: authLoading } = useAuth();

  const [agoraConfig, setAgoraConfig] = useState<{ appId: string; token: string; channel: string; uid: number } | null>(null);
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate('/auth/role-select');
  }, [authLoading, isAuthenticated, navigate]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; document.documentElement.style.overflow = ''; };
  }, []);

  // Fetch config once
  useEffect(() => {
    if (!user || agoraConfig) return;
    const load = async () => {
      // Booking info (optional, for display only)
      try {
        const bRes = await api.get(`/bookings/${bookingId}`);
        setBooking(bRes.data);
      } catch {}

      // Agora token
      try {
        const channel = `booking-${bookingId}`;
        const uid = Math.floor(Math.random() * 100000);
        const cRes = await api.get(`/agora/config?channel=${channel}&uid=${uid}`);
        setAgoraConfig({ appId: cRes.data.appId, token: cRes.data.token, channel, uid });
      } catch (e: any) {
        setError('Failed to connect to video service');
        toast.error('Failed to connect to video service');
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId, user]);

  const otherName = userRole === 'teacher'
    ? (booking?.studentName || 'Student')
    : (booking?.teacherName || 'Teacher');

  const handleLeave = () => {
    navigate(userRole === 'teacher' ? `/teacher/bookings/${bookingId}` : `/student/bookings/${bookingId}`);
  };

  // Create a stable client instance - must be before any conditional returns (React hooks rule)
  const client = useMemo(() => AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }), []);

  if (!agoraConfig) {
    return (
      <div style={S.root} data-testid="video-call-loading">
        <div style={{ textAlign: 'center' }}>
          {error ? (
            <>
              <p style={{ color: '#f87171', fontSize: 18 }}>{error}</p>
              <button onClick={handleLeave} style={{ ...S.ctrlBtn, background: '#334155', color: '#fff', marginTop: 20 }}>Go Back</button>
            </>
          ) : (
            <>
              <Loader2 className="w-12 h-12 text-[#7B0080] animate-spin" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: '#fff', fontSize: 18, fontWeight: 500 }}>Joining session...</p>
              <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 8 }}>Setting up camera and microphone</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <AgoraRTCProvider client={client}>
      <CallUI
        appId={agoraConfig.appId}
        token={agoraConfig.token}
        channel={agoraConfig.channel}
        uid={agoraConfig.uid}
        otherName={otherName}
        onLeave={handleLeave}
      />
    </AgoraRTCProvider>
  );
};

// ── Inner call UI: uses Agora React hooks ──
interface CallUIProps {
  appId: string;
  token: string;
  channel: string;
  uid: number;
  otherName: string;
  onLeave: () => void;
}

const CallUI = ({ appId, token, channel, uid, otherName, onLeave }: CallUIProps) => {
  const [micMuted, setMicMuted] = useState(false);
  const [camMuted, setCamMuted] = useState(false);

  // Agora hooks — handle all lifecycle automatically
  // First param is 'ready' (boolean), second is config with AEC/ANS for echo cancellation
  const { localMicrophoneTrack, isLoading: micLoading } = useLocalMicrophoneTrack(true, { AEC: true, ANS: true, AGC: true });
  const { localCameraTrack, isLoading: camLoading } = useLocalCameraTrack(true);

  // Join the channel
  useJoin({ appid: appId, channel, token, uid });

  // Publish local tracks
  usePublish([localMicrophoneTrack, localCameraTrack]);

  // Remote users
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  // Play remote audio automatically
  useEffect(() => {
    audioTracks.forEach((track) => {
      if (track && !track.isPlaying) track.play();
    });
  }, [audioTracks]);

  const hasRemote = remoteUsers.length > 0;

  // Toggle mic
  const toggleMic = async () => {
    if (localMicrophoneTrack) {
      await localMicrophoneTrack.setEnabled(micMuted);
      setMicMuted(!micMuted);
    }
  };

  // Toggle camera
  const toggleCam = async () => {
    if (localCameraTrack) {
      await localCameraTrack.setEnabled(camMuted);
      setCamMuted(!camMuted);
    }
  };

  const loading = micLoading || camLoading;

  if (loading) {
    return (
      <div style={S.root} data-testid="video-call-loading">
        <div style={{ textAlign: 'center' }}>
          <Loader2 className="w-12 h-12 text-[#7B0080] animate-spin" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#fff', fontSize: 18, fontWeight: 500 }}>Connecting devices...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        [data-testid="remote-video"] video,
        [data-testid="local-video"] video {
          width: 100% !important; height: 100% !important; object-fit: cover !important;
        }
      `}</style>

      <div style={S.root} data-testid="video-call-page">
        {/* Top bar */}
        <div style={S.topBar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={onLeave} style={S.iconBtn}><ArrowLeft size={20} /></button>
            <div>
              <div style={{ color: '#fff', fontWeight: 500, fontSize: 14 }}>{otherName}</div>
              <div style={{ color: '#94a3b8', fontSize: 12 }}>{hasRemote ? 'Connected' : 'Waiting for participant...'}</div>
            </div>
          </div>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: hasRemote ? '#4ade80' : '#fbbf24' }} />
        </div>

        {/* Video area */}
        <div style={S.videoArea}>
          {/* Remote video */}
          <div style={S.remoteVideo} data-testid="remote-video">
            {hasRemote ? (
              <RemoteUser
                user={remoteUsers[0]}
                playVideo={true}
                playAudio={true}
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <div style={S.waitingOverlay}>
                <div style={{ textAlign: 'center' }}>
                  <div style={S.avatar}>
                    <span style={{ fontSize: 32, fontWeight: 700, color: '#94a3b8' }}>{otherName.charAt(0)}</span>
                  </div>
                  <p style={{ color: '#94a3b8' }}>Waiting for {otherName} to join...</p>
                </div>
              </div>
            )}
          </div>

          {/* Local video PIP */}
          <div style={S.localPip} data-testid="local-video">
            {localCameraTrack && !camMuted ? (
              <LocalVideoTrack
                track={localCameraTrack}
                play={true}
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <div style={S.mutedOverlay}><VideoOff size={32} color="#64748b" /></div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div style={S.controls}>
          <button
            onClick={toggleMic}
            style={{ ...S.ctrlBtn, background: micMuted ? 'rgba(239,68,68,.2)' : '#334155', color: micMuted ? '#f87171' : '#fff' }}
            data-testid="toggle-audio-btn"
          >
            {micMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          <button
            onClick={toggleCam}
            style={{ ...S.ctrlBtn, background: camMuted ? 'rgba(239,68,68,.2)' : '#334155', color: camMuted ? '#f87171' : '#fff' }}
            data-testid="toggle-video-btn"
          >
            {camMuted ? <VideoOff size={24} /> : <Video size={24} />}
          </button>
          <button onClick={onLeave} style={{ ...S.ctrlBtn, background: '#ef4444', color: '#fff' }} data-testid="end-call-btn">
            <PhoneOff size={24} />
          </button>
        </div>
      </div>
    </>
  );
};

const S: Record<string, React.CSSProperties> = {
  root: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999, background: '#0f172a', display: 'flex', flexDirection: 'column', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  topBar: { width: '100%', flexShrink: 0, padding: '12px 16px', background: 'rgba(30,41,59,.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 },
  videoArea: { width: '100%', flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 },
  remoteVideo: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: '#1e293b', overflow: 'hidden' },
  waitingOverlay: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1e293b' },
  avatar: { width: 80, height: 80, borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  localPip: { position: 'absolute', bottom: 16, right: 16, width: 140, height: 190, borderRadius: 12, overflow: 'hidden', border: '2px solid #475569', background: '#1e293b', zIndex: 10, boxShadow: '0 25px 50px -12px rgba(0,0,0,.5)' },
  mutedOverlay: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1e293b' },
  controls: { width: '100%', flexShrink: 0, padding: '20px 16px', background: 'rgba(30,41,59,.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 },
  ctrlBtn: { width: 56, height: 56, borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .2s' },
};

export default VideoCall;
