import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { PageWrapper } from '../../components/layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

interface ChatMessage {
  id: string;
  bookingId: string;
  text: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  createdAt: string;
}

const ChatRoom = () => {
  const { bookingId } = useParams();
  const { user, userRole, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const seenIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth/role-select');
    }
  }, [authLoading, isAuthenticated, navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = useCallback((msg: ChatMessage) => {
    if (seenIds.current.has(msg.id)) return;
    seenIds.current.add(msg.id);
    setMessages(prev => [...prev, msg]);
  }, []);

  // Fetch existing messages via REST
  const fetchMessages = useCallback(async () => {
    try {
      const res = await api.get(`/chat/messages/${bookingId}?limit=200`);
      const msgs: ChatMessage[] = res.data;
      msgs.forEach(m => seenIds.current.add(m.id));
      setMessages(msgs);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
    }
  }, [bookingId]);

  // Connect WebSocket
  const connectWs = useCallback(() => {
    if (!bookingId || !user) return;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/ws/chat/${bookingId}`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsConnected(true);
        // Stop polling if active
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          addMessage(msg);
        } catch (error: any) {
          console.error('Failed to parse WS message:', error?.message);
        }
      };

      ws.onclose = () => {
        setWsConnected(false);
        wsRef.current = null;
        // Fall back to polling
        if (!pollRef.current) {
          pollRef.current = setInterval(fetchMessages, 3000);
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      // WS not supported, use polling
      if (!pollRef.current) {
        pollRef.current = setInterval(fetchMessages, 3000);
      }
    }
  }, [bookingId, user, addMessage, fetchMessages]);

  useEffect(() => {
    if (!user) return;
    const init = async () => {
      try {
        const bookingRes = await api.get(`/bookings/${bookingId}`);
        setBooking(bookingRes.data);
      } catch (error: any) {
        console.error('Error loading booking:', error);
      }
      await fetchMessages();
      setLoading(false);
      // Connect WebSocket after initial load
      connectWs();
    };
    init();

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId, user]);

  useEffect(() => {
    scrollToBottom();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const text = newMessage.trim();
    setNewMessage('');
    setSending(true);

    const senderName = userRole === 'teacher'
      ? `${user.title || ''} ${user.firstName} ${user.lastName}`.trim()
      : `${user.firstName} ${user.lastName}`;

    const payload = {
      bookingId,
      text,
      senderId: user.id,
      senderName,
      senderRole: userRole,
    };

    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        // Send via WebSocket (server will persist + broadcast)
        wsRef.current.send(JSON.stringify(payload));
      } else {
        // Fallback to REST
        const res = await api.post('/chat/messages', payload);
        addMessage(res.data);
      }
    } catch (error: any) {
      toast.error('Failed to send message');
      setNewMessage(text); // Restore message on failure
    } finally {
      setSending(false);
    }
  };

  const backPath = userRole === 'teacher' ? `/teacher/bookings/${bookingId}` : `/student/bookings/${bookingId}`;
  const otherName = userRole === 'teacher' ? (booking?.studentName || 'Student') : (booking?.teacherName || 'Teacher');

  if (loading) {
    return (
      <PageWrapper showFooter={false}>
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="w-8 h-8 text-[#7B0080] animate-spin" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper showFooter={false}>
      <div className="flex flex-col h-[calc(100vh-64px)]" data-testid="chat-room">
        {/* Chat Header */}
        <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
          <Link to={backPath} className="text-slate-500 hover:text-[#7B0080]">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          {booking?.profilePhoto || booking?.studentProfilePhoto || booking?.teacherProfilePhoto ? (
            <img 
              src={userRole === 'teacher' ? (booking?.studentProfilePhoto || booking?.profilePhoto) : (booking?.teacherProfilePhoto || booking?.profilePhoto)} 
              alt={otherName} 
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7B0080] to-[#A020A0] text-white flex items-center justify-center text-sm font-bold">
              {otherName.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 text-sm truncate">{otherName}</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              Chat Session
              <span className={`w-1.5 h-1.5 rounded-full ${wsConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            </p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50" data-testid="chat-messages">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 text-sm">No messages yet. Start the conversation!</p>
            </div>
          )}
          {messages.map((msg) => {
            const isMe = msg.senderId === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    isMe
                      ? 'bg-[#7B0080] text-white rounded-br-md'
                      : 'bg-white text-slate-900 border border-slate-200 rounded-bl-md'
                  }`}
                >
                  {!isMe && (
                    <p className="text-xs font-semibold text-[#7B0080] mb-1">{msg.senderName}</p>
                  )}
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${isMe ? 'text-white/60' : 'text-slate-400'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSend} className="bg-white border-t border-slate-200 px-4 py-3 flex items-center gap-3" data-testid="chat-input-form">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-slate-200 rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#7B0080]/20 focus:border-[#7B0080] outline-none"
            data-testid="chat-input"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="w-10 h-10 rounded-full bg-[#7B0080] text-white flex items-center justify-center hover:bg-[#6A006E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            data-testid="chat-send-btn"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </PageWrapper>
  );
};

export default ChatRoom;
