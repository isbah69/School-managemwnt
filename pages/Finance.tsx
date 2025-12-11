import React from 'react';
import { useSchool } from '../context/SchoolContext';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

const Finance: React.FC = () => {
  const { students, fees, updateFeeStatus } = useSchool();

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PAID': return 'bg-green-100 text-green-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'OVERDUE': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Finance Management</h1>
        <p className="text-slate-500">Track student fees and payments</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-6 bg-slate-50 p-4 font-medium text-slate-500 text-sm border-b border-slate-200">
          <div className="col-span-2">Student Details</div>
          <div>Fee Title</div>
          <div>Amount</div>
          <div>Status</div>
          <div>Action</div>
        </div>
        
        <div className="divide-y divide-slate-100">
          {fees.map(fee => {
            const student = students.find(s => s.id === fee.studentId);
            if (!student) return null;

            return (
              <div key={fee.id} className="grid grid-cols-6 p-4 items-center hover:bg-slate-50 text-sm">
                <div className="col-span-2">
                  <p className="font-medium text-slate-800">{student.name}</p>
                  <p className="text-xs text-slate-500">Grade {student.grade} • Due: {fee.dueDate}</p>
                </div>
                <div className="text-slate-600">{fee.title}</div>
                <div className="font-medium text-slate-800">${fee.amount}</div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex w-fit items-center gap-1 ${getStatusColor(fee.status)}`}>
                    {fee.status === 'PAID' && <CheckCircle className="w-3 h-3" />}
                    {fee.status === 'PENDING' && <Clock className="w-3 h-3" />}
                    {fee.status === 'OVERDUE' && <AlertCircle className="w-3 h-3" />}
                    {fee.status}
                  </span>
                </div>
                <div>
                   {fee.status !== 'PAID' && (
                     <button 
                      onClick={() => updateFeeStatus(fee.id, 'PAID')}
                      className="text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded transition-colors"
                     >
                       Mark Paid
                     </button>
                   )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Finance;
