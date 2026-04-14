import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Filter, X, BadgeCheck } from 'lucide-react';
import { PageWrapper } from '../../components/layout';
import { Card, CardContent, Button, Input, Select, Avatar, Badge, Loader, EmptyState } from '../../components/common';
import api from '../../api/axios';
import { formatCurrency } from '../../utils/helpers';
import { SUBJECTS, GRADES } from '../../types';

const BrowseTeachers = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchTeachers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubject, selectedGrade]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      let url = '/teachers/public/list?limit=50';
      if (selectedSubject) url += `&subject=${encodeURIComponent(selectedSubject)}`;
      if (selectedGrade) url += `&grade=${encodeURIComponent(selectedGrade)}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const response = await api.get(url);
      setTeachers(response.data);
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTeachers();
  };

  const clearFilters = () => {
    setSelectedSubject('');
    setSelectedGrade('');
    setSearchQuery('');
  };

  const hasFilters = selectedSubject || selectedGrade || searchQuery;

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="browse-teachers-page">
        {/* Header */}
        <div className="mb-8 animate-slideUp">
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">Find Teachers</h1>
          <p className="text-slate-500 mt-1.5">
            Browse and connect with qualified tutors
          </p>
        </div>

        {/* Search & Filters */}
        <Card className="mb-8">
          <CardContent className="p-5 sm:p-6">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-5 h-5" />}
                  data-testid="teacher-search-input"
                />
              </div>
              <Button type="submit" data-testid="search-teachers-btn">
                Search
              </Button>
              <Button 
                type="button"
                variant="secondary"
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </form>

            <div className={`mt-4 grid sm:grid-cols-3 gap-4 ${showFilters ? 'block' : 'hidden sm:grid'}`}>
              <Select
                placeholder="All Subjects"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                options={SUBJECTS}
                data-testid="subject-filter"
              />
              <Select
                placeholder="All Grades"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                options={GRADES}
                data-testid="grade-filter"
              />
              {hasFilters && (
                <Button 
                  variant="ghost" 
                  onClick={clearFilters}
                  className="text-slate-600"
                  data-testid="clear-filters-btn"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-slate-500 text-sm font-medium">
            {loading ? 'Loading...' : `${teachers.length} teacher${teachers.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Teachers Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size="lg" />
          </div>
        ) : teachers.length === 0 ? (
          <Card>
            <CardContent>
              <EmptyState 
                type="teachers"
                title="No teachers found"
                description="Try adjusting your search or filters"
                action={
                  hasFilters && (
                    <Button variant="secondary" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  )
                }
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
              <Card key={teacher.id} hover data-testid={`teacher-card-${teacher.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar 
                      src={teacher.profilePhoto}
                      firstName={teacher.firstName}
                      lastName={teacher.lastName}
                      size="xl"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 truncate">
                          {teacher.title} {teacher.firstName} {teacher.lastName}
                        </h3>
                        {teacher.isVerified && (
                          <BadgeCheck className="w-5 h-5 text-[#7B0080] flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5 truncate">
                        {teacher.professionalTitle || 'Teacher'}
                      </p>
                    </div>
                  </div>

                  {/* Subjects */}
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-1.5">
                      {teacher.subjects?.slice(0, 3).map((subject, index) => (
                        <Badge key={index} variant="primary" size="sm">
                          {subject}
                        </Badge>
                      ))}
                      {teacher.subjects?.length > 3 && (
                        <Badge variant="default" size="sm">
                          +{teacher.subjects.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Rating & Price */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-slate-900">
                        {teacher.rating?.toFixed(1) || '0.0'}
                      </span>
                      <span className="text-sm text-slate-500">
                        ({teacher.totalReviews || 0})
                      </span>
                    </div>
                    <span className="font-bold text-[#7B0080]">
                      {formatCurrency(teacher.pricePerSession)}
                      <span className="text-xs text-slate-500 font-normal">/session</span>
                    </span>
                  </div>

                  {/* Bio */}
                  {teacher.shortBio && (
                    <p className="mt-3 text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {teacher.shortBio}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="mt-5 flex gap-2">
                    <Link to={`/student/teachers/${teacher.id}`} className="flex-1">
                      <Button variant="secondary" className="w-full" data-testid={`view-profile-${teacher.id}`}>
                        View Profile
                      </Button>
                    </Link>
                    <Link to={`/student/book/${teacher.id}`}>
                      <Button data-testid={`book-session-${teacher.id}`}>
                        Book
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default BrowseTeachers;
