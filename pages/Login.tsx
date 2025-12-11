import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { Role } from '../types';
import { ShieldCheck, User, Users, Baby } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useSchool();

  const roles = [
    { id: Role.ADMIN, label: 'Management', icon: ShieldCheck, color: 'bg-indigo-500' },
    { id: Role.TEACHER, label: 'Teacher', icon: Users, color: 'bg-emerald-500' },
    { id: Role.STUDENT, label: 'Student', icon: User, color: 'bg-blue-500' },
    { id: Role.PARENT, label: 'Parent', icon: Baby, color: 'bg-amber-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Welcome to EduSphere</h1>
          <p className="text-slate-500">Select your role to access the portal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => login(role.id)}
              className="group relative overflow-hidden rounded-xl border-2 border-slate-100 hover:border-indigo-100 bg-white p-6 transition-all hover:shadow-lg text-left"
            >
              <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
                <role.icon className="w-24 h-24 text-slate-900" />
              </div>
              <div className={`${role.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                <role.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">{role.label}</h3>
              <p className="text-sm text-slate-500 mt-1">Click to login as {role.label.toLowerCase()}</p>
            </button>
          ))}
        </div>
        
        <div className="mt-10 text-center text-xs text-slate-400">
          <p>Demo Mode Enabled • No Password Required</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
