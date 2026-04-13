import React, { useState, useEffect } from 'react';
import { FaUser, FaSignOutAlt, FaIdCard, FaPhone, FaTint } from 'react-icons/fa';

function DashboardPage({ user, onLogout, onNavigate }) {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

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
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h1 style={{ margin: '0 0 5px 0', fontSize: '32px' }}>
              {greeting}, {user.firstName}! 👋
            </h1>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
              Welcome to your patient dashboard
            </p>
          </div>
          <button
            onClick={onLogout}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid white',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* User Info Card */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#028090', fontSize: '24px' }}>
          Your Profile
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            padding: '20px',
            background: '#f0f9ff',
            borderRadius: '8px',
            borderLeft: '4px solid #028090'
          }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
              <FaUser style={{ marginRight: '5px' }} />
              Full Name
            </div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
              {user.fullName || `${user.firstName} ${user.lastName}`}
            </div>
          </div>

          {user.patientId && (
            <div style={{
              padding: '20px',
              background: '#f0fdf4',
              borderRadius: '8px',
              borderLeft: '4px solid #10b981'
            }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                <FaIdCard style={{ marginRight: '5px' }} />
                Patient ID
              </div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                {user.patientId}
              </div>
            </div>
          )}

          <div style={{
            padding: '20px',
            background: '#fef3f2',
            borderRadius: '8px',
            borderLeft: '4px solid #f59e0b'
          }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
              <FaPhone style={{ marginRight: '5px' }} />
              Phone Number
            </div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
              {user.phoneNumber}
            </div>
          </div>

          {user.bloodGroup && (
            <div style={{
              padding: '20px',
              background: '#fef2f2',
              borderRadius: '8px',
              borderLeft: '4px solid #ef4444'
            }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                <FaTint style={{ marginRight: '5px' }} />
                Blood Group
              </div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                {user.bloodGroup}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#028090', fontSize: '24px' }}>
          Quick Actions
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          {[
            { icon: '📅', title: 'Book Appointment', desc: 'Schedule a visit', color: '#028090', action: 'bookAppointment' },
            { icon: '🎫', title: 'Join Queue', desc: 'Get a token number', color: '#10b981', action: 'joinQueue' },
            { icon: '📊', title: 'My Queue Status', desc: 'Check your position', color: '#f59e0b', action: 'queueStatus' },
            { icon: '📋', title: 'Treatment History', desc: 'Past consultations', color: '#8b5cf6', action: 'treatmentHistory' },
            { icon: '⚙️', title: 'Settings', desc: 'Update profile', color: '#6366f1', action: 'settings' }
          ].map((actionItem, index) => (
            <button
              key={index}
              onClick={() => onNavigate(actionItem.action)}
              style={{
                padding: '20px',
                background: 'white',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = actionItem.color;
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>
                {actionItem.icon}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
                {actionItem.title}
              </div>
              <div style={{ fontSize: '13px', color: '#666' }}>
                {actionItem.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div style={{
        marginTop: '20px',
        padding: '20px',
        background: '#fff9e6',
        borderRadius: '8px',
        border: '1px solid #f59e0b',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0, color: '#666' }}>
          🚀 <strong>More features coming soon!</strong> Queue management, appointments, and real-time updates.
        </p>
      </div>
    </div>
  );
}

export default DashboardPage;