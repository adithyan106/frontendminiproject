import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SubmitComplaint from './pages/SubmitComplaint';
import Admin from './pages/Admin';
import Auth from './pages/Auth';

/**
 * Main App component.
 * Sets up routing with Auth as the default landing page.
 */
function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="container">
          <Routes>
            {/* Landing page is Auth */}
            <Route path="/" element={<Auth />} />
            {/* Main interface after login */}
            <Route path="/home" element={<Home />} />
            <Route path="/submit" element={<SubmitComplaint />} />
            <Route path="/admin" element={<Admin />} />
            {/* Catch-all redirect to / */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
