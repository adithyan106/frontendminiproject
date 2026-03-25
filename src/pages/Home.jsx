import React from 'react';
import { Link } from 'react-router-dom';
import ComplaintList from '../components/ComplaintList';

/**
 * Home page.
 * Displays a welcome message and the list of all complaints.
 */
function Home() {
  return (
    <div className="home-page">
      <div className="hero">
        <h1>Campus Infrastructure Complaint System</h1>
        <p>
          Report campus infrastructure problems like broken lights, water leaks,
          furniture damage, and more. Track your complaints and see resolutions.
        </p>
        <Link to="/submit" className="btn btn-primary btn-large">
          Submit a Complaint
        </Link>
      </div>

      {/* Display all complaints below the hero section */}
      <ComplaintList />
    </div>
  );
}

export default Home;
