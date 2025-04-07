
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Shipment from './pages/Shipment';
import Maintenance from './pages/Maintenance';
import Space from './pages/Space';
import Performance from './pages/Performance';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import './App.css';

// Import AIAssistantProvider
import AIAssistantProvider from '@/components/ai/AIAssistantProvider';

// Add AIAssistantProvider to the application layout
function App() {
  return (
    <div className="app">
      <Router>
        <Sidebar />
        <div className="content">
          <Header />
          <AIAssistantProvider />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/shipment" element={<Shipment />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/space" element={<Space />} />
            <Route path="/performance" element={<Performance />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
