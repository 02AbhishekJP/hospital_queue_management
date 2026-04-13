import React, { useState, useEffect } from 'react';
import { FaHospital, FaTicketAlt, FaClock } from 'react-icons/fa';

function QueuePage({ user, onBack }) {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [priority, setPriority] = useState('normal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/queue/departments');
      const data = await response.json();
      if (data.success) {
        setDepartments(data.data.departments);
      }
    } catch (err) {
      console.error('Failed to fetch departments:', err);
      setError('Failed to load departments');
    }
  };

  const handleJoinQueue = async () => {
    if (!selectedDept) {
      alert('Please select a department');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/queue/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          departmentId: selectedDept._id,
          priority
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ ${data.message}\n\nToken: ${data.data.queue.tokenNumber}\nPosition: ${data.data.queue.queuePosition}\nEstimated Wait: ${data.data.queue.estimatedWaitTime} minutes`);
        onBack(); // Go back to dashboard
      } else {
        setError(data.error.message);
      }
    } catch (err) {
      console.error('Join queue error:', err);
      setError('Failed to join queue. Please try again.');
    } finally {
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
          🎫 Join Queue
        </h1>
        <p style={{ margin: 0, opacity: 0.9 }}>
          Select a department and get your token number
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

      {/* Department Selection */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#028090' }}>
          Select Department
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '15px'
        }}>
          {departments.map(dept => (
            <button
              key={dept._id}
              onClick={() => setSelectedDept(dept)}
              style={{
                padding: '20px',
                background: selectedDept?._id === dept._id ? '#028090' : 'white',
                color: selectedDept?._id === dept._id ? 'white' : '#333',
                border: `2px solid ${selectedDept?._id === dept._id ? '#028090' : '#e5e7eb'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>
                {dept.isEmergency ? '🚨' : '🏥'}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
                {dept.name}
              </div>
              <div style={{ 
                fontSize: '12px', 
                opacity: selectedDept?._id === dept._id ? 0.9 : 0.6,
                marginBottom: '5px'
              }}>
                Code: {dept.code}
              </div>
              <div style={{ 
                fontSize: '12px', 
                opacity: selectedDept?._id === dept._id ? 0.9 : 0.6
              }}>
                Floor: {dept.floor}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Priority Selection */}
      {selectedDept && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '30px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#028090' }}>
            Select Priority
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            {[
              { value: 'normal', label: 'Normal', icon: '👤', desc: 'Standard queue' },
              { value: 'senior-citizen', label: 'Senior Citizen', icon: '👴', desc: 'Age 60+' },
              { value: 'pregnant', label: 'Pregnant', icon: '🤰', desc: 'Expectant mothers' },
              { value: 'emergency', label: 'Emergency', icon: '🚨', desc: 'Critical cases' }
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setPriority(opt.value)}
                style={{
                  padding: '15px',
                  background: priority === opt.value ? '#10b981' : 'white',
                  color: priority === opt.value ? 'white' : '#333',
                  border: `2px solid ${priority === opt.value ? '#10b981' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                  {opt.icon}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>
                  {opt.label}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  opacity: priority === opt.value ? 0.9 : 0.6
                }}>
                  {opt.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Join Button */}
      {selectedDept && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#028090' }}>
              Ready to Join Queue?
            </h3>
            <p style={{ margin: 0, color: '#666' }}>
              Department: <strong>{selectedDept.name}</strong> | Priority: <strong>{priority}</strong>
            </p>
          </div>

          <button
            onClick={handleJoinQueue}
            disabled={loading}
            style={{
              padding: '16px 60px',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #028090 0%, #00A896 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(2, 128, 144, 0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {loading ? 'Joining...' : '🎫 Get Token & Join Queue'}
          </button>
        </div>
      )}
    </div>
  );
}

export default QueuePage;