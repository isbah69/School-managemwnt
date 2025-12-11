export enum Role {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  parentName: string;
  contact: string;
  email: string;
  address: string;
  enrollmentDate: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  email: string;
  phone: string;
  salary: number;
  joinDate: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  studentId?: string; // If student attendance
  teacherId?: string; // If teacher attendance
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  remarks?: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  amount: number;
  dueDate: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  title: string; // e.g., "Term 1 Tuition"
  paymentDate?: string;
}

export interface ClassSession {
  id: string;
  grade: string;
  subject: string;
  teacherId: string;
  day: string; // "Monday", etc.
  time: string; // "09:00 - 10:00"
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  audience: Role[];
}

// Stats for dashboard
export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  attendanceRate: number; // percentage
  collectedFees: number;
  pendingFees: number;
}
