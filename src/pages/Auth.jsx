import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

/**
 * Authentication page component.
 * Serves as the landing page with Register by default, and a toggle for Login.
 */
function Auth() {
  const [isLogin, setIsLogin] = useState(false);
  const [role, setRole] = useState('STUDENT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        // Handle Login
        const response = await axios.post('http://localhost:8081/api/auth/login', {
          email,
          password,
          role
        });
        
        // Store user info
        localStorage.setItem('user', JSON.stringify(response.data));
        
        // Redirect
        if (response.data.role === 'ADMIN') { // Use role from response data
          navigate('/admin');
        } else {
          navigate('/home');
        }
      } else {
        // Handle Registration
        const response = await axios.post('http://localhost:8081/api/auth/register', {
          name,
          email,
          password,
          role
        });
        
        alert('Registration successful! Logging you in...');
        
        // Store user info
        localStorage.setItem('user', JSON.stringify(response.data));
        
        if (response.data.role === 'ADMIN') { // Use role from response data
          navigate('/admin');
        } else {
          navigate('/home');
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px' }}>
      <div className="form-container" style={{ width: '100%', maxWidth: '850px', display: 'flex', flexDirection: 'row', padding: 0, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        
        {/* Left Side - Info Banner */}
        <div style={{ flex: 1, backgroundColor: '#1a237e', color: 'white', padding: '40px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ color: 'white', fontSize: '2.2rem', marginBottom: '15px' }}>
            Campus<br/>Complaint<br/>System
          </h2>
          <p style={{ color: '#e8eaf6', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Report infrastructure issues securely, track your complaint's progress, and help maintain excellent campus facilities.
          </p>
        </div>

        {/* Right Side - Auth Form */}
        <div style={{ flex: 1.2, padding: '40px 40px' }}>
          <h2 style={{ color: '#1a237e', marginBottom: '25px', fontSize: '1.8rem' }}>
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '20px' }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>I am a...</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: '12px' }}>
                <option value="STUDENT">Student</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>

            {!isLogin && (
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  placeholder="Enter your full name" 
                  style={{ padding: '12px' }}
                />
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="university@campus.edu" 
                style={{ padding: '12px' }}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder={isLogin ? "Enter your password" : "Create a strong password (min 6 chars)"}
                minLength={isLogin ? "1" : "6"}
                style={{ padding: '12px' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '15px', padding: '14px', fontSize: '1.1rem', fontWeight: 'bold' }}>
              {isLogin ? 'Secure Login' : 'Register Account'}
            </button>
          </form>

          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <p style={{ color: '#555', marginBottom: '10px' }}>
              {isLogin ? "Don't have an account yet?" : "Already apart of the system?"}
            </p>
            <button 
              type="button" 
              onClick={() => setIsLogin(!isLogin)}
              style={{ 
                background: 'none', 
                border: '1px solid #1a237e', 
                color: '#1a237e',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                width: '100%',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { e.target.style.backgroundColor = '#f0f4f8' }}
              onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent' }}
            >
              {isLogin ? 'Switch to Registration' : 'Login Instead'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Auth;
