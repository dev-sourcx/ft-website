import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Edit2, Save, X, Plus, 
  Trash2, Upload, BookOpen, GraduationCap, Award
} from 'lucide-react';
import { PageWrapper } from '../../components/layout';
import { Card, CardContent, Button, Input, Select, Avatar, Badge, Modal } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { TEACHER_TITLES, SUBJECTS, GRADES } from '../../types';
import { formatCurrency, getApiErrorMessage } from '../../utils/helpers';

const TeacherProfile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAddQualModal, setShowAddQualModal] = useState(false);
  
  const [form, setForm] = useState({
    title: user?.title || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    professionalTitle: user?.professionalTitle || '',
    shortBio: user?.shortBio || '',
    subjects: user?.subjects || [],
    grades: user?.grades || [],
    pricePerSession: user?.pricePerSession || 250,
    homeAddress: user?.homeAddress || '',
  });

  const [newQualification, setNewQualification] = useState({
    qualification: '',
    institution: '',
    year: '',
  });

  const updateForm = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const toggleSubject = (subject) => {
    setForm(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const toggleGrade = (grade) => {
    setForm(prev => ({
      ...prev,
      grades: prev.grades.includes(grade)
        ? prev.grades.filter(g => g !== grade)
        : [...prev.grades, grade]
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await api.put(`/teachers/${user.id}`, form);
      updateUser(response.data);
      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, 'Failed to update profile'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      title: user?.title || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      professionalTitle: user?.professionalTitle || '',
      shortBio: user?.shortBio || '',
      subjects: user?.subjects || [],
      grades: user?.grades || [],
      pricePerSession: user?.pricePerSession || 250,
      homeAddress: user?.homeAddress || '',
    });
    setEditing(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const response = await api.post('/upload/base64', {
          base64: reader.result,
          filename: `profile_${user.id}.jpg`
        });
        
        await api.put(`/teachers/${user.id}`, { profilePhoto: response.data.url });
        updateUser({ profilePhoto: response.data.url });
        toast.success('Profile photo updated');
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      toast.error('Failed to upload photo');
    }
  };

  const addQualification = async () => {
    if (!newQualification.qualification) {
      toast.error('Please enter qualification name');
      return;
    }

    try {
      const updatedQuals = [...(user.academicQualifications || []), newQualification];
      await api.put(`/teachers/${user.id}`, { academicQualifications: updatedQuals });
      updateUser({ academicQualifications: updatedQuals });
      toast.success('Qualification added');
      setShowAddQualModal(false);
      setNewQualification({ qualification: '', institution: '', year: '' });
    } catch (error: any) {
      toast.error('Failed to add qualification');
    }
  };

  const removeQualification = async (index) => {
    try {
      const updatedQuals = user.academicQualifications.filter((_, i) => i !== index);
      await api.put(`/teachers/${user.id}`, { academicQualifications: updatedQuals });
      updateUser({ academicQualifications: updatedQuals });
      toast.success('Qualification removed');
    } catch (error: any) {
      toast.error('Failed to remove qualification');
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="teacher-profile-page">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">My Profile</h1>
          {!editing ? (
            <Button onClick={() => setEditing(true)} data-testid="edit-profile-btn">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} loading={loading} data-testid="save-profile-btn">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </div>

        {/* Profile Photo & Basic Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar 
                  src={user?.profilePhoto}
                  firstName={user?.firstName}
                  lastName={user?.lastName}
                  size="2xl"
                />
                <input
                  type="file"
                  id="profilePhoto"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                <button
                  onClick={() => document.getElementById('profilePhoto').click()}
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#7B0080] text-white rounded-full flex items-center justify-center hover:bg-[#3D0040] transition-colors"
                  data-testid="change-photo-btn"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {user?.title} {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-slate-500">{user?.professionalTitle || 'Teacher'}</p>
                <p className="text-sm text-slate-400 mt-1">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  {user?.isVerified && (
                    <Badge variant="success">Verified</Badge>
                  )}
                  <Badge variant="primary">{formatCurrency(user?.pricePerSession || 0)}/session</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-[#7B0080]" />
              Personal Information
            </h3>
            
            <div className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <Select
                  label="Title"
                  value={form.title}
                  onChange={(e) => updateForm('title', e.target.value)}
                  options={[...TEACHER_TITLES]}
                  disabled={!editing}
                  data-testid="profile-title"
                />
                <Input
                  label="First Name"
                  value={form.firstName}
                  onChange={(e) => updateForm('firstName', e.target.value)}
                  disabled={!editing}
                  data-testid="profile-firstname"
                />
                <Input
                  label="Last Name"
                  value={form.lastName}
                  onChange={(e) => updateForm('lastName', e.target.value)}
                  disabled={!editing}
                  data-testid="profile-lastname"
                />
              </div>

              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => updateForm('email', e.target.value)}
                disabled={!editing}
                leftIcon={<Mail className="w-5 h-5" />}
                data-testid="profile-email"
              />

              <Input
                label="Phone"
                type="tel"
                value={form.phone}
                onChange={(e) => updateForm('phone', e.target.value)}
                disabled={!editing}
                leftIcon={<Phone className="w-5 h-5" />}
                data-testid="profile-phone"
              />

              <Input
                label="Home Address"
                value={form.homeAddress}
                onChange={(e) => updateForm('homeAddress', e.target.value)}
                disabled={!editing}
                leftIcon={<MapPin className="w-5 h-5" />}
                data-testid="profile-address"
              />
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#7B0080]" />
              Professional Information
            </h3>

            <div className="space-y-4">
              <Input
                label="Professional Title"
                value={form.professionalTitle}
                onChange={(e) => updateForm('professionalTitle', e.target.value)}
                disabled={!editing}
                placeholder="e.g., Senior Mathematics Educator"
                data-testid="profile-professional-title"
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Short Bio
                </label>
                <textarea
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#7B0080]/20 focus:border-[#7B0080] outline-none transition-all resize-none disabled:bg-slate-50"
                  rows={3}
                  value={form.shortBio}
                  onChange={(e) => updateForm('shortBio', e.target.value)}
                  disabled={!editing}
                  placeholder="Tell students about yourself..."
                  data-testid="profile-bio"
                />
              </div>

              <Input
                label="Price per Session (ZAR)"
                type="number"
                value={form.pricePerSession}
                onChange={(e) => updateForm('pricePerSession', parseFloat(e.target.value))}
                disabled={!editing}
                data-testid="profile-price"
              />

              {/* Subjects */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Subjects
                </label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-slate-200 rounded-xl">
                  {SUBJECTS.map((subject) => (
                    <button
                      key={subject}
                      type="button"
                      onClick={() => editing && toggleSubject(subject)}
                      disabled={!editing}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        form.subjects.includes(subject)
                          ? 'bg-[#7B0080] text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:hover:bg-slate-100'
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grades */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Teaching Grades
                </label>
                <div className="flex flex-wrap gap-2">
                  {GRADES.map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => editing && toggleGrade(grade)}
                      disabled={!editing}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        form.grades.includes(grade)
                          ? 'bg-[#7B0080] text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:hover:bg-slate-100'
                      }`}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Qualifications */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#7B0080]" />
                Academic Qualifications
              </h3>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setShowAddQualModal(true)}
                data-testid="add-qualification-btn"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>

            {user?.academicQualifications?.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                No qualifications added yet
              </p>
            ) : (
              <div className="space-y-3">
                {user?.academicQualifications?.map((qual, index) => (
                  <div key={index} className="flex items-start justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-start gap-3">
                      <GraduationCap className="w-5 h-5 text-[#7B0080] mt-0.5" />
                      <div>
                        <p className="font-medium text-slate-900">{qual.qualification}</p>
                        {qual.institution && (
                          <p className="text-sm text-slate-500">
                            {qual.institution} {qual.year && `• ${qual.year}`}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeQualification(index)}
                      className="text-red-500 hover:text-red-600"
                      data-testid={`remove-qual-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Qualification Modal */}
        <Modal
          isOpen={showAddQualModal}
          onClose={() => setShowAddQualModal(false)}
          title="Add Qualification"
          size="sm"
        >
          <div className="space-y-4">
            <Input
              label="Qualification Name *"
              value={newQualification.qualification}
              onChange={(e) => setNewQualification(prev => ({ ...prev, qualification: e.target.value }))}
              placeholder="e.g., Bachelor of Education"
              data-testid="qual-name"
            />
            <Input
              label="Institution"
              value={newQualification.institution}
              onChange={(e) => setNewQualification(prev => ({ ...prev, institution: e.target.value }))}
              placeholder="University/College name"
              data-testid="qual-institution"
            />
            <Input
              label="Year"
              value={newQualification.year}
              onChange={(e) => setNewQualification(prev => ({ ...prev, year: e.target.value }))}
              placeholder="e.g., 2020"
              data-testid="qual-year"
            />
            <div className="flex gap-3 pt-4">
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={() => setShowAddQualModal(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1"
                onClick={addQualification}
                data-testid="confirm-add-qual"
              >
                Add Qualification
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </PageWrapper>
  );
};

export default TeacherProfile;
