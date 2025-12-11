import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { Role } from '../types';
import { Users, GraduationCap, DollarSign, Calendar, Sparkles } from 'lucide-react';
import { generateSchoolReport } from '../services/geminiService';

const Dashboard: React.FC = () => {
  const { currentUser, students, teachers, fees, attendance } = useSchool();
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Calculated Stats
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalRevenue = fees.filter(f => f.status === 'PAID').reduce((acc, curr) => acc + curr.amount, 0);
  const pendingFees = fees.filter(f => f.status === 'PENDING' || f.status === 'OVERDUE').reduce((acc, curr) => acc + curr.amount, 0);

  const handleAskAI = async () => {
    if (!aiPrompt.trim()) return;
    setLoading(true);
    setAiResponse(null);

    const contextData = JSON.stringify({
      stats: { totalStudents, totalTeachers, totalRevenue, pendingFees },
      fees_summary: fees.slice(0, 5), // Limit context
      recent_attendance_count: attendance.length
    });

    const result = await generateSchoolReport(contextData, aiPrompt);
    setAiResponse(result);
    setLoading(false);
  };

  const StatCard = ({ title, value, icon: Icon, color, subText }: any) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
          <Icon className={`w-6 h-6 text-${color.split('-')[1]}-600`} />
        </div>
      </div>
      {subText && <p className="text-xs text-slate-400">{subText}</p>}
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500">Welcome back, {currentUser?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Students" 
          value={totalStudents} 
          icon={GraduationCap} 
          color="bg-indigo-500" 
          subText="Active enrollments"
        />
        <StatCard 
          title="Total Teachers" 
          value={totalTeachers} 
          icon={Users} 
          color="bg-emerald-500" 
          subText="Academic staff"
        />
        <StatCard 
          title="Revenue Collected" 
          value={`$${totalRevenue.toLocaleString()}`} 
          icon={DollarSign} 
          color="bg-blue-500" 
          subText={`$${pendingFees.toLocaleString()} pending`}
        />
        <StatCard 
          title="Attendance Today" 
          value="92%" 
          icon={Calendar} 
          color="bg-amber-500" 
          subText="Based on recent data"
        />
      </div>

      {/* AI Assistant Section */}
      {currentUser?.role === Role.ADMIN && (
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-500/20 rounded-lg">
              <Sparkles className="w-6 h-6 text-indigo-300" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-2">AI Administrative Assistant</h2>
              <p className="text-indigo-200 text-sm mb-4">Ask me to draft notices, analyze fee collections, or summarize student performance.</p>
              
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g., 'Draft a strict notice to parents about overdue fees'"
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                />
                <button 
                  onClick={handleAskAI}
                  disabled={loading}
                  className="bg-indigo-500 hover:bg-indigo-600 px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? 'Thinking...' : 'Generate'}
                </button>
              </div>

              {aiResponse && (
                <div className="mt-4 bg-white/5 border border-white/10 rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap">
                  {aiResponse}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity / Simple List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4">Recent Enrollments</h3>
          <div className="space-y-4">
            {students.slice(-5).reverse().map(student => (
              <div key={student.id} className="flex items-center justify-between pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-sm font-bold">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{student.name}</p>
                    <p className="text-xs text-slate-500">Grade {student.grade}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400">{student.enrollmentDate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
