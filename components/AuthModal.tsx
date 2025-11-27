import React, { useState } from 'react';
import { X, User, Lock, Mail, Phone, Briefcase, Building } from 'lucide-react';
import { Role, User as UserType, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role;
  language: Language;
  onLogin: (user: UserType) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, role, language, onLogin }) => {
  const t = TRANSLATIONS[language];
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    department: '',
    designation: ''
  });

  if (!isOpen) return null;

  const getTitle = () => {
    switch (role) {
      case Role.CITIZEN: return t.citizenPortal;
      case Role.OFFICIAL: return t.officialPortal;
      case Role.ADMIN: return t.adminPortal;
      default: return t.title;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        setError(t.passwordMismatch);
        return;
      }
      if (!formData.name || !formData.mobile) {
        setError(t.fillAllFields);
        return;
      }
    }
    
    // Mock Authentication / Registration Logic
    const newUser: UserType = {
      id: `${role.substring(0, 3)}-${Math.floor(Math.random() * 10000)}`,
      name: formData.name || (role === Role.CITIZEN ? 'Rajesh Kumar' : (role === Role.ADMIN ? 'System Admin' : 'Officer Deshmukh')),
      role: role,
      department: role === Role.OFFICIAL ? (formData.department || 'Town Planning') : undefined
    };
    
    onLogin(newUser);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      mobile: '',
      department: '',
      designation: ''
    });
    setError('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const handleDemoFill = () => {
    if (role === Role.CITIZEN) {
      setFormData(prev => ({ ...prev, email: 'citizen@pmrda.gov.in', password: 'password123', name: 'Rajesh Kumar' }));
    } else if (role === Role.OFFICIAL) {
      setFormData(prev => ({ ...prev, email: 'officer@pmrda.gov.in', password: 'password123', name: 'Officer Deshmukh' }));
    } else if (role === Role.ADMIN) {
      setFormData(prev => ({ ...prev, email: 'admin@pmrda.gov.in', password: 'password123', name: 'System Admin' }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-blue-900 p-6 text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-blue-200 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-white mb-1">
            {getTitle()}
          </h2>
          <p className="text-blue-200 text-sm">
            {isLogin ? t.signIn : t.signUp}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            className={`flex-1 py-4 text-sm font-medium transition-colors ${isLogin ? 'text-blue-700 border-b-2 border-blue-700 bg-blue-50' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setIsLogin(true)}
          >
            {t.login}
          </button>
          {role !== Role.ADMIN && (
            <button
              className={`flex-1 py-4 text-sm font-medium transition-colors ${!isLogin ? 'text-blue-700 border-b-2 border-blue-700 bg-blue-50' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => setIsLogin(false)}
            >
              {t.register}
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200 text-center">
              {error}
            </div>
          )}

          {!isLogin && (
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder={t.fullName}
                  required={!isLogin}
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-500"
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  placeholder={t.mobile}
                  required={!isLogin}
                  value={formData.mobile}
                  onChange={e => setFormData({...formData, mobile: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-500"
                />
              </div>
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="email"
              placeholder={t.email}
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-500"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="password"
              placeholder={t.password}
              required
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-500"
            />
          </div>

          {!isLogin && (
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="password"
                placeholder={t.confirmPassword}
                required={!isLogin}
                value={formData.confirmPassword}
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-500"
              />
            </div>
          )}

          {/* Official Only Fields */}
          {!isLogin && role === Role.OFFICIAL && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="relative">
                <Building className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <select
                  required={!isLogin}
                  value={formData.department}
                  onChange={e => setFormData({...formData, department: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900"
                >
                  <option value="" disabled className="text-slate-500">Select Department</option>
                  <option value="Town Planning" className="text-slate-900">Town Planning</option>
                  <option value="Fire Safety" className="text-slate-900">Fire Safety</option>
                  <option value="Engineering" className="text-slate-900">Engineering</option>
                  <option value="Land Records" className="text-slate-900">Land Records</option>
                </select>
              </div>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder={t.designation}
                  required={!isLogin}
                  value={formData.designation}
                  onChange={e => setFormData({...formData, designation: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900 placeholder-slate-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-lg shadow-md transition-transform transform active:scale-95 mt-4"
          >
            {isLogin ? t.login : t.signUp}
          </button>

          {isLogin && (
            <div className="text-center mt-4">
               <button 
                type="button" 
                onClick={handleDemoFill}
                className="text-xs text-slate-500 hover:text-blue-600 underline"
               >
                 {t.demoCreds}
               </button>
            </div>
          )}
        </form>

        {role !== Role.ADMIN && (
          <div className="bg-slate-50 p-4 text-center text-sm text-slate-500 border-t border-slate-200">
            {isLogin ? t.noAccount : t.alreadyAccount}{' '}
            <button
              onClick={toggleMode}
              className="text-blue-700 font-bold hover:underline"
            >
              {isLogin ? t.signUp : t.login}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;