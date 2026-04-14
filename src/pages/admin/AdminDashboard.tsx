import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, BookOpen, Clock, CheckCircle, XCircle, 
  DollarSign, LogOut, Eye, FileText, Star
} from 'lucide-react';
import { PageWrapper } from '../../components/layout';
import { Card, CardContent, Button, Badge, Avatar, Loader, Modal } from '../../components/common';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { formatDate, formatCurrency } from '../../utils/helpers';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [pendingTeachers, setPendingTeachers] = useState<any[]>([]);
  const [allTeachers, setAllTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin');
    if (!storedAdmin) {
      navigate('/admin/login');
      return;
    }
    setAdmin(JSON.parse(storedAdmin));
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [statsRes, pendingRes, allRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/teachers/pending'),
        api.get('/admin/teachers/all'),
      ]);
      setStats(statsRes.data);
      setPendingTeachers(pendingRes.data);
      setAllTeachers(allRes.data);
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') if (process.env.NODE_ENV === 'development') console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (teacherId) => {
    setActionLoading(true);
    try {
      await api.put(`/admin/teachers/${teacherId}/approve`);
      toast.success('Teacher approved successfully');
      fetchData();
    } catch (error: any) {
      toast.error('Failed to approve teacher');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedTeacher) return;
    
    setActionLoading(true);
    try {
      await api.put(`/admin/teachers/${selectedTeacher.id}/reject?reason=${encodeURIComponent(rejectReason)}`);
      toast.success('Teacher rejected');
      setShowRejectModal(false);
      setSelectedTeacher(null);
      setRejectReason('');
      fetchData();
    } catch (error: any) {
      toast.error('Failed to reject teacher');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/admin/login');
    toast.success('Logged out');
  };

  if (loading) {
    return (
      <PageWrapper showFooter={false}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center py-12">
            <Loader size="lg" />
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper showFooter={false}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="admin-dashboard">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-slideUp">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500 mt-1.5">Manage teachers, students, and platform</p>
          </div>
          <Button variant="secondary" onClick={handleLogout} data-testid="admin-logout">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Teachers', value: stats?.totalTeachers || 0, icon: BookOpen, bg: 'bg-purple-50', iconColor: 'text-[#7B0080]' },
            { label: 'Total Students', value: stats?.totalStudents || 0, icon: Users, bg: 'bg-blue-50', iconColor: 'text-blue-600' },
            { label: 'Pending Approvals', value: pendingTeachers.length, icon: Clock, bg: 'bg-amber-50', iconColor: 'text-amber-600', valueColor: 'text-amber-600' },
            { label: 'Total Revenue', value: formatCurrency(stats?.totalRevenue || 0), icon: DollarSign, bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                      <p className={`text-2xl font-bold font-heading ${stat.valueColor || 'text-slate-900'}`}>{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('pending')}
            data-testid="tab-pending"
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'pending'
                ? 'bg-gradient-to-r from-[#7B0080] to-[#A020A0] text-white shadow-md shadow-[#7B0080]/20'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            Pending Approvals ({pendingTeachers.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            data-testid="tab-all"
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-[#7B0080] to-[#A020A0] text-white shadow-md shadow-[#7B0080]/20'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            All Teachers ({allTeachers.length})
          </button>
        </div>

        {/* Teachers List */}
        {activeTab === 'pending' ? (
          pendingTeachers.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold font-heading text-slate-900 mb-2">All Caught Up!</h3>
                <p className="text-slate-500">No pending teacher approvals at the moment.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingTeachers.map((teacher) => (
                <TeacherCard
                  key={teacher.id}
                  teacher={teacher}
                  onApprove={() => handleApprove(teacher.id)}
                  onReject={() => {
                    setSelectedTeacher(teacher);
                    setShowRejectModal(true);
                  }}
                  actionLoading={actionLoading}
                  showActions={true}
                />
              ))}
            </div>
          )
        ) : (
          <div className="space-y-4">
            {allTeachers.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                onApprove={() => handleApprove(teacher.id)}
                onReject={() => {
                  setSelectedTeacher(teacher);
                  setShowRejectModal(true);
                }}
                actionLoading={actionLoading}
                showActions={teacher.approvalStatus === 'pending'}
              />
            ))}
          </div>
        )}

        {/* Reject Modal */}
        <Modal
          isOpen={showRejectModal}
          onClose={() => {
            setShowRejectModal(false);
            setSelectedTeacher(null);
            setRejectReason('');
          }}
          title="Reject Teacher"
        >
          <div>
            <p className="text-slate-600 mb-4">
              Are you sure you want to reject <strong>{selectedTeacher?.title} {selectedTeacher?.firstName} {selectedTeacher?.lastName}</strong>?
            </p>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Reason for rejection (optional)
              </label>
              <textarea
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#7B0080]/20 focus:border-[#7B0080] outline-none transition-all duration-200"
                rows={3}
                placeholder="Enter reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="danger"
                className="flex-1"
                onClick={handleReject}
                loading={actionLoading}
                data-testid="confirm-reject-btn"
              >
                Reject Teacher
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </PageWrapper>
  );
};

// Teacher Card Component
const TeacherCard = ({ teacher, onApprove, onReject, actionLoading, showActions }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card data-testid={`teacher-card-${teacher.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar 
            src={teacher.profilePhoto}
            firstName={teacher.firstName}
            lastName={teacher.lastName}
            size="xl"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <h3 className="font-bold text-slate-900">
                  {teacher.title} {teacher.firstName} {teacher.lastName}
                </h3>
                <p className="text-sm text-slate-500">{teacher.professionalTitle || 'Teacher'}</p>
                <p className="text-xs text-slate-400 mt-1">{teacher.email}</p>
              </div>
              <div className="flex items-center gap-2">
                {teacher.approvalStatus === 'approved' && (
                  <Badge variant="success">Approved</Badge>
                )}
                {teacher.approvalStatus === 'rejected' && (
                  <Badge variant="danger">Rejected</Badge>
                )}
                {teacher.approvalStatus === 'pending' && (
                  <Badge variant="warning">Pending</Badge>
                )}
                {teacher.isVerified && (
                  <Badge variant="info">Verified</Badge>
                )}
              </div>
            </div>

            {/* Quick Info */}
            <div className="mt-3 flex flex-wrap gap-2">
              {teacher.subjects?.slice(0, 3).map((subject, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-[#7B0080]/10 text-[#7B0080] rounded-full text-xs font-semibold">
                  {subject}
                </span>
              ))}
              {teacher.subjects?.length > 3 && (
                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
                  +{teacher.subjects.length - 3} more
                </span>
              )}
            </div>

            <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
              <span className="font-medium">{formatCurrency(teacher.pricePerSession)}/session</span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-500" />
                {teacher.rating?.toFixed(1) || '0.0'}
              </span>
              <span>Registered: {formatDate(teacher.createdAt)}</span>
            </div>

            {/* Expand Details */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-3 text-sm text-[#7B0080] font-semibold hover:underline flex items-center gap-1"
            >
              <Eye className="w-4 h-4" />
              {expanded ? 'Hide Details' : 'View Details'}
            </button>

            {expanded && (
              <div className="mt-4 p-5 bg-slate-50 rounded-xl space-y-4 animate-slideDown">
                {teacher.shortBio && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Bio</p>
                    <p className="text-sm text-slate-700">{teacher.shortBio}</p>
                  </div>
                )}
                {teacher.homeAddress && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Address</p>
                    <p className="text-sm text-slate-700">{teacher.homeAddress}</p>
                  </div>
                )}
                {teacher.phone && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Phone</p>
                    <p className="text-sm text-slate-700">{teacher.phone}</p>
                  </div>
                )}
                
                {/* Documents */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Documents</p>
                  <div className="flex flex-wrap gap-2">
                    {teacher.saIdProofUrl && (
                      <a 
                        href={teacher.saIdProofUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        ID Proof
                      </a>
                    )}
                    {teacher.homeAddressProofUrl && (
                      <a 
                        href={teacher.homeAddressProofUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Address Proof
                      </a>
                    )}
                  </div>
                </div>

                {/* Qualifications */}
                {teacher.academicQualifications?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Qualifications</p>
                    <div className="space-y-1">
                      {teacher.academicQualifications.map((qual, idx) => (
                        <div key={`${qual.qualification}-${idx}`} className="text-sm text-slate-700">
                          &bull; {qual.qualification} {qual.institution && `- ${qual.institution}`} {qual.year && `(${qual.year})`}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {teacher.rejectionReason && (
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-xs font-semibold text-red-700 mb-1">Rejection Reason</p>
                    <p className="text-sm text-red-600">{teacher.rejectionReason}</p>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            {showActions && (
              <div className="mt-4 flex gap-2">
                <Button 
                  size="sm" 
                  onClick={onApprove}
                  loading={actionLoading}
                  data-testid={`approve-${teacher.id}`}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={onReject}
                  data-testid={`reject-${teacher.id}`}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
