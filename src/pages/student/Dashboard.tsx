import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Clock, Star, Users, ArrowRight,
  BookOpen, CheckCircle, CreditCard
} from 'lucide-react';
import { PageWrapper } from '../../components/layout';
import { Card, CardContent, Button, Avatar, Badge, Loader, EmptyState } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { formatDate, formatTime, formatCurrency } from '../../utils/helpers';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const fetchDashboardData = async () => {
    if (!user?.id) return;
    
    try {
      const [statsRes, bookingsRes, teachersRes] = await Promise.all([
        api.get(`/dashboard/student/${user.id}/stats`),
        api.get(`/bookings/student/${user.id}?status=accepted`),
        api.get('/teachers/public/list?limit=6'),
      ]);

      setStats(statsRes.data);
      setUpcomingBookings(bookingsRes.data.slice(0, 3));
      setTeachers(teachersRes.data);
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      label: 'Total Bookings', 
      value: stats?.totalBookings || 0, 
      icon: Calendar, 
      color: 'from-blue-500 to-indigo-600',
      shadow: 'shadow-blue-500/15'
    },
    { 
      label: 'Upcoming', 
      value: stats?.accepted || 0, 
      icon: Clock, 
      color: 'from-[#7B0080] to-[#A020A0]',
      shadow: 'shadow-[#7B0080]/15'
    },
    { 
      label: 'Completed', 
      value: stats?.completed || 0, 
      icon: CheckCircle, 
      color: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/15'
    },
  ];

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader size="lg" />
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="student-dashboard">
        {/* Header */}
        <div className="mb-8 animate-slideUp">
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-slate-500 mt-1.5">
            Here's what's happening with your learning journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="overflow-hidden">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500 mb-1 font-medium">{stat.label}</p>
                      <p className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md ${stat.shadow}`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upcoming Bookings */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold font-heading text-slate-900">Upcoming Sessions</h2>
              <Link 
                to="/student/bookings" 
                className="text-sm text-[#7B0080] font-semibold hover:underline flex items-center gap-1"
                data-testid="view-all-bookings-link"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {upcomingBookings.length === 0 ? (
              <Card>
                <CardContent>
                  <EmptyState 
                    type="bookings"
                    title="No upcoming sessions"
                    description="Book a session with a teacher to get started"
                    action={
                      <Link to="/student/teachers">
                        <Button data-testid="find-teacher-btn">Find a Teacher</Button>
                      </Link>
                    }
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <Link 
                    key={booking.id} 
                    to={`/student/bookings/${booking.id}`}
                    className="block"
                    data-testid={`booking-card-link-${booking.id}`}
                  >
                    <Card hover className="cursor-pointer">
                      <CardContent className="p-5 sm:p-6">
                        <div className="flex items-start gap-4">
                          <Avatar 
                            src={booking.teacherPhoto}
                            firstName={booking.teacherName?.split(' ')[0]}
                            lastName={booking.teacherName?.split(' ')[1]}
                            size="lg"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-semibold text-slate-900">
                                  {booking.teacherName}
                                </h3>
                                <p className="text-sm text-slate-500">{booking.subject || booking.sessionType}</p>
                              </div>
                              <Badge status={booking.status}>
                                {booking.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {formatDate(booking.date)}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {formatTime(booking.startTime)}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-slate-300 flex-shrink-0 mt-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold font-heading text-slate-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link to="/student/teachers" className="block">
                    <Button variant="secondary" className="w-full justify-start" data-testid="quick-find-teacher">
                      <Users className="w-4 h-4 mr-2.5" />
                      Find a Teacher
                    </Button>
                  </Link>
                  <Link to="/student/bookings" className="block">
                    <Button variant="secondary" className="w-full justify-start" data-testid="quick-my-bookings">
                      <Calendar className="w-4 h-4 mr-2.5" />
                      My Bookings
                    </Button>
                  </Link>
                  <Link to="/student/profile" className="block">
                    <Button variant="secondary" className="w-full justify-start" data-testid="quick-my-profile">
                      <BookOpen className="w-4 h-4 mr-2.5" />
                      My Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Top Rated Teachers */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold font-heading text-slate-900">Top Rated Teachers</h2>
            <Link 
              to="/student/teachers" 
              className="text-sm text-[#7B0080] font-semibold hover:underline flex items-center gap-1"
              data-testid="browse-all-teachers-link"
            >
              Browse all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.slice(0, 6).map((teacher) => (
              <Card key={teacher.id} hover>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <Avatar 
                      src={teacher.profilePhoto}
                      firstName={teacher.firstName}
                      lastName={teacher.lastName}
                      size="lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">
                        {teacher.title} {teacher.firstName} {teacher.lastName}
                      </h3>
                      <p className="text-sm text-slate-500 truncate">
                        {teacher.professionalTitle || teacher.subjects?.[0] || 'Teacher'}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span className="text-sm font-semibold text-slate-900">{teacher.rating?.toFixed(1) || '0.0'}</span>
                        </div>
                        <span className="text-slate-300">|</span>
                        <span className="text-sm text-slate-500">{formatCurrency(teacher.pricePerSession)}/hr</span>
                      </div>
                    </div>
                  </div>
                  <Link to={`/student/teachers/${teacher.id}`} className="block mt-4">
                    <Button variant="secondary" size="sm" className="w-full" data-testid={`view-teacher-${teacher.id}`}>
                      View Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default StudentDashboard;
