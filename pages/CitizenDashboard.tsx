import React, { useState } from 'react';
import { Plus, FileText, Upload, X } from 'lucide-react';
import { Application, AppStatus, Language, ServiceType } from '../types';
import { TRANSLATIONS, MOCK_SERVICES } from '../constants';
import StatusBadge from '../components/StatusBadge';

interface CitizenDashboardProps {
  language: Language;
  applications: Application[];
  onApply: (app: Omit<Application, 'id' | 'status' | 'slaDaysRemaining' | 'submissionDate'>) => void;
}

const CitizenDashboard: React.FC<CitizenDashboardProps> = ({ language, applications, onApply }) => {
  const t = TRANSLATIONS[language];
  const [isApplying, setIsApplying] = useState(false);
  const [formData, setFormData] = useState({
    serviceId: '',
    applicantName: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.serviceId || !formData.applicantName) return;
    
    onApply({
      serviceId: formData.serviceId,
      applicantName: formData.applicantName,
      documents: ['uploaded_doc_placeholder.pdf']
    });
    setIsApplying(false);
    setFormData({ serviceId: '', applicantName: '' });
  };

  const getServiceTitle = (id: string) => {
    const s = MOCK_SERVICES.find(svc => svc.id === id);
    return s ? (language === 'en' ? s.nameEn : s.nameMr) : id;
  };

  if (isApplying) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-blue-900 px-6 py-4 flex justify-between items-center">
          <h2 className="text-white font-bold text-lg">{t.apply}</h2>
          <button onClick={() => setIsApplying(false)} className="text-blue-200 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-white">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t.selectService}
            </label>
            <select 
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
              value={formData.serviceId}
              onChange={e => setFormData({...formData, serviceId: e.target.value})}
              required
            >
              <option value="" className="text-slate-500">-- Select --</option>
              {MOCK_SERVICES.map(s => (
                <option key={s.id} value={s.id} className="text-slate-900">
                  {language === 'en' ? s.nameEn : s.nameMr}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Applicant Name
            </label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
              value={formData.applicantName}
              onChange={e => setFormData({...formData, applicantName: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t.uploadDocs} (PDF only)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:bg-slate-50 cursor-pointer transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-slate-400" />
                <div className="flex text-sm text-slate-600">
                  <span className="relative bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                    Upload a file
                  </span>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-slate-500">PDF up to 10MB</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button"
              onClick={() => setIsApplying(false)}
              className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md text-sm font-medium"
            >
              {t.cancel}
            </button>
            <button 
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium shadow-sm"
            >
              {t.submit}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">{t.dashboard}</h2>
        <button 
          onClick={() => setIsApplying(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors shadow-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          {t.newApp}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t.myApps, val: applications.length, color: 'bg-blue-50 text-blue-700' },
          { label: t.approved, val: applications.filter(a => a.status === AppStatus.APPROVED).length, color: 'bg-green-50 text-green-700' },
          { label: t.pending, val: applications.filter(a => a.status === AppStatus.SUBMITTED || a.status === AppStatus.IN_PROGRESS).length, color: 'bg-yellow-50 text-yellow-700' },
          { label: t.clarify, val: applications.filter(a => a.status === AppStatus.CLARIFICATION).length, color: 'bg-red-50 text-red-700' },
        ].map((stat, idx) => (
          <div key={idx} className={`p-4 rounded-xl border border-slate-200 ${stat.color}`}>
            <p className="text-3xl font-bold">{stat.val}</p>
            <p className="text-sm font-medium opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-bold text-slate-700">{t.myApps}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">App ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Remarks</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {app.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {getServiceTitle(app.serviceId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {app.submissionDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                     {app.remark || '-'}
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;