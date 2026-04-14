import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, GraduationCap, School } from 'lucide-react';
import { PageWrapper } from '../../components/layout';
import { Card, CardContent, Button, Input, Select } from '../../components/common';
import PhoneInput from '../../components/common/PhoneInput';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const StudentSignup = () => {
  const navigate = useNavigate();
  const { signupStudent } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [grades, setGrades] = useState<any[]>([]);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneCode: '+27',
    phone: '',
    school: '',
    grade: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchGrades();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await api.get('/constants/grades');
      setGrades(response.data.grades || []);
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') console.error('Error fetching grades:', error);
    }
  };

  const updateForm = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.firstName) newErrors.firstName = 'First name is required';
    if (!form.lastName) newErrors.lastName = 'Last name is required';
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const { confirmPassword, phoneCode, phone, ...rest } = form;
    const fullPhone = phone ? `${phoneCode}${phone.replace(/^0+/, '')}` : '';
    const success = await signupStudent({ ...rest, phone: fullPhone });
    setLoading(false);

    if (success) {
      navigate('/student/dashboard');
    }
  };

  return (
    <PageWrapper showFooter={false}>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 bg-dot-grid">
        <Card className="w-full max-w-lg animate-slideUp">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/20">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold font-heading text-slate-900">Create Student Account</h1>
              <p className="text-slate-500 mt-1.5">Join and start learning today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name *"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={(e) => updateForm('firstName', e.target.value)}
                  error={errors.firstName}
                  leftIcon={<User className="w-5 h-5" />}
                  data-testid="student-signup-firstname"
                />
                <Input
                  label="Last Name *"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={(e) => updateForm('lastName', e.target.value)}
                  error={errors.lastName}
                  data-testid="student-signup-lastname"
                />
              </div>

              <Input
                label="Email *"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => updateForm('email', e.target.value)}
                error={errors.email}
                leftIcon={<Mail className="w-5 h-5" />}
                data-testid="student-signup-email"
              />

              <Input
                label="Password *"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password (min 6 characters)"
                value={form.password}
                onChange={(e) => updateForm('password', e.target.value)}
                error={errors.password}
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
                data-testid="student-signup-password"
              />

              <Input
                label="Confirm Password *"
                type="password"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={(e) => updateForm('confirmPassword', e.target.value)}
                error={errors.confirmPassword}
                leftIcon={<Lock className="w-5 h-5" />}
                data-testid="student-signup-confirm-password"
              />

              <PhoneInput
                phoneCode={form.phoneCode}
                phone={form.phone}
                onCodeChange={(code) => updateForm('phoneCode', code)}
                onPhoneChange={(phone) => updateForm('phone', phone)}
                error={errors.phone}
                testIdPrefix="student-signup-"
              />

              <Input
                label="School/College"
                placeholder="Your school or college"
                value={form.school}
                onChange={(e) => updateForm('school', e.target.value)}
                leftIcon={<School className="w-5 h-5" />}
                data-testid="student-signup-school"
              />

              <Select
                label="Grade"
                value={form.grade}
                onChange={(e) => updateForm('grade', e.target.value)}
                options={grades}
                placeholder="Select your grade"
                data-testid="student-signup-grade"
              />

              <Button 
                type="submit" 
                loading={loading} 
                className="w-full"
                data-testid="student-signup-submit"
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-600 text-sm">
                Already have an account?{' '}
                <Link to="/auth/student/login" className="text-[#7B0080] font-medium hover:underline">
                  Sign in
                </Link>
              </p>
              <p className="text-slate-500 text-sm mt-2">
                <Link to="/auth/teacher/signup" className="hover:text-[#7B0080]">
                  Sign up as Teacher instead
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default StudentSignup;
