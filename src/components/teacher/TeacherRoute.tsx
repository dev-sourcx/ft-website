import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../common/Loader';

const TeacherRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, userRole, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/teacher/login" state={{ from: location }} replace />;
  }

  if (userRole !== 'teacher') {
    return <Navigate to="/auth/role-select" replace />;
  }

  // Check if teacher is verified/approved
  // Support both approvalStatus (if exists) and isVerified (external backend)
  // A teacher is approved if:
  // 1. approvalStatus === 'approved', OR
  // 2. isVerified === true (external backend)
  const hasApprovalStatus = user?.approvalStatus !== undefined;
  const isApproved = hasApprovalStatus 
    ? user.approvalStatus === 'approved'
    : user?.isVerified === true;
  
  if (!isApproved) {
    // Allow access to pending approval page
    if (location.pathname === '/teacher/pending-approval') {
      return <>{children}</>;
    }
    return <Navigate to="/teacher/pending-approval" replace />;
  }

  return <>{children}</>;
};

export default TeacherRoute;
