import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, ArrowRight } from 'lucide-react';
import { PageWrapper } from '../../components/layout';
import { Card, CardContent, Button } from '../../components/common';

const RoleSelect = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'student',
      title: "I'm a Student",
      description: 'Find and book sessions with qualified tutors in your area.',
      icon: GraduationCap,
      color: 'from-blue-500 to-indigo-600',
      loginPath: '/auth/student/login',
      signupPath: '/auth/student/signup',
    },
    {
      id: 'teacher',
      title: "I'm a Teacher",
      description: 'Share your knowledge and earn by tutoring students.',
      icon: BookOpen,
      color: 'from-[#7B0080] to-[#A020A0]',
      loginPath: '/auth/teacher/login',
      signupPath: '/auth/teacher/signup',
    },
  ];

  return (
    <PageWrapper showFooter={false}>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 bg-dot-grid">
        <div className="max-w-3xl w-full animate-slideUp">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold font-heading text-slate-900 mb-4 tracking-tight">
              Welcome to Find Teacher
            </h1>
            <p className="text-slate-600 text-base sm:text-lg">
              Choose how you'd like to use the platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <Card 
                  key={role.id} 
                  hover 
                  className="cursor-pointer group"
                  onClick={() => navigate(role.loginPath)}
                  data-testid={`role-${role.id}-card`}
                >
                  <CardContent className="text-center py-12">
                    <div className={`w-20 h-20 bg-gradient-to-br ${role.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-[#7B0080]/15`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-xl font-bold font-heading text-slate-900 mb-2">
                      {role.title}
                    </h2>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                      {role.description}
                    </p>
                    <Button 
                      className="w-full"
                      data-testid={`select-${role.id}-btn`}
                    >
                      Continue as {role.id === 'student' ? 'Student' : 'Teacher'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <p className="text-slate-500 text-sm">
              Don't have an account?{' '}
              <Link to="/auth/student/signup" className="text-[#7B0080] font-semibold hover:underline">
                Sign up as Student
              </Link>
              {' '}or{' '}
              <Link to="/auth/teacher/signup" className="text-[#7B0080] font-semibold hover:underline">
                Sign up as Teacher
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default RoleSelect;
