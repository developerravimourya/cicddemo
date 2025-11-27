import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import CitizenDashboard from './pages/CitizenDashboard';
import OfficialDashboard from './pages/OfficialDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { Role, User, Language, Application, AppStatus } from './types';
import { MOCK_APPLICATIONS } from './constants';

const App: React.FC = () => {
  // --- Global State Management (Mocking Backend) ---
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);

  // --- Actions ---
  
  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleToggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'mr' : 'en');
  };

  const handleCitizenApply = (newAppData: Omit<Application, 'id' | 'status' | 'slaDaysRemaining' | 'submissionDate'>) => {
    const newApp: Application = {
      id: `APP-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
      status: AppStatus.SUBMITTED,
      slaDaysRemaining: 15, // Default SLA
      submissionDate: new Date().toISOString().split('T')[0],
      ...newAppData
    };
    setApplications([newApp, ...applications]);
  };

  const handleOfficialUpdate = (id: string, status: AppStatus, remark?: string) => {
    setApplications(apps => apps.map(app => 
      app.id === id ? { ...app, status, remark } : app
    ));
  };

  // --- Render ---
// tet=sting
  return (
    <Router>
      <Layout 
        user={user} 
        onLogout={handleLogout} 
        language={language} 
        toggleLanguage={handleToggleLanguage}
      >
        <Routes>
          {/* Landing Route */}
          <Route 
            path="/" 
            element={
              !user ? (
                <LandingPage language={language} onLogin={handleLogin} />
              ) : (
                // Redirect based on role if already logged in
                <Navigate to={`/${user.role.toLowerCase()}`} replace />
              )
            } 
          />

          {/* Citizen Routes */}
          <Route 
            path="/citizen" 
            element={
              user?.role === Role.CITIZEN ? (
                <CitizenDashboard 
                  language={language} 
                  applications={applications.filter(a => a.applicantName === user.name)} // Mock filter by user
                  onApply={handleCitizenApply}
                />
              ) : <Navigate to="/" />
            } 
          />

          {/* Official Routes */}
          <Route 
            path="/official" 
            element={
              user?.role === Role.OFFICIAL ? (
                <OfficialDashboard 
                  language={language} 
                  applications={applications} // Official sees all
                  onUpdateStatus={handleOfficialUpdate}
                />
              ) : <Navigate to="/" />
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              user?.role === Role.ADMIN ? (
                <AdminDashboard 
                  language={language} 
                  applications={applications}
                />
              ) : <Navigate to="/" />
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;