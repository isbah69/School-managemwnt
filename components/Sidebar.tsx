import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { Role } from '../types';
import { LayoutDashboard, Users, GraduationCap, Banknote, CalendarCheck, BookOpen, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const { currentUser, logout } = useSchool();
  const location = useLocation();

  if (!currentUser) return null;

  const isActive = (path: string) => location.pathname === path ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white";

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: [Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT] },
    { name: 'Students', path: '/students', icon: GraduationCap, roles: [Role.ADMIN, Role.TEACHER] },
    { name: 'Teachers', path: '/teachers', icon: Users, roles: [Role.ADMIN] },
    { name: 'Finance', path: '/finance', icon: Banknote, roles: [Role.ADMIN, Role.PARENT] },
    { name: 'Attendance', path: '/attendance', icon: CalendarCheck, roles: [Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT] },
    { name: 'Academics', path: '/academics', icon: BookOpen, roles: [Role.ADMIN, Role.TEACHER, Role.STUDENT] },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 overflow-y-auto z-20 transition-all duration-300">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">EduSphere</h1>
        <p className="text-xs text-slate-400 mt-1">Management System</p>
      </div>

      <div className="flex-1 py-6 space-y-1">
        {navItems.filter(item => item.roles.includes(currentUser.role)).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 transition-colors ${isActive(item.path)}`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">
            {currentUser.name.charAt(0)}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{currentUser.name}</p>
            <p className="text-xs text-slate-400">{currentUser.role}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
