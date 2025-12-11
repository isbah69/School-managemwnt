import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Finance from './pages/Finance';
import Attendance from './pages/Attendance';
import Academics from './pages/Academics';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useSchool();
  if (!currentUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 ml-64 transition-all duration-300">
        {children}
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const { currentUser } = useSchool();

  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <SchoolProvider>
      <Router>
        <AppRoutes />
      </Router>
    </SchoolProvider>
  );
};

export default App;
