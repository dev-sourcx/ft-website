import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { registerPushNotifications } from '../utils/pushNotifications';

type UserRole = 'student' | 'teacher' | null;

interface AuthContextValue {
  user: any;
  userRole: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginStudent: (email: string, password: string) => Promise<boolean>;
  loginTeacher: (email: string, password: string) => Promise<boolean>;
  signupStudent: (data: Record<string, any>) => Promise<boolean>;
  signupTeacher: (data: Record<string, any>) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Record<string, any>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('userRole');
    
    if (storedUser && storedRole) {
      try {
        setUser(JSON.parse(storedUser));
        setUserRole(storedRole as UserRole);
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
      }
    }
    setIsLoading(false);
  }, []);

  const loginStudent = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.post('/students/login', { email, password });
      const studentData = response.data;
      
      setUser(studentData);
      setUserRole('student');
      localStorage.setItem('user', JSON.stringify(studentData));
      localStorage.setItem('userRole', 'student');
      
      toast.success(`Welcome back, ${studentData.firstName}!`);
      
      // Register for push notifications
      registerPushNotifications(studentData.id, 'student').catch(() => {});
      
      return true;
    } catch (error: any) {
      const message = (error as any).response?.data?.detail || 'Invalid email or password';
      toast.error(message);
      return false;
    }
  }, []);

  const loginTeacher = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.post('/teachers/login', { email, password });
      const teacherData = response.data;
      
      setUser(teacherData);
      setUserRole('teacher');
      localStorage.setItem('user', JSON.stringify(teacherData));
      localStorage.setItem('userRole', 'teacher');
      
      toast.success(`Welcome back, ${teacherData.title} ${teacherData.firstName}!`);
      
      // Register for push notifications
      registerPushNotifications(teacherData.id, 'teacher').catch(() => {});
      
      return true;
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Invalid email or password';
      toast.error(message);
      return false;
    }
  }, []);

  const signupStudent = useCallback(async (data) => {
    try {
      const response = await api.post('/students/signup', data);
      const studentData = response.data;
      
      setUser(studentData);
      setUserRole('student');
      localStorage.setItem('user', JSON.stringify(studentData));
      localStorage.setItem('userRole', 'student');
      
      toast.success('Account created successfully!');
      return true;
    } catch (error: any) {
      const message = (error as any).response?.data?.detail || 'Failed to create account';
      toast.error(message);
      return false;
    }
  }, []);

  const signupTeacher = useCallback(async (data: Record<string, any>) => {
    try {
      const response = await api.post('/teachers/signup', data);
      const teacherData = response.data;
      
      setUser(teacherData);
      setUserRole('teacher');
      localStorage.setItem('user', JSON.stringify(teacherData));
      localStorage.setItem('userRole', 'teacher');
      
      toast.success('Account created successfully!');
      return true;
    } catch (error: any) {
      const message = (error as any).response?.data?.detail || 'Failed to create account';
      toast.error(message);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setUserRole(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    toast.success('Logged out successfully');
  }, []);

  const updateUser = useCallback((data: Record<string, any>) => {
    setUser((prev: any) => {
      const updated = { ...prev, ...data };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = {
    user,
    userRole,
    isAuthenticated: !!user,
    isLoading,
    loginStudent,
    loginTeacher,
    signupStudent,
    signupTeacher,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
