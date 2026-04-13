import React, { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';

function LoginPage({ onSwitchToRegister, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user data
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        alert('Login successful! Welcome back!');
        onLoginSuccess(data.data);
      } else {
        setError(data.error.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Make sure backend is running on port 5000.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #028090 0%, #00A896 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        maxWidth: '450px',
        width: '100%',
        padding: '40px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🏥</div>
          <h1 style={{ color: '#028090', fontSize: '32px', margin: '0 0 10px 0' }}>
            Welcome Back
          </h1>
          <p style={{ color: '#666', margin: 0 }}>
            Login to Hospital Queue System
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fee',
            border: '1px solid #fcc',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            color: '#c00',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#333', 
              fontSize: '14px',
              fontWeight: '500'
            }}>
              <FaEnvelope style={{ marginRight: '8px', color: '#028090' }} />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@example.com"
              style={{
                width: '100%',
                padding: '14px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '15px',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#028090'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#333', 
              fontSize: '14px',
              fontWeight: '500'
            }}>
              <FaLock style={{ marginRight: '8px', color: '#028090' }} />
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '14px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '15px',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#028090'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading ? '#94a3b8' : 'linear-gradient(135deg, #028090 0%, #00A896 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 12px rgba(2, 128, 144, 0.3)'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '25px', 
          paddingTop: '25px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{ color: '#666', margin: '0 0 10px 0' }}>
            Don't have an account?
          </p>
          <button
            onClick={onSwitchToRegister}
            style={{
              background: 'none',
              border: '2px solid #028090',
              color: '#028090',
              padding: '10px 30px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#028090';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'none';
              e.target.style.color = '#028090';
            }}
          >
            Create New Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;