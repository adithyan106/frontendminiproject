import React, { useState } from 'react';
import api from '../services/api';

/**
 * ComplaintForm component.
 * Renders a form for students to submit a new infrastructure complaint.
 */
function ComplaintForm() {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: ''
  });
  
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Category options for the dropdown
  const categories = [
    'Electrical',
    'Plumbing',
    'Furniture',
    'Cleanliness',
    'Building Structure',
    'Network/Internet',
    'Other'
  ];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file changes
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setMessage('');
    setError('');

    // Create FormData object for multipart/form-data request
    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('description', formData.description);
    payload.append('category', formData.category);
    payload.append('location', formData.location);
    
    if (image) {
      payload.append('image', image);
    }

    try {
      const response = await api.post('/complaints', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const assignedName = response.data?.assignedToName;
      const assignedContact = response.data?.assignedToContact;
      if (assignedName && assignedContact) {
        setMessage(`Complaint submitted successfully! Assigned to ${assignedName} (${assignedContact}).`);
      } else {
        setMessage('Complaint submitted successfully!');
      }
      // Reset form
      setFormData({ title: '', description: '', category: '', location: '' });
      setImage(null);
      // Reset file input element
      const fileInput = document.getElementById('image');
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      setError('Failed to submit complaint. Please try again.');
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Report an Infrastructure Issue</h2>

      {/* Success message */}
      {message && <div className="alert alert-success">{message}</div>}
      {/* Error message */}
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Title field */}
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Broken light in hallway"
            required
          />
        </div>

        {/* Description field */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the issue in detail..."
            rows="4"
            required
          />
        </div>

        {/* Category dropdown */}
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Location field */}
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Block A, Room 302"
            required
          />
        </div>
        
        {/* Image Upload field */}
        <div className="form-group">
          <label htmlFor="image">Attach Photo (Optional)</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileChange}
            style={{ padding: '8px' }}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
}

export default ComplaintForm;
