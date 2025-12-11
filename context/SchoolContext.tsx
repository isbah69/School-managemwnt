import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student, Teacher, AttendanceRecord, FeeRecord, Notice, Role, User, ClassSession } from '../types';

interface SchoolContextType {
  currentUser: User | null;
  login: (role: Role) => void;
  logout: () => void;
  students: Student[];
  teachers: Teacher[];
  attendance: AttendanceRecord[];
  fees: FeeRecord[];
  notices: Notice[];
  classes: ClassSession[];
  
  // Actions
  addStudent: (s: Student) => void;
  addTeacher: (t: Teacher) => void;
  markAttendance: (records: AttendanceRecord[]) => void;
  updateFeeStatus: (id: string, status: 'PAID' | 'PENDING' | 'OVERDUE') => void;
  addNotice: (n: Notice) => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

// Mock Data Generators
const generateId = () => Math.random().toString(36).substr(2, 9);

const MOCK_STUDENTS: Student[] = [
  { id: 's1', name: 'Alice Johnson', grade: '10A', parentName: 'Robert Johnson', contact: '555-0101', email: 'alice@school.com', address: '123 Maple St', enrollmentDate: '2023-09-01' },
  { id: 's2', name: 'Bob Smith', grade: '10A', parentName: 'Sarah Smith', contact: '555-0102', email: 'bob@school.com', address: '456 Oak Ave', enrollmentDate: '2023-09-01' },
  { id: 's3', name: 'Charlie Brown', grade: '11B', parentName: 'James Brown', contact: '555-0103', email: 'charlie@school.com', address: '789 Pine Ln', enrollmentDate: '2022-09-01' },
];

const MOCK_TEACHERS: Teacher[] = [
  { id: 't1', name: 'Mr. Anderson', subject: 'Mathematics', email: 'anderson@school.com', phone: '555-1001', salary: 55000, joinDate: '2020-08-15' },
  { id: 't2', name: 'Ms. Davis', subject: 'Science', email: 'davis@school.com', phone: '555-1002', salary: 52000, joinDate: '2021-01-10' },
];

const MOCK_FEES: FeeRecord[] = [
  { id: 'f1', studentId: 's1', amount: 500, dueDate: '2023-12-01', status: 'PAID', title: 'Term 1 Tuition', paymentDate: '2023-11-28' },
  { id: 'f2', studentId: 's2', amount: 500, dueDate: '2023-12-01', status: 'PENDING', title: 'Term 1 Tuition' },
  { id: 'f3', studentId: 's3', amount: 500, dueDate: '2023-12-01', status: 'OVERDUE', title: 'Term 1 Tuition' },
];

const MOCK_NOTICES: Notice[] = [
  { id: 'n1', title: 'Science Fair 2024', content: 'The annual science fair will be held on March 15th. All students must submit projects by March 1st.', date: '2024-02-10', author: 'Principal', audience: [Role.STUDENT, Role.TEACHER, Role.PARENT] },
  { id: 'n2', title: 'Staff Meeting', content: 'Mandatory staff meeting this Friday at 3 PM in the conference room.', date: '2024-02-12', author: 'Admin', audience: [Role.TEACHER] },
];

export const SchoolProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or mock data
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : MOCK_STUDENTS;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('teachers');
    return saved ? JSON.parse(saved) : MOCK_TEACHERS;
  });

  const [fees, setFees] = useState<FeeRecord[]>(() => {
    const saved = localStorage.getItem('fees');
    return saved ? JSON.parse(saved) : MOCK_FEES;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('attendance');
    return saved ? JSON.parse(saved) : [];
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem('notices');
    return saved ? JSON.parse(saved) : MOCK_NOTICES;
  });

  const [classes] = useState<ClassSession[]>([
    { id: 'c1', grade: '10A', subject: 'Math', teacherId: 't1', day: 'Monday', time: '09:00 - 10:00' },
    { id: 'c2', grade: '10A', subject: 'Science', teacherId: 't2', day: 'Monday', time: '10:00 - 11:00' },
  ]);

  // Persist to local storage
  useEffect(() => localStorage.setItem('currentUser', JSON.stringify(currentUser)), [currentUser]);
  useEffect(() => localStorage.setItem('students', JSON.stringify(students)), [students]);
  useEffect(() => localStorage.setItem('teachers', JSON.stringify(teachers)), [teachers]);
  useEffect(() => localStorage.setItem('fees', JSON.stringify(fees)), [fees]);
  useEffect(() => localStorage.setItem('attendance', JSON.stringify(attendance)), [attendance]);
  useEffect(() => localStorage.setItem('notices', JSON.stringify(notices)), [notices]);

  const login = (role: Role) => {
    const user: User = {
      id: generateId(),
      name: role === Role.ADMIN ? 'Administrator' : role === Role.TEACHER ? 'Jane Doe' : 'Student User',
      email: `${role.toLowerCase()}@edusphere.com`,
      role: role
    };
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const addStudent = (s: Student) => setStudents([...students, { ...s, id: generateId() }]);
  const addTeacher = (t: Teacher) => setTeachers([...teachers, { ...t, id: generateId() }]);
  
  const markAttendance = (records: AttendanceRecord[]) => {
    // Remove existing records for same date/person if any to allow updates
    const newAttendance = attendance.filter(a => 
      !records.some(r => r.date === a.date && (r.studentId === a.studentId || r.teacherId === a.teacherId))
    );
    setAttendance([...newAttendance, ...records]);
  };

  const updateFeeStatus = (id: string, status: 'PAID' | 'PENDING' | 'OVERDUE') => {
    setFees(fees.map(f => f.id === id ? { ...f, status, paymentDate: status === 'PAID' ? new Date().toISOString().split('T')[0] : undefined } : f));
  };

  const addNotice = (n: Notice) => setNotices([n, ...notices]);

  return (
    <SchoolContext.Provider value={{
      currentUser, login, logout,
      students, teachers, attendance, fees, notices, classes,
      addStudent, addTeacher, markAttendance, updateFeeStatus, addNotice
    }}>
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) throw new Error("useSchool must be used within a SchoolProvider");
  return context;
};
