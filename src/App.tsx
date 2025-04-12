
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Shipment from './pages/Shipment';
import Maintenance from './pages/Maintenance';
import Space from './pages/Space';
import Performance from './pages/Performance';
import Login from './pages/Login';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import './App.css';

// Import AIAssistantProvider
import AIAssistantProvider from '@/components/ai/AIAssistantProvider';
import { useAuth } from '@/context/AuthContext';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app flex h-screen w-full overflow-hidden">
      <Router>
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
          } />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          <Route path="*" element={
            <ProtectedRoute>
              <div className="flex h-full w-full">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <Header />
                  <div className="flex-1 overflow-auto p-4">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/shipment" element={<Shipment />} />
                      <Route path="/maintenance" element={<Maintenance />} />
                      <Route path="/space" element={<Space />} />
                      <Route path="/performance" element={<Performance />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
        <AIAssistantProvider />
      </Router>
    </div>
  );
}

export default App;
