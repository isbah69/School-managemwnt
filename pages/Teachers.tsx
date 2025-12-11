import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Plus, Phone, Mail, DollarSign } from 'lucide-react';
import { Teacher } from '../types';

const Teachers: React.FC = () => {
  const { teachers, addTeacher } = useSchool();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState<Partial<Teacher>>({
    name: '', subject: '', email: '', phone: '', salary: 40000, joinDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTeacher.name) {
      addTeacher(newTeacher as Teacher);
      setIsModalOpen(false);
      setNewTeacher({ name: '', subject: '', email: '', phone: '', salary: 40000, joinDate: new Date().toISOString().split('T')[0] });
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Teachers</h1>
          <p className="text-slate-500">Manage faculty and payroll</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Teacher
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-100">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Teacher Name</th>
              <th className="px-6 py-4">Subject</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Salary</th>
              <th className="px-6 py-4">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                      {teacher.name.charAt(0)}
                    </div>
                    <span className="font-medium text-slate-800">{teacher.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{teacher.subject}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {teacher.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {teacher.phone}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-700">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-emerald-500" />
                    {teacher.salary.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500">{teacher.joinDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

       {/* Add Teacher Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold mb-6">Recruit New Teacher</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
                <input required type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={newTeacher.name} onChange={e => setNewTeacher({...newTeacher, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Subject</label>
                <input required type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={newTeacher.subject} onChange={e => setNewTeacher({...newTeacher, subject: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-medium text-slate-500 mb-1">Salary</label>
                   <input required type="number" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={newTeacher.salary} onChange={e => setNewTeacher({...newTeacher, salary: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Join Date</label>
                  <input type="date" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={newTeacher.joinDate} onChange={e => setNewTeacher({...newTeacher, joinDate: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                <input required type="email" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={newTeacher.email} onChange={e => setNewTeacher({...newTeacher, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Phone</label>
                <input required type="tel" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={newTeacher.phone} onChange={e => setNewTeacher({...newTeacher, phone: e.target.value})} />
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-lg text-sm">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium">Add Teacher</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teachers;
