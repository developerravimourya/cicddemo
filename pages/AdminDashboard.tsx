import React from 'react';
import { Users, Settings, Activity, CheckCircle } from 'lucide-react';
import { Application, AppStatus, Language } from '../types';
import { TRANSLATIONS, MOCK_OFFICIALS } from '../constants';

interface AdminDashboardProps {
  language: Language;
  applications: Application[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ language, applications }) => {
  const t = TRANSLATIONS[language];

  // Simple data aggregation for charts
  const data = [
    { name: 'Submitted', value: applications.filter(a => a.status === AppStatus.SUBMITTED).length },
    { name: 'Approved', value: applications.filter(a => a.status === AppStatus.APPROVED).length },
    { name: 'Rejected', value: applications.filter(a => a.status === AppStatus.REJECTED).length },
    { name: 'In Progress', value: applications.filter(a => a.status === AppStatus.IN_PROGRESS).length },
  ];

  const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid div by zero

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-800">{t.dashboard} & {t.reports}</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-700 rounded-full">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Applications</p>
            <h3 className="text-3xl font-bold text-slate-800">{applications.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 bg-green-100 text-green-700 rounded-full">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Clearance Rate</p>
            <h3 className="text-3xl font-bold text-slate-800">
              {applications.length > 0 
                ? Math.round((applications.filter(a => a.status === AppStatus.APPROVED).length / applications.length) * 100) 
                : 0}%
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
           <div className="p-4 bg-purple-100 text-purple-700 rounded-full">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Active Officials</p>
            <h3 className="text-3xl font-bold text-slate-800">{MOCK_OFFICIALS.length}</h3>
          </div>
        </div>
      </div>

      {/* Chart Section - CSS Implementation for Stability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Application Status Overview</h3>
          <div className="h-64 w-full flex items-end justify-between gap-4 px-4 border-b border-slate-200 pb-4">
            {data.map((item) => (
              <div key={item.name} className="flex-1 flex flex-col items-center group">
                <div className="relative w-full max-w-[60px] flex items-end justify-center h-48 bg-slate-50 rounded-t-md hover:bg-slate-100 transition-colors">
                   <div 
                    className="w-full bg-blue-600 rounded-t-md transition-all duration-500 ease-out group-hover:bg-blue-700 relative"
                    style={{ height: `${(item.value / maxValue) * 100}%` }}
                   >
                     <div className="absolute -top-6 w-full text-center text-xs font-bold text-slate-600">{item.value}</div>
                   </div>
                </div>
                <span className="mt-3 text-xs font-medium text-slate-500 text-center h-8 leading-tight">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Admin Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">{t.manageUsers}</h3>
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-500">Name</th>
                  <th className="px-4 py-3 font-medium text-slate-500">Department</th>
                  <th className="px-4 py-3 font-medium text-slate-500 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_OFFICIALS.map(official => (
                  <tr key={official.id}>
                    <td className="px-4 py-3 font-medium text-slate-800">{official.name}</td>
                    <td className="px-4 py-3 text-slate-500">{official.department}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-blue-600 hover:underline text-xs font-medium">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="mt-4 w-full py-2 border border-dashed border-slate-300 rounded-lg text-slate-500 hover:bg-slate-50 text-sm font-medium flex items-center justify-center gap-2">
              <Settings className="w-4 h-4" /> Configure Services
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;