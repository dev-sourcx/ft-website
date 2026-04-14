import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, MapPin, BadgeCheck, Calendar, Clock, Award, 
  GraduationCap, BookOpen, ArrowLeft 
} from 'lucide-react';
import { PageWrapper } from '../../components/layout';
import { Card, CardContent, Button, Avatar, Badge, Loader, EmptyState } from '../../components/common';
import api from '../../api/axios';
import { formatCurrency, getRelativeTime } from '../../utils/helpers';

const TeacherProfile = () => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeacherData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchTeacherData = async () => {
    try {
      const [teacherRes, reviewsRes] = await Promise.all([
        api.get(`/teachers/${id}`),
        api.get(`/reviews/teacher/${id}`),
      ]);
      setTeacher(teacherRes.data);
      setReviews(reviewsRes.data);
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') console.error('Error fetching teacher:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={`star-${i}`}
        className={`w-4 h-4 ${
          i < rating 
            ? 'text-amber-500 fill-amber-500' 
            : 'text-slate-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center py-12">
            <Loader size="lg" />
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (!teacher) {
    return (
      <PageWrapper>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent>
              <EmptyState 
                title="Teacher not found"
                description="The teacher you're looking for doesn't exist"
                action={
                  <Link to="/student/teachers">
                    <Button>Browse Teachers</Button>
                  </Link>
                }
              />
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="teacher-profile-page">
        <Link 
          to="/student/teachers" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#7B0080] mb-6 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Teachers
        </Link>

        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6">
              <Avatar 
                src={teacher.profilePhoto}
                firstName={teacher.firstName}
                lastName={teacher.lastName}
                size="2xl"
                className="mx-auto sm:mx-0"
              />
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl font-bold font-heading text-slate-900">
                    {teacher.title} {teacher.firstName} {teacher.lastName}
                  </h1>
                  {teacher.isVerified && (
                    <BadgeCheck className="w-6 h-6 text-[#7B0080]" />
                  )}
                </div>
                <p className="text-slate-500 mt-1">
                  {teacher.professionalTitle || 'Teacher'}
                </p>
                
                <div className="flex items-center justify-center sm:justify-start gap-4 mt-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-slate-900">{teacher.rating?.toFixed(1) || '0.0'}</span>
                    <span className="text-slate-500">({teacher.totalReviews || 0} reviews)</span>
                  </div>
                  <span className="text-slate-300">|</span>
                  <span className="font-bold text-[#7B0080] text-lg">
                    {formatCurrency(teacher.pricePerSession)}/session
                  </span>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
                  <Link to={`/student/book/${teacher.id}`}>
                    <Button className="w-full sm:w-auto" data-testid="book-session-btn">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book a Session
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {teacher.shortBio && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold font-heading text-slate-900 mb-3">About</h2>
                  <p className="text-slate-600 leading-relaxed">{teacher.shortBio}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold font-heading text-slate-900 mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#7B0080]" />
                  Subjects
                </h2>
                <div className="flex flex-wrap gap-2">
                  {teacher.subjects?.map((subject, index) => (
                    <Badge key={index} variant="primary">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold font-heading text-slate-900 mb-3 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#7B0080]" />
                  Teaching Grades
                </h2>
                <div className="flex flex-wrap gap-2">
                  {teacher.grades?.map((grade, index) => (
                    <Badge key={index} variant="default">
                      {grade}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {teacher.academicQualifications?.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold font-heading text-slate-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#7B0080]" />
                    Qualifications
                  </h2>
                  <div className="space-y-3">
                    {teacher.academicQualifications.map((qual, index) => (
                      <div key={`${qual.qualification}-${index}`} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                        <div className="w-2 h-2 bg-[#7B0080] rounded-full mt-2" />
                        <div>
                          <p className="font-semibold text-slate-900">{qual.qualification}</p>
                          {qual.institution && (
                            <p className="text-sm text-slate-500">
                              {qual.institution} {qual.year && `| ${qual.year}`}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold font-heading text-slate-900 mb-4">
                  Reviews ({reviews.length})
                </h2>
                {reviews.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No reviews yet</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar 
                              firstName={review.studentName?.split(' ')[0]}
                              lastName={review.studentName?.split(' ')[1]}
                              size="sm"
                            />
                            <span className="font-semibold text-slate-900">{review.studentName}</span>
                          </div>
                          <span className="text-sm text-slate-500">
                            {getRelativeTime(review.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {renderStars(review.rating)}
                        </div>
                        {review.comment && (
                          <p className="text-slate-600 leading-relaxed">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-bold font-heading text-slate-900 mb-4">Book a Session</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Price per session</span>
                    <span className="font-bold">{formatCurrency(teacher.pricePerSession)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Session duration</span>
                    <span className="font-semibold">1 hour</span>
                  </div>
                </div>
                <Link to={`/student/book/${teacher.id}`}>
                  <Button className="w-full" data-testid="sidebar-book-btn">
                    Book Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {teacher.homeAddress && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold font-heading text-slate-900 mb-3">Location</h3>
                  <div className="flex items-start gap-2 text-slate-600">
                    <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <span className="text-sm">{teacher.homeAddress}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default TeacherProfile;
