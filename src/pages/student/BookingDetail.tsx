import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, ArrowLeft, Star, X, Video, 
  MessageCircle, Download, CheckCircle, XCircle
} from 'lucide-react';
import { PageWrapper } from '../../components/layout';
import { Card, CardContent, Button, Avatar, Badge, Loader, Modal } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { formatDate, formatTime, formatCurrency } from '../../utils/helpers';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  const handleCancelBooking = async () => {
    setSubmitting(true);
    try {
      await api.put(`/bookings/${id}`, { status: 'cancelled' });
      toast.success('Booking cancelled');
      setShowCancelModal(false);
      fetchBooking();
    } catch (error: any) {
      toast.error('Failed to cancel booking');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRateSession = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/reviews', {
        teacherId: booking.teacherId,
        studentId: user.id,
        bookingId: booking.id,
        rating,
        comment,
      });
      toast.success('Thank you for your review!');
      setShowRatingModal(false);
      fetchBooking();
    } catch (error: any) {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { status: 'pending', label: 'Pending', icon: Clock },
      { status: 'accepted', label: 'Confirmed', icon: CheckCircle },
      { status: 'completed', label: 'Completed', icon: Star },
    ];

    if (booking?.status === 'cancelled' || booking?.status === 'declined') {
      return [
        { status: 'pending', label: 'Pending', icon: Clock },
        { status: booking.status, label: booking.status === 'cancelled' ? 'Cancelled' : 'Declined', icon: XCircle },
      ];
    }

    return steps;
  };

  const getCurrentStepIndex = () => {
    const statusOrder = ['pending', 'accepted', 'paid', 'completed'];
    const index = statusOrder.indexOf(booking?.status);
    return index >= 0 ? index : 0;
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

  const canCancel = booking.status === 'pending';
  const canRate = booking.status === 'completed' && !booking.rating;
  const canJoin = booking.status === 'accepted' || booking.status === 'paid';

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="booking-detail-page">
        {/* Back Button */}
        <Link 
          to="/student/bookings"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-[#7B0080] mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bookings
        </Link>

        {/* Booking Status */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Booking Status</h2>
              <Badge status={booking.status} size="lg">
                {booking.status}
              </Badge>
            </div>

            {/* Status Timeline */}
            <div className="flex items-center justify-between">
              {getStatusSteps().map((step, index) => {
                const Icon = step.icon;
                const isActive = getCurrentStepIndex() >= index;
                const isCancelled = step.status === 'cancelled' || step.status === 'declined';
                return (
                  <React.Fragment key={step.status}>
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCancelled 
                          ? 'bg-red-100 text-red-500'
                          : isActive 
                            ? 'bg-[#7B0080] text-white' 
                            : 'bg-slate-100 text-slate-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-xs mt-2 ${isActive ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                        {step.label}
                      </span>
                    </div>
                    {index < getStatusSteps().length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 ${
                        getCurrentStepIndex() > index ? 'bg-[#7B0080]' : 'bg-slate-200'
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
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
                      ? 'Your chat session is ready. Join to start messaging with your teacher.'
                      : 'Your video session is ready. Join to start a live video call with your teacher.'
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

        {/* Booking Details */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Session Details</h2>
            
            <div className="flex items-center gap-4 mb-6">
              <Avatar 
                src={booking.teacherPhoto}
                firstName={booking.teacherName?.split(' ')[0]}
                lastName={booking.teacherName?.split(' ')[1]}
                size="xl"
              />
              <div>
                <h3 className="font-semibold text-slate-900">{booking.teacherName}</h3>
                <p className="text-sm text-slate-500">{booking.subject || booking.sessionType}</p>
                <Link 
                  to={`/student/teachers/${booking.teacherId}`}
                  className="text-sm text-[#7B0080] hover:underline"
                >
                  View Profile
                </Link>
              </div>
            </div>

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
                <p className="text-xs text-slate-500 mb-1">Notes</p>
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
          {canCancel && (
            <Button 
              variant="danger" 
              onClick={() => setShowCancelModal(true)}
              data-testid="cancel-booking-btn"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel Booking
            </Button>
          )}
          {canRate && (
            <Button 
              onClick={() => setShowRatingModal(true)}
              data-testid="rate-session-btn"
            >
              <Star className="w-4 h-4 mr-2" />
              Rate Session
            </Button>
          )}
        </div>

        {/* Cancel Modal */}
        <Modal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          title="Cancel Booking"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-slate-600 mb-6">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
                Keep Booking
              </Button>
              <Button 
                variant="danger" 
                onClick={handleCancelBooking}
                loading={submitting}
                data-testid="confirm-cancel-btn"
              >
                Cancel Booking
              </Button>
            </div>
          </div>
        </Modal>

        {/* Rating Modal */}
        <Modal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          title="Rate Your Session"
        >
          <div className="text-center">
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="focus:outline-none transform hover:scale-110 transition-transform"
                >
                  <Star 
                    className={`w-10 h-10 ${
                      star <= rating 
                        ? 'text-amber-500 fill-amber-500' 
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <textarea
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#7B0080]/20 focus:border-[#7B0080] outline-none transition-all resize-none mb-6"
              rows={3}
              placeholder="Share your experience (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={() => setShowRatingModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleRateSession}
                loading={submitting}
                data-testid="submit-rating-btn"
              >
                Submit Review
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </PageWrapper>
  );
};

export default BookingDetail;
