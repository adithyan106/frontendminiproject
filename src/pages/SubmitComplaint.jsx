import React from 'react';
import ComplaintForm from '../components/ComplaintForm';

/**
 * Submit Complaint page.
 * Wraps the ComplaintForm component.
 */
function SubmitComplaint() {
  return (
    <div className="submit-page">
      <ComplaintForm />
    </div>
  );
}

export default SubmitComplaint;
