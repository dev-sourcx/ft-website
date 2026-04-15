import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Page Imports
import Landing from './pages/Landing';

// Auth Pages
import RoleSelect from './pages/auth/RoleSelect';
import StudentLogin from './pages/auth/StudentLogin';
import StudentSignup from './pages/auth/StudentSignup';
import TeacherLogin from './pages/auth/TeacherLogin';
import TeacherSignup from './pages/auth/TeacherSignup';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import BrowseTeachers from './pages/student/BrowseTeachers';
import TeacherProfile from './pages/student/TeacherProfile';
import BookSession from './pages/student/BookSession';
import StudentMyBookings from './pages/student/MyBookings';
import StudentBookingDetail from './pages/student/BookingDetail';
import StudentProfile from './pages/student/Profile';

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherMyBookings from './pages/teacher/MyBookings';
import TeacherBookingDetail from './pages/teacher/BookingDetail';
import ManageSlots from './pages/teacher/ManageSlots';
import TeacherWallet from './pages/teacher/Wallet';
import TeacherProfilePage from './pages/teacher/Profile';
import PendingApproval from './pages/teacher/PendingApproval';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

// Payment Pages
import PaymentSuccess from './pages/payment/PaymentSuccess';
import PaymentCancel from './pages/payment/PaymentCancel';

// Session Pages
import ChatRoom from './pages/session/ChatRoom';
import VideoCall from './pages/session/VideoCall';

// Protected Route Components
import StudentRoute from './components/student/StudentRoute';
import TeacherRoute from './components/teacher/TeacherRoute';

import './App.css';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AccountDeletion from './pages/AccountDeletion';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/account-deletion" element={<AccountDeletion />} />

            {/* Auth Routes */}
            <Route path="/auth/role-select" element={<RoleSelect />} />
            <Route path="/auth/student/login" element={<StudentLogin />} />
            <Route path="/auth/student/signup" element={<StudentSignup />} />
            <Route path="/auth/teacher/login" element={<TeacherLogin />} />
            <Route path="/auth/teacher/signup" element={<TeacherSignup />} />

            {/* Student Protected Routes */}
            <Route path="/student/dashboard" element={
              <StudentRoute><StudentDashboard /></StudentRoute>
            } />
            <Route path="/student/teachers" element={
              <StudentRoute><BrowseTeachers /></StudentRoute>
            } />
            <Route path="/student/teachers/:id" element={
              <StudentRoute><TeacherProfile /></StudentRoute>
            } />
            <Route path="/student/book/:teacherId" element={
              <StudentRoute><BookSession /></StudentRoute>
            } />
            <Route path="/student/bookings" element={
              <StudentRoute><StudentMyBookings /></StudentRoute>
            } />
            <Route path="/student/bookings/:id" element={
              <StudentRoute><StudentBookingDetail /></StudentRoute>
            } />
            <Route path="/student/profile" element={
              <StudentRoute><StudentProfile /></StudentRoute>
            } />

            {/* Teacher Protected Routes */}
            <Route path="/teacher/pending-approval" element={
              <TeacherRoute><PendingApproval /></TeacherRoute>
            } />
            <Route path="/teacher/dashboard" element={
              <TeacherRoute><TeacherDashboard /></TeacherRoute>
            } />
            <Route path="/teacher/bookings" element={
              <TeacherRoute><TeacherMyBookings /></TeacherRoute>
            } />
            <Route path="/teacher/bookings/:id" element={
              <TeacherRoute><TeacherBookingDetail /></TeacherRoute>
            } />
            <Route path="/teacher/slots" element={
              <TeacherRoute><ManageSlots /></TeacherRoute>
            } />
            <Route path="/teacher/wallet" element={
              <TeacherRoute><TeacherWallet /></TeacherRoute>
            } />
            <Route path="/teacher/profile" element={
              <TeacherRoute><TeacherProfilePage /></TeacherRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Session Routes (accessible by both students and teachers) */}
            <Route path="/session/chat/:bookingId" element={<ChatRoom />} />
            <Route path="/session/video/:bookingId" element={<VideoCall />} />

            {/* Payment Callback Routes */}
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Toast Notifications */}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#111827',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                padding: '12px 16px',
                fontSize: '14px',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
