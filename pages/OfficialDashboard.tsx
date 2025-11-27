import React, { useState } from 'react';
import { Check, X, AlertCircle, FileText, ArrowLeft } from 'lucide-react';
import { Application, AppStatus, Language } from '../types';
import { TRANSLATIONS, MOCK_SERVICES } from '../constants';
import StatusBadge from '../components/StatusBadge';

interface OfficialDashboardProps {
  language: Language;
  applications: Application[];
  onUpdateStatus: (id: string, status: AppStatus, remark?: string) => void;
}

const OfficialDashboard: React.FC<OfficialDashboardProps> = ({ language, applications, onUpdateStatus }) => {
  const t = TRANSLATIONS[language];
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [remark, setRemark] = useState('');

  const getServiceTitle = (id: string) => {
    const s = MOCK_SERVICES.find(svc => svc.id === id);
    return s ? (language === 'en' ? s.nameEn : s.nameMr) : id;
  };

  const handleAction = (status: AppStatus) => {
    if (selectedApp) {
      onUpdateStatus(selectedApp.id, status, remark);
      setSelectedApp(null);
      setRemark('');
    }
  };

  // Detail View
  if (selectedApp) {
    return (
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => setSelectedApp(null)}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-700 mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Inbox
        </button>

        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200 px-8 py-5 flex justify-between items-start bg-slate-50">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Application #{selectedApp.id}</h2>
              <p className="text-sm text-slate-500 mt-1">{getServiceTitle(selectedApp.serviceId)}</p>
            </div>
            <StatusBadge status={selectedApp.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {/* Left: Details */}
            <div className="col-span-2 p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Applicant</label>
                  <p className="text-base font-medium text-slate-800">{selectedApp.applicantName}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Submission Date</label>
                  <p className="text-base font-medium text-slate-800">{selectedApp.submissionDate}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">SLA Remaining</label>
                  <p className={`text-base font-bold ${selectedApp.slaDaysRemaining < 5 ? 'text-red-600' : 'text-green-600'}`}>
                    {selectedApp.slaDaysRemaining} Days
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Documents</label>
                <ul className="space-y-2">
                  {selectedApp.documents.map((doc, i) => (
                    <li key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-md border border-slate-200">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <span className="text-sm font-medium text-slate-700">{doc}</span>
                      </div>
                      <button className="text-xs text-blue-600 hover:underline font-medium">View</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="col-span-1 p-8 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 mb-4">Processing</h3>
              <textarea
                className="w-full p-3 border border-slate-300 rounded-lg text-sm mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter remarks here..."
                rows={4}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
              <div className="space-y-3">
                <button 
                  onClick={() => handleAction(AppStatus.APPROVED)}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition-colors"
                >
                  <Check className="w-4 h-4" /> {t.approve}
                </button>
                <button 
                  onClick={() => handleAction(AppStatus.CLARIFICATION)}
                  className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white py-2.5 rounded-lg font-medium transition-colors"
                >
                  <AlertCircle className="w-4 h-4" /> {t.clarify}
                </button>
                <button 
                  onClick={() => handleAction(AppStatus.REJECTED)}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium transition-colors"
                >
                  <X className="w-4 h-4" /> {t.reject}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Assigned Applications</h2>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600">
            Pending: {applications.filter(a => a.status === AppStatus.SUBMITTED).length}
          </span>
          <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600">
             SLA Breach: {applications.filter(a => a.slaDaysRemaining < 3).length}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">App ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Applicant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">SLA</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{app.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{app.applicantName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{getServiceTitle(app.serviceId)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-xs font-bold ${app.slaDaysRemaining < 5 ? 'text-red-600' : 'text-slate-600'}`}>
                    {app.slaDaysRemaining} days
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={app.status} /></td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => setSelectedApp(app)}
                    className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OfficialDashboard;