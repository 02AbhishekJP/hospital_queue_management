import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaVenusMars, FaTint, FaSave } from 'react-icons/fa';

function SettingsPage({ user, onBack, onUpdateUser }) {
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    gender: user.gender || '',
    bloodGroup: user.bloodGroup || ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // For now, just show success and update localStorage
      setTimeout(() => {
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        if (onUpdateUser) {
          onUpdateUser(updatedUser);
        }
        
        setSuccess('✅ Profile updated successfully!');
        setLoading(false);
        
        setTimeout(() => setSuccess(''), 3000);
      }, 1000);
    } catch (err) {
      setError('Failed to update profile');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #028090 0%, #00A896 100%)',
        padding: '30px',
        borderRadius: '12px',
        color: 'white',
        marginBottom: '30px',
        boxShadow: '0 4px 12px rgba(2, 128, 144, 0.3)'
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: '2px solid white',
            color: 'white',
            padding: '8px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '15px',
            fontSize: '14px'
          }}
        >
          ← Back to Dashboard
        </button>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>
          ⚙️ Settings
        </h1>
        <p style={{ margin: 0, opacity: 0.9 }}>
          Update your profile information
        </p>
      </div>

      {error && (
        <div style={{
          background: '#fee',
          border: '2px solid #fcc',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          color: '#c00'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          background: '#d1fae5',
          border: '2px solid #10b981',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          color: '#065f46'
        }}>
          {success}
        </div>
      )}

      {/* Profile Form */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 25px 0', color: '#028090' }}>
          Personal Information
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Name Fields */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: '500',
                fontSize: '15px'
              }}>
                <FaUser style={{ marginRight: '8px', color: '#028090' }} />
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '15px'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: '500',
                fontSize: '15px'
              }}>
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '15px'
                }}
              />
            </div>
          </div>

          {/* Email (Read-only) */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: '500',
              fontSize: '15px'
            }}>
              <FaEnvelope style={{ marginRight: '8px', color: '#028090' }} />
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              readOnly
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '15px',
                background: '#f9fafb',
                color: '#6b7280',
                cursor: 'not-allowed'
              }}
            />
            <p style={{ fontSize: '12px', color: '#666', margin: '5px 0 0 0' }}>
              Email cannot be changed
            </p>
          </div>

          {/* Phone */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: '500',
              fontSize: '15px'
            }}>
              <FaPhone style={{ marginRight: '8px', color: '#028090' }} />
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              pattern="[6-9][0-9]{9}"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '15px'
              }}
            />
          </div>

          {/* Date of Birth, Gender, Blood Group */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: '500',
                fontSize: '15px'
              }}>
                <FaCalendar style={{ marginRight: '8px', color: '#028090' }} />
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '15px'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: '500',
                fontSize: '15px'
              }}>
                <FaVenusMars style={{ marginRight: '8px', color: '#028090' }} />
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '15px',
                  cursor: 'pointer'
                }}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: '500',
                fontSize: '15px'
              }}>
                <FaTint style={{ marginRight: '8px', color: '#028090' }} />
                Blood Group
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '15px',
                  cursor: 'pointer'
                }}
              >
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          {/* Patient ID (Read-only) */}
          {user.patientId && (
            <div style={{
              background: '#f0f9ff',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '25px',
              borderLeft: '4px solid #028090'
            }}>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                <strong>Patient ID:</strong> {user.patientId}
              </p>
            </div>
          )}

          {/* Save Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #028090 0%, #00A896 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(2, 128, 144, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <FaSave />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SettingsPage;