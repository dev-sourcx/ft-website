import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, GraduationCap } from 'lucide-react';
import { PageWrapper } from '../../components/layout';
import { Card, CardContent, Button, Input } from '../../components/common';
import { useAuth } from '../../context/AuthContext';

const StudentLogin = () => {
  const navigate = useNavigate();
  const { loginStudent } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateForm = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const success = await loginStudent(form.email, form.password);
    setLoading(false);

    if (success) {
      navigate('/student/dashboard');
    }
  };

  return (
    <PageWrapper showFooter={false}>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 bg-dot-grid">
        <Card className="w-full max-w-md animate-slideUp">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-500/20">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold font-heading text-slate-900">Student Login</h1>
              <p className="text-slate-500 mt-1.5">Welcome back! Sign in to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => updateForm('email', e.target.value)}
                error={errors.email}
                leftIcon={<Mail className="w-5 h-5" />}
                data-testid="student-login-email"
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => updateForm('password', e.target.value)}
                error={errors.password}
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
                data-testid="student-login-password"
              />

              <Button 
                type="submit" 
                loading={loading} 
                className="w-full"
                data-testid="student-login-submit"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-600 text-sm">
                Don't have an account?{' '}
                <Link to="/auth/student/signup" className="text-[#7B0080] font-semibold hover:underline">
                  Sign up
                </Link>
              </p>
              <p className="text-slate-500 text-sm mt-2">
                <Link to="/auth/teacher/login" className="hover:text-[#7B0080] transition-colors">
                  Login as Teacher instead
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default StudentLogin;
