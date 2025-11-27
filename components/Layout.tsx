import React from 'react';
import { LogOut, Globe, Menu } from 'lucide-react';
import { Role, User, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  language: Language;
  toggleLanguage: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, language, toggleLanguage }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 flex items-center justify-center overflow-hidden">
              <img 
                src="https://upload.wikimedia.org/wikipedia/en/thumb/8/86/PMRDA_Logo.png/220px-PMRDA_Logo.png" 
                alt="PMRDA Logo" 
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-blue-900 leading-tight">PMRDA</h1>
              <span className="text-xs text-slate-500 font-medium tracking-wide hidden sm:block">
                {t.subtitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-blue-700 px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
            >
              <Globe className="w-4 h-4" />
              {language === 'en' ? 'मराठी' : 'English'}
            </button>

            {user && (
              <div className="flex items-center gap-4 border-l border-slate-200 pl-4">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{user.role.toLowerCase()}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-md text-sm transition-colors"
                  title={t.logout}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.logout}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-4">
               <img 
                src="https://upload.wikimedia.org/wikipedia/en/thumb/8/86/PMRDA_Logo.png/220px-PMRDA_Logo.png" 
                alt="PMRDA Logo" 
                className="h-8 w-auto brightness-0 invert opacity-80"
              />
              <span className="text-white font-bold">PMRDA RTS Portal</span>
            </div>
            <p className="mb-2">Pune Metropolitan Region Development Authority</p>
            <p>Survey No. 152-153, Maharaja Sayajirao Gaikwad Udyog Bhavan, Aundh, Pune, Maharashtra 411067</p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">GIGW Guidelines</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Contact</h3>
            <p>Helpline: 020-25933344</p>
            <p>Email: comm@pmrda.gov.in</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} PMRDA. All rights reserved. Minimum Viable Product.
        </div>
      </footer>
    </div>
  );
};

export default Layout;