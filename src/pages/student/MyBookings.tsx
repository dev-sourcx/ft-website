import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { PageWrapper } from '../../components/layout';
import { Card, CardContent, Button, Avatar, Badge, Loader, EmptyState } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { formatDate, formatTime, formatCurrency } from '../../utils/helpers';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'accepted', label: 'Upcoming' },
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
      let url = `/bookings/student/${user.id}`;
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

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="my-bookings-page">
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
                  ? "You haven't made any bookings yet"
                  : `No ${activeTab} bookings`
                }
                action={
                  <Link to="/student/teachers">
                    <Button data-testid="find-teacher-empty">Find a Teacher</Button>
                  </Link>
                }
              />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} hover data-testid={`booking-card-${booking.id}`}>
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <Avatar 
                      src={booking.teacherPhoto}
                      firstName={booking.teacherName?.split(' ')[0]}
                      lastName={booking.teacherName?.split(' ')[1]}
                      size="lg"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {booking.teacherName || 'Teacher'}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {booking.subject || booking.sessionType}
                          </p>
                        </div>
                        <Badge status={booking.status}>
                          {booking.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3 text-sm text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {formatDate(booking.date)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {formatTime(booking.startTime)}
                        </span>
                        <span className="font-semibold text-[#7B0080]">
                          {formatCurrency(booking.price)}
                        </span>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Link to={`/student/bookings/${booking.id}`}>
                          <Button variant="secondary" size="sm" data-testid={`view-booking-${booking.id}`}>
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

export default MyBookings;
