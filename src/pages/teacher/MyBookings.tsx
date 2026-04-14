import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Check, X } from 'lucide-react';
import { PageWrapper } from '../../components/layout';
import { Card, CardContent, Button, Avatar, Badge, Loader, EmptyState } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { formatDate, formatTime, formatCurrency } from '../../utils/helpers';

const TeacherMyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [actionLoading, setActionLoading] = useState<any>(null);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'accepted', label: 'Accepted' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  useEffect(() => {
    fetchBookings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, activeTab]);

  const fetchBookings = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      let url = `/bookings/teacher/${user.id}`;
      if (activeTab !== 'all') {
        url += `?status=${activeTab}`;
      }
      const response = await api.get(url);
      setBookings(response.data);
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (bookingId) => {
    setActionLoading(bookingId);
    try {
      await api.put(`/bookings/${bookingId}`, { status: 'accepted' });
      toast.success('Booking accepted');
      fetchBookings();
    } catch (error: any) {
      toast.error('Failed to accept booking');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (bookingId) => {
    setActionLoading(bookingId);
    try {
      await api.put(`/bookings/${bookingId}`, { status: 'declined' });
      toast.success('Booking declined');
      fetchBookings();
    } catch (error: any) {
      toast.error('Failed to decline booking');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="teacher-bookings-page">
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 mb-6 animate-slideUp">My Bookings</h1>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#7B0080] to-[#A020A0] text-white shadow-md shadow-[#7B0080]/20'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
              data-testid={`tab-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size="lg" />
          </div>
        ) : bookings.length === 0 ? (
          <Card>
            <CardContent>
              <EmptyState 
                type="bookings"
                title="No bookings found"
                description={activeTab === 'all' 
                  ? "You don't have any bookings yet"
                  : `No ${activeTab} bookings`
                }
                action={
                  <Link to="/teacher/slots">
                    <Button data-testid="manage-slots-empty">Manage Availability</Button>
                  </Link>
                }
              />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} hover data-testid={`booking-card-${booking.id}`}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start gap-4">
                    <Avatar 
                      firstName={booking.studentName?.split(' ')[0]}
                      lastName={booking.studentName?.split(' ')[1]}
                      size="lg"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {booking.studentName || 'Student'}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {booking.subject || booking.sessionType}
                          </p>
                          {booking.studentEmail && (
                            <p className="text-xs text-slate-400 mt-1">{booking.studentEmail}</p>
                          )}
                        </div>
                        <Badge status={booking.status}>
                          {booking.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3 text-sm text-slate-600 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(booking.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTime(booking.startTime)}
                        </span>
                        <span className="font-medium text-[#7B0080]">
                          {formatCurrency(booking.price)}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <Button 
                              size="sm"
                              onClick={() => handleAccept(booking.id)}
                              loading={actionLoading === booking.id}
                              data-testid={`accept-${booking.id}`}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                            <Button 
                              variant="danger"
                              size="sm"
                              onClick={() => handleDecline(booking.id)}
                              loading={actionLoading === booking.id}
                              data-testid={`decline-${booking.id}`}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Decline
                            </Button>
                          </>
                        )}
                        <Link to={`/teacher/bookings/${booking.id}`}>
                          <Button variant="secondary" size="sm" data-testid={`view-${booking.id}`}>
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default TeacherMyBookings;
