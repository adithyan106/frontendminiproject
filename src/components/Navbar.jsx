import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Navbar component displayed at the top of every page.
 * Conditionally shows navigation links based on user role and auth page.
 */
function Navbar() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/';
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user && user.role === 'ADMIN';

  const handleLogout = () => {
    localStorage.removeItem('user');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to={isAuthPage ? '/' : '/home'}>🏫 Campus Complaint System</Link>
      </div>
      
      {!isAuthPage && (
        <ul className="navbar-links">
          <li><Link to="/home">Dashboard</Link></li>
          <li><Link to="/submit">Submit Complaint</Link></li>
          {isAdmin ? (
            <li><Link to="/admin">Admin View</Link></li>
          ) : (
            <li><Link to="/home">Complaint Status</Link></li>
          )}
          <li>
            <Link to="/" onClick={handleLogout} className="btn" style={{ 
              padding: '6px 14px', 
              marginLeft: '10px', 
              backgroundColor: '#e53935', 
              color: 'white',
              textDecoration: 'none'
            }}>
              Logout
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
