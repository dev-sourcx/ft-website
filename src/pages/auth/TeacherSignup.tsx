import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, Lock, Eye, EyeOff, User, BookOpen, 
  MapPin, Upload, Check, ChevronRight, ChevronLeft
} from 'lucide-react';
import { PageWrapper } from '../../components/layout';
import { Card, CardContent, Button, Input, Select } from '../../components/common';
import PhoneInput from '../../components/common/PhoneInput';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { TEACHER_TITLES, SUBJECTS, GRADES } from '../../types';

const TeacherSignup = () => {
  const navigate = useNavigate();
  const { signupTeacher } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    // Step 1
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneCode: '+27',
    phone: '',
    // Step 2
    professionalTitle: '',
    shortBio: '',
    subjects: [] as string[],
    grades: [] as string[],
    pricePerSession: '250',
    homeAddress: '',
    // Step 3 - Documents (handled separately)
  });

  const [documents, setDocuments] = useState({
    saIdProof: null,
    homeAddressProof: null,
    qualifications: [],
  });

  const [currentQualification, setCurrentQualification] = useState({
    qualification: '',
    proof: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateForm = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const toggleSubject = (subject) => {
    setForm(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const toggleGrade = (grade) => {
    setForm(prev => ({
      ...prev,
      grades: prev.grades.includes(grade)
        ? prev.grades.filter(g => g !== grade)
        : [...prev.grades, grade]
    }));
  };

  const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Only PDF, JPG, and PNG files are allowed');
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size must be less than 5MB');
      return false;
    }
    return true;
  };

  const handleFileChange = (type: string, file: File) => {
    if (!file) return;
    if (!validateFile(file)) return;
    setDocuments(prev => ({ ...prev, [type]: file }));
  };

  const addQualification = () => {
    if (!currentQualification.qualification) {
      toast.error('Please enter qualification name');
      return;
    }
    if (!currentQualification.proof) {
      toast.error('Qualification document is mandatory');
      return;
    }
    setDocuments(prev => ({
      ...prev,
      qualifications: [...prev.qualifications, { ...currentQualification }]
    }));
    setCurrentQualification({ qualification: '', proof: null });
  };

  const removeQualification = (index: number) => {
    setDocuments(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!form.title) newErrors.title = 'Title is required';
      if (!form.firstName) newErrors.firstName = 'First name is required';
      if (!form.lastName) newErrors.lastName = 'Last name is required';
      if (!form.email) newErrors.email = 'Email is required';
      if (!form.password) newErrors.password = 'Password is required';
      if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (step === 2) {
      if (form.subjects.length === 0) newErrors.subjects = 'Select at least one subject';
      if (form.grades.length === 0) newErrors.grades = 'Select at least one grade';
    }
    
    if (step === 3) {
      if (!documents.saIdProof) newErrors.saIdProof = 'SA ID proof is required';
      if (!form.homeAddress) newErrors.homeAddress = 'Home address is required';
      if (!documents.homeAddressProof) newErrors.homeAddressProof = 'Address proof is required';
      if (documents.qualifications.length === 0) newErrors.qualifications = 'Add at least one qualification';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/upload/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.url;
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') console.error('Upload error:', error);
      toast.error(`Failed to upload ${file.name}. File may be too large.`);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      // Upload documents individually
      let saIdProofUrl = null;
      let homeAddressProofUrl = null;

      if (documents.saIdProof) {
        saIdProofUrl = await uploadFile(documents.saIdProof);
      }
      if (documents.homeAddressProof) {
        homeAddressProofUrl = await uploadFile(documents.homeAddressProof);
      }

      // Upload qualification proofs
      const academicQualifications = [];
      for (const qual of documents.qualifications) {
        let proofUrl = null;
        if (qual.proof) {
          proofUrl = await uploadFile(qual.proof);
        }
        academicQualifications.push({
          qualification: qual.qualification,
          proofUrl: proofUrl,
        });
      }

      const fullPhone = form.phone ? `${form.phoneCode}${form.phone.replace(/^0+/, '')}` : '';

      const teacherData = {
        title: form.title,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        phone: fullPhone,
        professionalTitle: form.professionalTitle,
        shortBio: form.shortBio,
        subjects: form.subjects,
        grades: form.grades,
        pricePerSession: parseFloat(form.pricePerSession) || 250,
        homeAddress: form.homeAddress,
        saIdProofUrl,
        homeAddressProofUrl,
        academicQualifications,
      };

      const success = await signupTeacher(teacherData);
      if (success) {
        navigate('/teacher/dashboard');
      }
    } catch (error: any) {
      const detail = error?.response?.data?.detail;
      if (typeof detail === 'string') {
        if (detail.toLowerCase().includes('email') && detail.toLowerCase().includes('exist')) {
          toast.error('An account with this email already exists');
          setErrors(prev => ({ ...prev, email: 'Account already exists with this email' }));
          setCurrentStep(1);
        } else if (detail.toLowerCase().includes('phone') && detail.toLowerCase().includes('exist')) {
          toast.error('An account with this phone number already exists');
          setErrors(prev => ({ ...prev, phone: 'Account already exists with this phone' }));
          setCurrentStep(1);
        } else {
          toast.error(detail);
        }
      } else {
        toast.error('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Personal Info' },
    { number: 2, title: 'Professional Info' },
    { number: 3, title: 'Documents' },
  ];

  return (
    <PageWrapper showFooter={false}>
      <div className="min-h-[calc(100vh-64px)] py-12 px-4 bg-dot-grid">
        <div className="max-w-2xl mx-auto animate-slideUp">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all duration-300 ${
                        currentStep >= step.number
                          ? 'bg-gradient-to-br from-[#7B0080] to-[#A020A0] text-white shadow-md shadow-[#7B0080]/20'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {currentStep > step.number ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <span className="text-xs mt-1 text-slate-600">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div 
                      className={`w-20 h-1 mx-2 ${
                        currentStep > step.number ? 'bg-[#7B0080]' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#7B0080] to-[#A020A0] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Teacher Registration</h1>
                <p className="text-slate-600 mt-1">Step {currentStep} of 3</p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Step 1: Personal Info */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <Select
                      label="Title *"
                      value={form.title}
                      onChange={(e) => updateForm('title', e.target.value)}
                      options={[...TEACHER_TITLES]}
                      placeholder="Select title"
                      error={errors.title}
                      data-testid="teacher-signup-title"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="First Name *"
                        placeholder="First name"
                        value={form.firstName}
                        onChange={(e) => updateForm('firstName', e.target.value)}
                        error={errors.firstName}
                        leftIcon={<User className="w-5 h-5" />}
                        data-testid="teacher-signup-firstname"
                      />
                      <Input
                        label="Last Name *"
                        placeholder="Last name"
                        value={form.lastName}
                        onChange={(e) => updateForm('lastName', e.target.value)}
                        error={errors.lastName}
                        data-testid="teacher-signup-lastname"
                      />
                    </div>

                    <Input
                      label="Email *"
                      type="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                      error={errors.email}
                      leftIcon={<Mail className="w-5 h-5" />}
                      data-testid="teacher-signup-email"
                    />

                    <Input
                      label="Password *"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={form.password}
                      onChange={(e) => updateForm('password', e.target.value)}
                      error={errors.password}
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
                      data-testid="teacher-signup-password"
                    />

                    <Input
                      label="Confirm Password *"
                      type="password"
                      placeholder="Confirm your password"
                      value={form.confirmPassword}
                      onChange={(e) => updateForm('confirmPassword', e.target.value)}
                      error={errors.confirmPassword}
                      leftIcon={<Lock className="w-5 h-5" />}
                      data-testid="teacher-signup-confirm-password"
                    />

                    <PhoneInput
                      phoneCode={form.phoneCode}
                      phone={form.phone}
                      onCodeChange={(code) => updateForm('phoneCode', code)}
                      onPhoneChange={(phone) => updateForm('phone', phone)}
                      error={errors.phone}
                      testIdPrefix="teacher-signup-"
                    />
                  </div>
                )}

                {/* Step 2: Professional Info */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <Input
                      label="Professional Title"
                      placeholder="e.g., Mathematics Expert"
                      value={form.professionalTitle}
                      onChange={(e) => updateForm('professionalTitle', e.target.value)}
                      data-testid="teacher-signup-professional-title"
                    />

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Short Bio
                      </label>
                      <textarea
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#7B0080]/20 focus:border-[#7B0080] outline-none transition-all resize-none"
                        rows={3}
                        placeholder="Tell students about yourself..."
                        value={form.shortBio}
                        onChange={(e) => updateForm('shortBio', e.target.value)}
                        data-testid="teacher-signup-bio"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Subjects Offered * {errors.subjects && <span className="text-red-500">({errors.subjects})</span>}
                      </label>
                      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border border-slate-200 rounded-xl">
                        {SUBJECTS.map((subject) => (
                          <button
                            key={subject}
                            type="button"
                            onClick={() => toggleSubject(subject)}
                            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                              form.subjects.includes(subject)
                                ? 'bg-[#7B0080] text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {subject}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Teaching Grades * {errors.grades && <span className="text-red-500">({errors.grades})</span>}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {GRADES.map((grade) => (
                          <button
                            key={grade}
                            type="button"
                            onClick={() => toggleGrade(grade)}
                            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                              form.grades.includes(grade)
                                ? 'bg-[#7B0080] text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {grade}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Input
                      label="Price per Session (ZAR)"
                      type="number"
                      placeholder="250"
                      value={form.pricePerSession}
                      onChange={(e) => updateForm('pricePerSession', e.target.value)}
                      data-testid="teacher-signup-price"
                    />

                    <Input
                      label="Home Address"
                      placeholder="Your home address"
                      value={form.homeAddress}
                      onChange={(e) => updateForm('homeAddress', e.target.value)}
                      leftIcon={<MapPin className="w-5 h-5" />}
                      data-testid="teacher-signup-address"
                    />
                  </div>
                )}

                {/* Step 3: Documents */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    {/* SA ID Proof */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        SA ID Proof * {errors.saIdProof && <span className="text-red-500">({errors.saIdProof})</span>}
                      </label>
                      <div 
                        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                          documents.saIdProof 
                            ? 'border-emerald-300 bg-emerald-50' 
                            : 'border-slate-200 hover:border-[#7B0080]/30'
                        }`}
                        onClick={() => document.getElementById('saIdProof').click()}
                      >
                        <input
                          type="file"
                          id="saIdProof"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => handleFileChange('saIdProof', e.target.files[0])}
                        />
                        {documents.saIdProof ? (
                          <div className="flex items-center justify-center gap-2 text-emerald-600">
                            <Check className="w-5 h-5" />
                            <span>{documents.saIdProof.name}</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                            <p className="text-sm text-slate-600">Upload SA ID Document</p>
                            <p className="text-xs text-slate-400">PDF, JPG, PNG (Max 5MB)</p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Home Address */}
                    <Input
                      label="Home Address *"
                      placeholder="Your full home address"
                      value={form.homeAddress}
                      onChange={(e) => updateForm('homeAddress', e.target.value)}
                      error={errors.homeAddress}
                      leftIcon={<MapPin className="w-5 h-5" />}
                    />

                    {/* Address Proof */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Proof of Address * {errors.homeAddressProof && <span className="text-red-500">({errors.homeAddressProof})</span>}
                      </label>
                      <div 
                        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                          documents.homeAddressProof 
                            ? 'border-emerald-300 bg-emerald-50' 
                            : 'border-slate-200 hover:border-[#7B0080]/30'
                        }`}
                        onClick={() => document.getElementById('homeAddressProof').click()}
                      >
                        <input
                          type="file"
                          id="homeAddressProof"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => handleFileChange('homeAddressProof', e.target.files[0])}
                        />
                        {documents.homeAddressProof ? (
                          <div className="flex items-center justify-center gap-2 text-emerald-600">
                            <Check className="w-5 h-5" />
                            <span>{documents.homeAddressProof.name}</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                            <p className="text-sm text-slate-600">Upload Proof of Address</p>
                            <p className="text-xs text-slate-400">PDF, JPG, PNG (Max 5MB)</p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Academic Qualifications */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Academic Qualifications * {errors.qualifications && <span className="text-red-500">({errors.qualifications})</span>}
                      </label>

                      {/* Added Qualifications */}
                      {documents.qualifications.length > 0 && (
                        <div className="space-y-2 mb-4">
                          {documents.qualifications.map((qual, index) => (
                            <div key={`${qual.qualification}-${index}`} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                              <div>
                                <p className="font-medium text-slate-900">{qual.qualification}</p>
                                <p className="text-xs text-slate-500">{qual.proof?.name || 'Document attached'}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeQualification(index)}
                                className="text-red-500 hover:text-red-600"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Qualification Form */}
                      <div className="p-4 border border-slate-200 rounded-xl space-y-3">
                        <Input
                          placeholder="Qualification (e.g., Bachelor of Education)"
                          value={currentQualification.qualification}
                          onChange={(e) => setCurrentQualification(prev => ({ ...prev, qualification: e.target.value }))}
                        />
                        <div 
                          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                            currentQualification.proof 
                              ? 'border-emerald-300 bg-emerald-50' 
                              : 'border-slate-200 hover:border-[#7B0080]/30'
                          }`}
                          onClick={() => document.getElementById('qualProof')?.click()}
                        >
                          <input
                            type="file"
                            id="qualProof"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f && validateFile(f)) {
                                setCurrentQualification(prev => ({ ...prev, proof: f }));
                              }
                            }}
                          />
                          {currentQualification.proof ? (
                            <span className="text-emerald-600">{currentQualification.proof.name}</span>
                          ) : (
                            <>
                              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                              <span className="text-sm text-slate-500">Upload qualification document *</span>
                            </>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={addQualification}
                          className="w-full"
                        >
                          Add Qualification
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-8">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={prevStep}
                      className="flex-1"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Back
                    </Button>
                  )}
                  
                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="flex-1"
                      data-testid="teacher-signup-next"
                    >
                      Continue
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      loading={loading}
                      className="flex-1"
                      data-testid="teacher-signup-submit"
                    >
                      Create Account
                    </Button>
                  )}
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-slate-600 text-sm">
                  Already have an account?{' '}
                  <Link to="/auth/teacher/login" className="text-[#7B0080] font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
};

export default TeacherSignup;
