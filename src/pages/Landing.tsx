import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Search, Calendar, Video, Star, CheckCircle, ArrowRight,
  GraduationCap, Users, Award, Sparkles
} from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { Button, Card, CardContent } from '../components/common';
import { SUBJECTS } from '../types';

const Landing = () => {
  const features = [
    {
      icon: Search,
      title: 'Browse Teachers',
      description: 'Search and filter through qualified tutors by subject, grade, and price.',
    },
    {
      icon: Calendar,
      title: 'Book Sessions',
      description: 'Choose available time slots that fit your schedule and book instantly.',
    },
    {
      icon: Video,
      title: 'Learn Online',
      description: 'Join video sessions from anywhere using our mobile app.',
    },
  ];

  const stats = [
    { value: '500+', label: 'Qualified Teachers' },
    { value: '10,000+', label: 'Sessions Completed' },
    { value: '4.8', label: 'Average Rating' },
  ];

  const popularSubjects = SUBJECTS.slice(0, 8);

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Dot grid background */}
        <div className="absolute inset-0 bg-dot-grid opacity-50" />
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-mesh" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center max-w-4xl mx-auto animate-slideUp">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#7B0080]/10 text-[#7B0080] text-sm font-semibold rounded-full mb-8">
              <Sparkles className="w-4 h-4" />
              South Africa's #1 Tutoring Platform
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-slate-900 tracking-tight mb-6 leading-[1.1]">
              Find the Best Teachers{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7B0080] to-[#A020A0]">Near You</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect with qualified tutors for personalized learning. 
              Browse, book, and learn at your own pace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/role-select">
                <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-[#7B0080]/20" data-testid="hero-get-started-btn">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/auth/teacher/signup">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto" data-testid="hero-become-teacher-btn">
                  Become a Teacher
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center animate-slideUp">
                <p className="text-3xl sm:text-4xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-r from-[#7B0080] to-[#A020A0]">{stat.value}</p>
                <p className="text-sm text-slate-500 mt-1.5 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold tracking-[0.2em] uppercase text-[#7B0080] mb-3 block">
              How It Works
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-slate-900 tracking-tight">
              Start Learning in 3 Easy Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} hover className="text-center group">
                  <CardContent className="pt-10 pb-10">
                    <div className="w-16 h-16 bg-[#7B0080]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#7B0080]/15 transition-colors duration-300">
                      <Icon className="w-8 h-8 text-[#7B0080]" />
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-br from-[#7B0080] to-[#A020A0] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold shadow-md shadow-[#7B0080]/20">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold font-heading text-slate-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Subjects */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold tracking-[0.2em] uppercase text-[#7B0080] mb-3 block">
              Subjects
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-slate-900 tracking-tight">
              Popular Subjects
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {popularSubjects.map((subject, index) => (
              <div 
                key={subject}
                className="bg-white border border-slate-200/60 rounded-xl p-5 text-center hover:border-[#7B0080]/30 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <GraduationCap className="w-8 h-8 text-[#7B0080] mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <p className="text-sm font-semibold text-slate-900">{subject}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/auth/student/signup">
              <Button variant="secondary" data-testid="view-all-subjects-btn">
                View All Subjects
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-semibold tracking-[0.2em] uppercase text-[#7B0080] mb-3 block">
                Why Choose Us
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-slate-900 mb-8 tracking-tight">
                Quality Education at Your Fingertips
              </h2>
              <div className="space-y-5">
                {[
                  { icon: CheckCircle, text: 'Verified and qualified teachers' },
                  { icon: Star, text: 'Ratings and reviews from real students' },
                  { icon: Award, text: 'Flexible scheduling options' },
                  { icon: Users, text: 'Personalized learning experience' },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.text} className="flex items-center gap-4 group">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors duration-300">
                        <Icon className="w-5 h-5 text-emerald-600" />
                      </div>
                      <p className="text-slate-700 font-medium">{item.text}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-10">
                <Link to="/auth/role-select">
                  <Button data-testid="why-choose-get-started-btn">
                    Start Learning Today
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/5212321/pexels-photo-5212321.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                alt="Teacher in classroom"
                className="rounded-2xl shadow-2xl shadow-slate-200/50"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-xl shadow-xl shadow-slate-200/30 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#7B0080]/10 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-[#7B0080]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-heading text-slate-900">4.8/5</p>
                    <p className="text-sm text-slate-500">Average Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#7B0080] to-[#3D0040] relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-white mb-6 tracking-tight">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-base sm:text-lg text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students and teachers on Find Teacher. 
            Get personalized tutoring and achieve your academic goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/student/signup">
              <Button 
                variant="secondary" 
                size="lg" 
                className="w-full sm:w-auto bg-white text-[#7B0080] hover:bg-white/90 border-transparent shadow-lg"
                data-testid="cta-student-signup-btn"
              >
                Sign Up as Student
              </Button>
            </Link>
            <Link to="/auth/teacher/signup">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-white/15 text-white border border-white/25 hover:bg-white/25 from-transparent to-transparent"
                data-testid="cta-teacher-signup-btn"
              >
                Become a Teacher
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default Landing;
