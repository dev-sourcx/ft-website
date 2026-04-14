// ── Type Definitions for Find Teacher ────────────────────

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profilePhoto?: string;
  school?: string;
  grade?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  createdAt: string;
  isActive: boolean;
}

export interface AcademicQualification {
  qualification: string;
  institution?: string;
  year?: string;
  proofUrl?: string;
}

export interface Teacher {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profilePhoto?: string;
  professionalTitle?: string;
  shortBio?: string;
  subjects: string[];
  grades: string[];
  homeAddress?: string;
  pricePerSession: number;
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  isActive: boolean;
  saIdProofUrl?: string;
  homeAddressProofUrl?: string;
  academicQualifications: AcademicQualification[];
  approvalStatus?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface TeacherPublic {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string;
  professionalTitle?: string;
  shortBio?: string;
  subjects: string[];
  grades: string[];
  pricePerSession: number;
  rating: number;
  totalReviews: number;
  isVerified: boolean;
}

export interface Slot {
  id: string;
  teacherId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'available' | 'booked' | 'cancelled';
  sessionType?: 'video' | 'chat' | 'both';
  duration: number;
  price: number;
}

export interface Booking {
  id: string;
  studentId: string;
  teacherId: string;
  slotId: string;
  subject?: string;
  notes?: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled' | 'declined';
  price: number;
  teacherName?: string;
  teacherPhoto?: string;
  studentName?: string;
  date: string;
  startTime: string;
  endTime?: string;
  sessionType?: string;
  rating?: number;
  feedback?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  teacherId: string;
  studentId: string;
  bookingId: string;
  rating: number;
  comment?: string;
  studentName: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
}

export interface PayfastResponse {
  success: boolean;
  paymentId: string;
  payfastUrl: string;
  payfastData: Record<string, string>;
}

export interface DashboardStats {
  totalBookings?: number;
  accepted?: number;
  completed?: number;
  cancelled?: number;
  totalStudents?: number;
  totalEarnings?: number;
}

// ── Constants ─────────────────────────────────────────────

export const SUBJECTS: string[] = [
  "Accounting", "Business Studies", "Economics", "Life Skills", "Life Orientation",
  "Creative Arts", "Visual Arts", "Design", "Dramatic Arts", "Dance Studies", "Music",
  "Consumer Studies", "Hospitality Studies", "Tourism", "Religion Studies",
  "Mathematics", "Mathematical Literacy", "Natural Sciences", "Natural Sciences and Technology",
  "Physical Sciences", "Life Sciences", "Agricultural Sciences",
  "Social Sciences (History and Geography)", "History", "Geography", "Technology",
  "Information Technology (IT)", "Computer Applications Technology (CAT)",
  "Engineering Graphics and Design (EGD)", "Economic and Management Sciences (EMS)"
];

export const GRADES: string[] = [
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6",
  "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12", "Post School"
];

export const TEACHER_TITLES: readonly { value: string; label: string }[] = [
  { value: "Mr", label: "Mr" },
  { value: "Mrs", label: "Mrs" },
  { value: "Ms", label: "Ms" },
  { value: "Dr", label: "Dr" },
  { value: "Prof", label: "Prof" }
];

export const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  accepted: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  paid: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  completed: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
  declined: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
  available: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  booked: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' }
};
