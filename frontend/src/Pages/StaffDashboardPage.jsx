import React, { useState, useEffect } from 'react';
import { FaUsers, FaBell, FaHospital, FaClock } from 'react-icons/fa';
import { 
  initializeSocket, 
  connectSocket, 
  disconnectSocket,
  joinDepartment, 
  leaveDepartment,
  onQueueUpdate,
  offQueueUpdate
} from '../services/socket.service';

function StaffDashboardPage({ user, onLogout, onNavigate }) {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [queues, setQueues] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDept) {
      fetchQueueStatus();
      const interval = setInterval(fetchQueueStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedDept]);

  // Socket.IO for real-time updates
  useEffect(() => {
    if (selectedDept) {
      const socket = initializeSocket();
      connectSocket();
      
      joinDepartment(selectedDept._id);

      onQueueUpdate((data) => {
        console.log('🔄 Queue updated:', data);
        fetchQueueStatus();
      });

      return () => {
        leaveDepartment(selectedDept._id);
        offQueueUpdate();
      };
    }
  }, [selectedDept?._id]);

  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/queue/departments');
      const data = await response.json();
      if (data.success) {
        setDepartments(data.data.departments);
        if (data.data.departments.length > 0) {
          setSelectedDept(data.data.departments[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  };

  const fetchQueueStatus = async () => {
    if (!selectedDept) return;

    try {
      const response = await fetch(`http://localhost:5000/api/queue/status/${selectedDept._id}`);
      const data = await response.json();
      if (data.success) {
        setQueues(data.data.queues);
        setStats(data.data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch queue status:', err);
    }
  };

  const handleCallNext = async () => {
    if (!selectedDept) return;

    const nextPatient = queues.find(q => q.status === 'waiting');
    if (!nextPatient) {
      alert('No patients waiting in queue');
      return;
    }

    if (!confirm(`Call patient with token ${nextPatient.tokenNumber}?`)) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/queue/call-next', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          departmentId: selectedDept._id
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`✅ ${data.message}`);
        fetchQueueStatus();
      } else {
        alert('❌ ' + data.error.message);
      }
    } catch (err) {
      console.error('Call next error:', err);
      alert('❌ Failed to call patient');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteConsultation = async (queueItem) => {
    if (!confirm(`Mark consultation as complete for ${queueItem.tokenNumber}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/queue/complete/${queueItem._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          notes: 'Consultation completed',
          diagnosis: ''
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`✅ Consultation completed for ${queueItem.tokenNumber}`);
        fetchQueueStatus();
      } else {
        alert('❌ ' + data.error.message);
      }
    } catch (err) {
      console.error('Complete consultation error:', err);
      alert('❌ Failed to complete consultation');
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
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        padding: '30px',
        borderRadius: '12px',
        color: 'white',
        marginBottom: '30px',
        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
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
              👨‍⚕️ Staff Dashboard
            </h1>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
              Welcome, {user.firstName} | Role: {user.role}
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
              fontWeight: 'bold'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Analytics Button */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <button
          onClick={() => onNavigate && onNavigate('analytics')}
          style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
          }}
        >
          📊 View Analytics Dashboard
        </button>
      </div>

      {/* Department Selector */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <label style={{
          display: 'block',
          marginBottom: '10px',
          color: '#333',
          fontWeight: 'bold',
          fontSize: '16px'
        }}>
          <FaHospital style={{ marginRight: '8px' }} />
          Select Department
        </label>
        <select
          value={selectedDept?._id || ''}
          onChange={(e) => {
            const dept = departments.find(d => d._id === e.target.value);
            setSelectedDept(dept);
          }}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '15px',
            cursor: 'pointer'
          }}
        >
          {departments.map(dept => (
            <option key={dept._id} value={dept._id}>
              {dept.name} ({dept.code})
            </option>
          ))}
        </select>
      </div>

      {/* Statistics */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '20px'
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #3b82f6'
          }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
              Total Waiting
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>
              {stats.totalWaiting}
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #10b981'
          }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
              Currently Serving
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
              {stats.currentlyServing}
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #f59e0b'
          }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
              Avg Wait Time
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>
              {stats.averageWaitTime}m
            </div>
          </div>
        </div>
      )}

      {/* Call Next Patient Button */}
      <button
        onClick={handleCallNext}
        disabled={loading || queues.filter(q => q.status === 'waiting').length === 0}
        style={{
          width: '100%',
          padding: '20px',
          background: loading ? '#ccc' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '20px',
          fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '20px',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}
      >
        <FaBell />
        {loading ? 'Calling...' : 'Call Next Patient'}
      </button>

      {/* Queue List */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#6366f1', fontSize: '24px' }}>
          Current Queue - {selectedDept?.name}
        </h2>

        {queues.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#999'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📋</div>
            <div style={{ fontSize: '18px' }}>No patients in queue</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#666', fontSize: '14px' }}>Position</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#666', fontSize: '14px' }}>Token</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#666', fontSize: '14px' }}>Priority</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#666', fontSize: '14px' }}>Status</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#666', fontSize: '14px' }}>Check-in Time</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#666', fontSize: '14px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {queues.map((queue, index) => (
                  <tr key={index} style={{
                    borderBottom: '1px solid #f0f0f0',
                    background: queue.status === 'waiting' && index === 0 ? '#f0fdf4' : 'white'
                  }}>
                    <td style={{ padding: '15px', fontWeight: 'bold', fontSize: '18px' }}>
                      {queue.queuePosition}
                    </td>
                    <td style={{ padding: '15px', fontWeight: 'bold', color: '#6366f1' }}>
                      {queue.tokenNumber}
                    </td>
                    <td style={{ padding: '15px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        background: queue.priority === 'emergency' ? '#fee' : queue.priority === 'senior-citizen' ? '#fef3c7' : '#f0f0f0',
                        color: queue.priority === 'emergency' ? '#c00' : queue.priority === 'senior-citizen' ? '#92400e' : '#666'
                      }}>
                        {queue.priority.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        background: queue.status === 'waiting' ? '#dbeafe' : queue.status === 'called' ? '#dcfce7' : '#fef3c7',
                        color: queue.status === 'waiting' ? '#1e40af' : queue.status === 'called' ? '#166534' : '#92400e'
                      }}>
                        {queue.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '15px', color: '#666' }}>
                      {new Date(queue.checkInTime).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td style={{ padding: '15px' }}>
                      {queue.status === 'called' && (
                        <button
                          onClick={() => handleCompleteConsultation(queue)}
                          style={{
                            padding: '8px 16px',
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          ✓ Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Auto-refresh indicator */}
      <div style={{
        marginTop: '20px',
        textAlign: 'center',
        color: '#666',
        fontSize: '14px'
      }}>
        🔄 Auto-refreshing every 5 seconds
      </div>
    </div>
  );
}

export default StaffDashboardPage;