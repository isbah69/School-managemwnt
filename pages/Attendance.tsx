import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { AttendanceRecord } from '../types';
import { Save, Calendar } from 'lucide-react';
import { analyzeAttendance } from '../services/geminiService';

const Attendance: React.FC = () => {
  const { students, attendance, markAttendance } = useSchool();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [tempStatus, setTempStatus] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'>>({});
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);

  // Initialize tempStatus with existing data or default PRESENT
  React.useEffect(() => {
    const initialStatus: Record<string, any> = {};
    students.forEach(s => {
      const existing = attendance.find(a => a.studentId === s.id && a.date === selectedDate);
      initialStatus[s.id] = existing ? existing.status : 'PRESENT';
    });
    setTempStatus(initialStatus);
  }, [selectedDate, students, attendance]);

  const handleSave = () => {
    const records: AttendanceRecord[] = students.map(s => ({
      id: `${s.id}-${selectedDate}`,
      date: selectedDate,
      studentId: s.id,
      status: tempStatus[s.id]
    }));
    markAttendance(records);
    alert('Attendance saved successfully!');
  };

  const handleAnalyze = async () => {
      setIsAnalysing(true);
      // Filter attendance for the current view or recent
      const relevantData = attendance.filter(a => a.date <= selectedDate).slice(-20); // Last 20 records
      // Enrich with student names for AI
      const enrichedData = relevantData.map(r => ({
          student: students.find(s => s.id === r.studentId)?.name,
          date: r.date,
          status: r.status
      }));

      const result = await analyzeAttendance(JSON.stringify(enrichedData));
      setAnalysis(result);
      setIsAnalysing(false);
  }

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Attendance</h1>
          <p className="text-slate-500">Mark daily attendance for students</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={handleAnalyze} 
             disabled={isAnalysing}
             className="bg-amber-100 text-amber-700 hover:bg-amber-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
           >
              {isAnalysing ? "Analyzing..." : "Analyze Trends (AI)"}
           </button>
           <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200">
             <Calendar className="w-4 h-4 text-slate-500" />
             <input 
               type="date" 
               value={selectedDate} 
               onChange={(e) => setSelectedDate(e.target.value)}
               className="text-sm border-0 focus:ring-0 text-slate-600 outline-none"
             />
           </div>
        </div>
      </div>

      {analysis && (
          <div className="mb-6 bg-amber-50 border border-amber-100 p-4 rounded-lg text-sm text-amber-900">
              <strong>AI Analysis:</strong> {analysis}
          </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
           <span className="font-semibold text-slate-700">Class 10A - {selectedDate}</span>
           <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
           >
             <Save className="w-4 h-4" />
             Save Attendance
           </button>
        </div>
        
        <div className="divide-y divide-slate-100">
          {students.map(student => (
            <div key={student.id} className="flex items-center justify-between p-4 hover:bg-slate-50">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500">
                   {student.name.charAt(0)}
                 </div>
                 <div>
                   <p className="font-medium text-slate-800">{student.name}</p>
                   <p className="text-xs text-slate-500">ID: {student.id}</p>
                 </div>
              </div>
              
              <div className="flex gap-2">
                {['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setTempStatus(prev => ({ ...prev, [student.id]: status as any }))}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors border ${
                      tempStatus[student.id] === status
                        ? status === 'PRESENT' ? 'bg-green-600 text-white border-green-600'
                        : status === 'ABSENT' ? 'bg-red-600 text-white border-red-600'
                        : 'bg-yellow-500 text-white border-yellow-500'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
