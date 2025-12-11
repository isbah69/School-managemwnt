import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Clock, Book, Bell } from 'lucide-react';
import { Notice, Role } from '../types';

const Academics: React.FC = () => {
  const { classes, notices, currentUser, addNotice } = useSchool();
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if(newNoticeTitle && newNoticeContent && currentUser) {
      const n: Notice = {
        id: Math.random().toString(36).substr(2,9),
        title: newNoticeTitle,
        content: newNoticeContent,
        date: new Date().toISOString().split('T')[0],
        author: currentUser.name,
        audience: [Role.STUDENT, Role.PARENT]
      };
      addNotice(n);
      setNewNoticeTitle('');
      setNewNoticeContent('');
    }
  };

  return (
    <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Schedule Section */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Clock className="w-6 h-6 text-indigo-500" />
          Class Schedule
        </h2>
        <div className="space-y-4">
          {classes.map((cls) => (
            <div key={cls.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
              <div>
                <h3 className="font-bold text-slate-800">{cls.subject}</h3>
                <p className="text-sm text-slate-500">Grade {cls.grade} • {cls.day}</p>
              </div>
              <div className="text-right">
                <span className="block text-lg font-bold text-indigo-600">{cls.time}</span>
                <span className="text-xs text-slate-400">Room 304</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Diary / Notices Section */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Book className="w-6 h-6 text-emerald-500" />
          School Diary & Notices
        </h2>

        {/* Post Notice Form (Admin/Teacher only) */}
        {(currentUser?.role === Role.ADMIN || currentUser?.role === Role.TEACHER) && (
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 mb-6">
             <h3 className="font-medium text-slate-700 mb-3 text-sm">Post New Notice</h3>
             <form onSubmit={handlePostNotice} className="space-y-3">
               <input 
                 type="text" 
                 placeholder="Title"
                 className="w-full text-sm p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                 value={newNoticeTitle}
                 onChange={e => setNewNoticeTitle(e.target.value)}
               />
               <textarea 
                 placeholder="Write a message to students and parents..."
                 className="w-full text-sm p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 h-24 resize-none"
                 value={newNoticeContent}
                 onChange={e => setNewNoticeContent(e.target.value)}
               />
               <div className="flex justify-end">
                 <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">Post Notice</button>
               </div>
             </form>
          </div>
        )}

        {/* Notices Feed */}
        <div className="space-y-4">
           {notices.map(notice => (
             <div key={notice.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
               <div className="flex justify-between items-start mb-2">
                 <h3 className="font-bold text-slate-800">{notice.title}</h3>
                 <span className="text-xs text-slate-400">{notice.date}</span>
               </div>
               <p className="text-sm text-slate-600 leading-relaxed mb-3">{notice.content}</p>
               <div className="flex items-center gap-2 text-xs text-slate-400">
                 <Bell className="w-3 h-3" />
                 <span>Posted by {notice.author}</span>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Academics;
