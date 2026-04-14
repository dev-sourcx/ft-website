import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { PageWrapper } from '../../components/layout';
import { Card, CardContent, Button, Input } from '../../components/common';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/admin/login', form);
      localStorage.setItem('admin', JSON.stringify(response.data));
      toast.success('Welcome, Admin!');
      navigate('/admin/dashboard');
    } catch (error: any) {
      toast.error('Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper showFooter={false}>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 bg-dot-grid">
        <Card className="w-full max-w-md animate-slideUp">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-slate-900/20">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold font-heading text-slate-900">Admin Login</h1>
              <p className="text-slate-500 mt-1.5">Access the admin dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="admin@findteacher.com"
                value={form.email}
                onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                leftIcon={<Mail className="w-5 h-5" />}
                data-testid="admin-login-email"
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter admin password"
                value={form.password}
                onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
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
                data-testid="admin-login-password"
              />

              <Button 
                type="submit" 
                loading={loading} 
                className="w-full"
                data-testid="admin-login-submit"
              >
                Sign In as Admin
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default AdminLogin;
