import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../common/Loader';

const StudentRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, userRole, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/student/login" state={{ from: location }} replace />;
  }

  if (userRole !== 'student') {
    return <Navigate to="/auth/role-select" replace />;
  }

  return <>{children}</>;
};

export default StudentRoute;
