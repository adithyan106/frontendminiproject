import React from 'react';
import AdminDashboard from '../components/AdminDashboard';

/**
 * Admin page.
 * Wraps the AdminDashboard component.
 */
function Admin() {
  return (
    <div className="admin-page">
      <AdminDashboard />
    </div>
  );
}

export default Admin;
