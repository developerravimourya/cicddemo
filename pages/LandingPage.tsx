import React, { useState } from 'react';
import { Search, Building2, FileText, CheckCircle, Users, ArrowRight, Shield } from 'lucide-react';
import { Language, Role, User } from '../types';
import { TRANSLATIONS, MOCK_SERVICES } from '../constants';
import AuthModal from '../components/AuthModal';

interface LandingProps {
  language: Language;
  onLogin: (user: User) => void;
}

const LandingPage: React.FC<LandingProps> = ({ language, onLogin }) => {
  const t = TRANSLATIONS[language];
  const [trackId, setTrackId] = useState('');
  
  // Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>(Role.CITIZEN);

  const handleAuthClick = (role: Role) => {
    setSelectedRole(role);
    setShowAuthModal(true);
  };

  return (
    <div className="space-y-12">
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        role={selectedRole}
        language={language}
        onLogin={onLogin}
      />

      {/* Hero Section */}
      <div className="relative bg-blue-900 rounded-2xl overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/1200/400')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 px-8 py-16 md:py-24 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            {language === 'en' ? 'Efficient. Transparent. Accountable.' : 'कार्यक्षम. पारदर्शक. जबाबदार.'}
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            {t.title} - {t.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => handleAuthClick(Role.CITIZEN)}
              className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center gap-2"
            >
              {t.citizenPortal}
            </button>
            <button
              onClick={() => handleAuthClick(Role.OFFICIAL)}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {t.officialPortal}
            </button>
          </div>
        </div>
      </div>

      {/* Track Application Status */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-3xl mx-auto -mt-8 relative z-20">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-600" />
          {t.trackStatus}
        </h2>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder={t.enterAppId}
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
            className="flex-grow px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-slate-900 placeholder-slate-400"
          />
          <button className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg transition-colors shadow-sm">
            {t.track}
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800">{t.services}</h2>
          <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 text-sm">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_SERVICES.map((service) => (
            <div key={service.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2 group-hover:text-blue-700">
                {language === 'en' ? service.nameEn : service.nameMr}
              </h3>
              <p className="text-sm text-slate-500">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-100 text-green-700 rounded-full">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">GIGW Compliant</h4>
            <p className="text-sm text-slate-500 mt-1">Adhering to government standards for accessibility and usability.</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-full">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Digital Workflow</h4>
            <p className="text-sm text-slate-500 mt-1">End-to-end paperless processing of applications.</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-orange-100 text-orange-700 rounded-full">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Citizen Centric</h4>
            <p className="text-sm text-slate-500 mt-1">Designed to simplify interactions for all citizens.</p>
          </div>
        </div>
      </div>

      {/* Admin Link */}
      <div className="flex justify-center mt-8">
        <button 
          onClick={() => handleAuthClick(Role.ADMIN)}
          className="text-slate-400 hover:text-blue-600 text-xs font-medium flex items-center gap-1 transition-colors"
        >
          <Shield className="w-3 h-3" /> {t.admin}
        </button>
      </div>
    </div>
  );
};

export default LandingPage;