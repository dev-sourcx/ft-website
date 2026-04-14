import React, { useState } from 'react';
import { User, Mail, Phone, School, GraduationCap, Calendar, Edit2, Save, X } from 'lucide-react';
import { PageWrapper } from '../../components/layout';
import { Card, CardContent, Button, Input, Select, Avatar } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { GRADES } from '../../types';
import { getApiErrorMessage } from '../../utils/helpers';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    school: user?.school || '',
    grade: user?.grade || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || '',
  });

  const updateForm = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await api.put(`/students/${user.id}`, form);
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
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      school: user?.school || '',
      grade: user?.grade || '',
      dateOfBirth: user?.dateOfBirth || '',
      gender: user?.gender || '',
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
        
        await api.put(`/students/${user.id}`, { profilePhoto: response.data.url });
        updateUser({ profilePhoto: response.data.url });
        toast.success('Profile photo updated');
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      toast.error('Failed to upload photo');
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="student-profile-page">
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

        {/* Profile Photo */}
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
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-slate-500">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-900 mb-6">Personal Information</h3>
            
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={form.firstName}
                  onChange={(e) => updateForm('firstName', e.target.value)}
                  disabled={!editing}
                  leftIcon={<User className="w-5 h-5" />}
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
                label="Phone Number"
                type="tel"
                value={form.phone}
                onChange={(e) => updateForm('phone', e.target.value)}
                disabled={!editing}
                leftIcon={<Phone className="w-5 h-5" />}
                data-testid="profile-phone"
              />

              <Input
                label="School/College"
                value={form.school}
                onChange={(e) => updateForm('school', e.target.value)}
                disabled={!editing}
                leftIcon={<School className="w-5 h-5" />}
                data-testid="profile-school"
              />

              <Select
                label="Grade"
                value={form.grade}
                onChange={(e) => updateForm('grade', e.target.value)}
                options={GRADES}
                disabled={!editing}
                data-testid="profile-grade"
              />

              <Input
                label="Date of Birth"
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => updateForm('dateOfBirth', e.target.value)}
                disabled={!editing}
                leftIcon={<Calendar className="w-5 h-5" />}
                data-testid="profile-dob"
              />

              <Select
                label="Gender"
                value={form.gender}
                onChange={(e) => updateForm('gender', e.target.value)}
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                ]}
                disabled={!editing}
                data-testid="profile-gender"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default Profile;
