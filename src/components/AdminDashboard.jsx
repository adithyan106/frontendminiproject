import React, { useEffect, useState } from 'react';
import api, { buildBackendUrl } from '../services/api';

/**
 * AdminDashboard component.
 * Allows administrators to view all complaints, update their status,
 * delete complaints, and see escalated complaints highlighted.
 */
function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // Filter by status

  // Available statuses for the update dropdown
  const statuses = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'ESCALATED'];

  // Fetch complaints on mount
  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await api.get('/complaints');
      setComplaints(response.data);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update the status of a complaint.
   */
  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/complaints/${id}/status`, { status: newStatus }, {
        headers: { 'Content-Type': 'application/json' }
      });
      // Refresh the list after updating
      fetchComplaints();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status.');
    }
  };

  /**
   * Delete a complaint by ID.
   */
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;
    try {
      await api.delete(`/complaints/${id}`);
      fetchComplaints();
    } catch (err) {
      console.error('Error deleting complaint:', err);
      alert('Failed to delete complaint.');
    }
  };

  /**
   * Returns a CSS class name based on complaint status.
   */
  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'IN_PROGRESS': return 'status-progress';
      case 'RESOLVED': return 'status-resolved';
      case 'ESCALATED': return 'status-escalated';
      default: return '';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString();
  };

  // Filter complaints based on selected status
  const filteredComplaints = filter === 'ALL'
    ? complaints
    : complaints.filter(c => c.status === filter);

  // Count escalated complaints for the alert banner
  const escalatedCount = complaints.filter(c => c.status === 'ESCALATED').length;

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      {/* Escalation alert banner */}
      {escalatedCount > 0 && (
        <div className="alert alert-warning">
          ⚠️ {escalatedCount} complaint(s) have been escalated due to no resolution within 48 hours!
        </div>
      )}

      {/* Summary stats */}
      <div className="stats-row">
        <div className="stat-card">
          <h3>{complaints.length}</h3>
          <p>Total</p>
        </div>
        <div className="stat-card stat-pending">
          <h3>{complaints.filter(c => c.status === 'PENDING').length}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card stat-progress">
          <h3>{complaints.filter(c => c.status === 'IN_PROGRESS').length}</h3>
          <p>In Progress</p>
        </div>
        <div className="stat-card stat-resolved">
          <h3>{complaints.filter(c => c.status === 'RESOLVED').length}</h3>
          <p>Resolved</p>
        </div>
        <div className="stat-card stat-escalated">
          <h3>{escalatedCount}</h3>
          <p>Escalated</p>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="filter-row">
        <span>Filter: </span>
        {['ALL', ...statuses].map(s => (
          <button
            key={s}
            className={`btn btn-filter ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Complaints table */}
      {filteredComplaints.length === 0 ? (
        <div className="no-data">No complaints match the selected filter.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Location</th>
              <th>Photo</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.map(complaint => (
              <tr key={complaint.id} className={complaint.status === 'ESCALATED' ? 'row-escalated' : ''}>
                <td>{complaint.id}</td>
                <td>{complaint.title}</td>
                <td>{complaint.category}</td>
                <td>{complaint.location}</td>
                <td>
                  {complaint.imageUrl ? (
                    <a href={buildBackendUrl(complaint.imageUrl)} target="_blank" rel="noopener noreferrer">
                      <img src={buildBackendUrl(complaint.imageUrl)} alt="Attachment" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }} />
                    </a>
                  ) : (
                    <span style={{ color: '#888', fontSize: '0.85rem' }}>None</span>
                  )}
                </td>
                <td>
                  <span className={`status-badge ${getStatusClass(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </td>
                <td>{formatDate(complaint.createdAt)}</td>
                <td className="actions">
                  {/* Status update dropdown */}
                  <select
                    value={complaint.status}
                    onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                  >
                    {statuses.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {/* Delete button */}
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(complaint.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;
