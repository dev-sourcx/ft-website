import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, ArrowLeft, Check, X, Video, 
  MessageCircle, User, Mail, Phone, CheckCircle
} from 'lucide-react';
import { PageWrapper } from '../../components/layout';
import { Card, CardContent, Button, Avatar, Badge, Loader, Modal } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { formatDate, formatTime, formatCurrency } from '../../utils/helpers';

const TeacherBookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  useEffect(() => {
    fetchBooking();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchBooking = async () => {
    try {
      const response = await api.get(`/bookings/${id}`);
      setBooking(response.data);
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') console.error('Error fetching booking:', error);
      toast.error('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    setActionLoading(true);
    try {
      await api.put(`/bookings/${id}`, { status: 'accepted' });
      toast.success('Booking accepted');
      fetchBooking();
    } catch (error: any) {
      toast.error('Failed to accept booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecline = async () => {
    setActionLoading(true);
    try {
      await api.put(`/bookings/${id}`, { status: 'declined' });
      toast.success('Booking declined');
      fetchBooking();
    } catch (error: any) {
      toast.error('Failed to decline booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    setActionLoading(true);
    try {
      await api.put(`/bookings/${id}`, { status: 'completed' });
      toast.success('Session marked as completed');
      setShowCompleteModal(false);
      fetchBooking();
    } catch (error: any) {
      toast.error('Failed to complete booking');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center py-12">
            <Loader size="lg" />
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (!booking) {
    return (
      <PageWrapper>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-slate-500">Booking not found</p>
        </div>
      </PageWrapper>
    );
  }

  const canAccept = booking.status === 'pending';
  const canComplete = booking.status === 'accepted' || booking.status === 'paid';
  const canJoin = booking.status === 'accepted' || booking.status === 'paid';

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="teacher-booking-detail">
        {/* Back Button */}
        <Link 
          to="/teacher/bookings"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-[#7B0080] mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bookings
        </Link>

        {/* Status */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Booking Status</h2>
              <Badge status={booking.status} size="lg">
                {booking.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Join Session Banner */}
        {canJoin && (
          <Card className="mb-6 bg-gradient-to-r from-[#7B0080] to-[#A020A0] text-white">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  {booking.sessionType === 'chat' ? (
                    <MessageCircle className="w-6 h-6" />
                  ) : (
                    <Video className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">
                    {booking.sessionType === 'chat' ? 'Chat Session Ready' : 'Video Session Ready'}
                  </h3>
                  <p className="text-white/80 text-sm mb-4">
                    {booking.sessionType === 'chat'
                      ? 'The chat session is ready. Join to start messaging with your student.'
                      : 'The video session is ready. Join to start a live video call with your student.'
                    }
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {(booking.sessionType === 'chat' || booking.sessionType === 'both') && (
                      <Button 
                        variant="secondary"
                        className="bg-white text-[#7B0080] border-white hover:bg-white/90"
                        onClick={() => navigate(`/session/chat/${booking.id}`)}
                        data-testid="join-chat-btn"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Join Chat
                      </Button>
                    )}
                    {(booking.sessionType === 'video' || booking.sessionType === 'online' || booking.sessionType === 'both') && (
                      <Button 
                        variant="secondary"
                        className="bg-white text-[#7B0080] border-white hover:bg-white/90"
                        onClick={() => navigate(`/session/video/${booking.id}`)}
                        data-testid="join-session-btn"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Join Session
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Student Details */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Student Information</h2>
            
            <div className="flex items-center gap-4 mb-6">
              <Avatar 
                firstName={booking.studentName?.split(' ')[0]}
                lastName={booking.studentName?.split(' ')[1]}
                size="xl"
              />
              <div>
                <h3 className="font-semibold text-slate-900">{booking.studentName || 'Student'}</h3>
                <p className="text-sm text-slate-500">{booking.subject || booking.sessionType}</p>
              </div>
            </div>

            <div className="space-y-3">
              {booking.studentEmail && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-600">{booking.studentEmail}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Session Details */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Session Details</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Calendar className="w-5 h-5 text-[#7B0080]" />
                <div>
                  <p className="text-xs text-slate-500">Date</p>
                  <p className="font-medium">{formatDate(booking.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Clock className="w-5 h-5 text-[#7B0080]" />
                <div>
                  <p className="text-xs text-slate-500">Time</p>
                  <p className="font-medium">{formatTime(booking.startTime)}</p>
                </div>
              </div>
            </div>

            {booking.notes && (
              <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Student Notes</p>
                <p className="text-sm text-slate-700">{booking.notes}</p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <span className="text-slate-500">Session Price</span>
              <span className="text-xl font-bold text-[#7B0080]">{formatCurrency(booking.price)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {canAccept && (
            <>
              <Button 
                onClick={handleAccept}
                loading={actionLoading}
                data-testid="accept-booking-btn"
              >
                <Check className="w-4 h-4 mr-2" />
                Accept Booking
              </Button>
              <Button 
                variant="danger"
                onClick={handleDecline}
                loading={actionLoading}
                data-testid="decline-booking-btn"
              >
                <X className="w-4 h-4 mr-2" />
                Decline
              </Button>
            </>
          )}
          {canComplete && (
            <Button 
              variant="success"
              onClick={() => setShowCompleteModal(true)}
              data-testid="complete-session-btn"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Completed
            </Button>
          )}
        </div>

        {/* Complete Modal */}
        <Modal
          isOpen={showCompleteModal}
          onClose={() => setShowCompleteModal(false)}
          title="Complete Session"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <p className="text-slate-600 mb-6">
              Are you sure you want to mark this session as completed? The earnings will be added to your wallet.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={() => setShowCompleteModal(false)}>
                Cancel
              </Button>
              <Button 
                variant="success"
                onClick={handleComplete}
                loading={actionLoading}
                data-testid="confirm-complete-btn"
              >
                Confirm Completion
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </PageWrapper>
  );
};

export default TeacherBookingDetail;
