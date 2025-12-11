import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Search, Plus, Filter, Mail, Phone, MapPin, Users } from 'lucide-react';
import { Student } from '../types';

const Students: React.FC = () => {
  const { students, addStudent } = useSchool();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: '', grade: '', parentName: '', contact: '', email: '', address: '', enrollmentDate: new Date().toISOString().split('T')[0]
  });

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudent.name && newStudent.grade) {
      addStudent(newStudent as Student);
      setIsModalOpen(false);
      setNewStudent({ name: '', grade: '', parentName: '', contact: '', email: '', address: '', enrollmentDate: new Date().toISOString().split('T')[0] });
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Students</h1>
          <p className="text-slate-500">Manage student enrollments and details</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or grade..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg">
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map(student => (
          <div key={student.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{student.name}</h3>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">
                    Grade {student.grade}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                <span>Parent: {student.parentName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{student.contact}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{student.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="truncate">{student.address}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold mb-6">Add New Student</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
                <input required type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Grade</label>
                  <input required type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={newStudent.grade} onChange={e => setNewStudent({...newStudent, grade: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Join Date</label>
                  <input type="date" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={newStudent.enrollmentDate} onChange={e => setNewStudent({...newStudent, enrollmentDate: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Parent Name</label>
                <input required type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={newStudent.parentName} onChange={e => setNewStudent({...newStudent, parentName: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Contact Phone</label>
                <input required type="tel" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={newStudent.contact} onChange={e => setNewStudent({...newStudent, contact: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                <input required type="email" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={newStudent.email} onChange={e => setNewStudent({...newStudent, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Address</label>
                <input required type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={newStudent.address} onChange={e => setNewStudent({...newStudent, address: e.target.value})} />
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg text-sm">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium">Add Student</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;