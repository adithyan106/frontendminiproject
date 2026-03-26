import React, { useEffect, useState } from 'react';
import api, { buildBackendUrl } from '../services/api';

/**
 * ComplaintList component.
 * Fetches and displays all complaints in a table format.
 */
function ComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch complaints on component mount
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
   * Returns a CSS class name based on complaint status for color-coding.
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

  /**
   * Format a date string for display.
   */
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString();
  };

  if (loading) {
    return <div className="loading">Loading complaints...</div>;
  }

  if (complaints.length === 0) {
    return <div className="no-data">No complaints found.</div>;
  }

  return (
    <div className="complaint-list">
      <h2>All Complaints</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Location</th>
            <th>Photo</th>
            <th>Status</th>
            <th>Created Date</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map(complaint => (
            <tr key={complaint.id}>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ComplaintList;
