import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Clock, Star, Users, Wallet, ArrowRight,
  BookOpen, CheckCircle, DollarSign
} from 'lucide-react';
import { PageWrapper } from '../../components/layout';
import { Card, CardContent, Button, Avatar, Badge, Loader, EmptyState } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { formatDate, formatTime, formatCurrency } from '../../utils/helpers';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [todayBookings, setTodayBookings] = useState<any[]>([]);
  const [walletSummary, setWalletSummary] = useState({ availableBalance: 0, totalEarned: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const fetchDashboardData = async () => {
    if (!user?.id) return;
    
    try {
      const [statsRes, bookingsRes, walletRes] = await Promise.all([
        api.get(`/dashboard/teacher/${user.id}/stats`),
        api.get(`/bookings/teacher/${user.id}?status=accepted`),
        api.get(`/wallet/${user.id}/summary?user_type=teacher`),
      ]);

      setStats(statsRes.data);
      
      const today = new Date().toISOString().split('T')[0];
      const todaysBookings = bookingsRes.data.filter(b => b.date === today);
      setTodayBookings(todaysBookings);
      
      setWalletSummary(walletRes.data);
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      label: 'Total Students', 
      value: stats?.totalStudents || 0, 
      icon: Users, 
      color: 'from-blue-500 to-indigo-600',
      shadow: 'shadow-blue-500/15'
    },
    { 
      label: 'Total Bookings', 
      value: stats?.totalBookings || 0, 
      icon: Calendar, 
      color: 'from-[#7B0080] to-[#A020A0]',
      shadow: 'shadow-[#7B0080]/15'
    },
    { 
      label: 'Total Earnings', 
      value: formatCurrency(stats?.totalEarnings || 0), 
      icon: DollarSign, 
      color: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/15',
      isAmount: true 
    },
    { 
      label: 'Average Rating', 
      value: user?.rating?.toFixed(1) || '0.0', 
      icon: Star, 
      color: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/15'
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="teacher-dashboard">
        {/* Header */}
        <div className="mb-8 animate-slideUp">
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
            Welcome back, {user?.title} {user?.firstName}!
          </h1>
          <p className="text-slate-500 mt-1.5">
            Here's an overview of your tutoring activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
          {/* Today's Bookings */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold font-heading text-slate-900">Today's Sessions</h2>
              <Link 
                to="/teacher/bookings" 
                className="text-sm text-[#7B0080] font-semibold hover:underline flex items-center gap-1"
                data-testid="view-all-bookings-link"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {todayBookings.length === 0 ? (
              <Card>
                <CardContent>
                  <EmptyState 
                    type="bookings"
                    title="No sessions today"
                    description="You don't have any sessions scheduled for today"
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
                {todayBookings.map((booking) => (
                  <Card key={booking.id} hover>
                    <CardContent className="p-5 sm:p-6">
                      <div className="flex items-start gap-4">
                        <Avatar 
                          firstName={booking.studentName?.split(' ')[0]}
                          lastName={booking.studentName?.split(' ')[1]}
                          size="lg"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-slate-900">
                                {booking.studentName || 'Student'}
                              </h3>
                              <p className="text-sm text-slate-500">{booking.subject || booking.sessionType}</p>
                            </div>
                            <Badge status={booking.status}>
                              {booking.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              {formatTime(booking.startTime)}
                            </span>
                            <span className="font-semibold text-[#7B0080]">
                              {formatCurrency(booking.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Link to={`/teacher/bookings/${booking.id}`}>
                          <Button variant="secondary" size="sm" data-testid={`view-booking-${booking.id}`}>
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Earnings Card */}
            <Card className="bg-gradient-to-br from-[#7B0080] to-[#A020A0] text-white overflow-hidden border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Wallet className="w-6 h-6 opacity-80" />
                  <span className="text-sm opacity-80 font-medium">Available Balance</span>
                </div>
                <p className="text-3xl font-bold font-heading mb-2">
                  {formatCurrency(walletSummary.availableBalance || 0)}
                </p>
                <p className="text-sm opacity-80 mb-5">
                  Total earned: {formatCurrency(walletSummary.totalEarned || 0)}
                </p>
                <Link to="/teacher/wallet">
                  <Button 
                    variant="secondary" 
                    className="w-full bg-white/15 text-white border-white/25 hover:bg-white/25 from-transparent to-transparent"
                    data-testid="view-earnings-btn"
                  >
                    View Earnings
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold font-heading text-slate-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link to="/teacher/slots" className="block">
                    <Button variant="secondary" className="w-full justify-start" data-testid="quick-manage-slots">
                      <Calendar className="w-4 h-4 mr-2.5" />
                      Manage Availability
                    </Button>
                  </Link>
                  <Link to="/teacher/bookings" className="block">
                    <Button variant="secondary" className="w-full justify-start" data-testid="quick-my-bookings">
                      <BookOpen className="w-4 h-4 mr-2.5" />
                      My Bookings
                    </Button>
                  </Link>
                  <Link to="/teacher/profile" className="block">
                    <Button variant="secondary" className="w-full justify-start" data-testid="quick-my-profile">
                      <Users className="w-4 h-4 mr-2.5" />
                      My Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default TeacherDashboard;
