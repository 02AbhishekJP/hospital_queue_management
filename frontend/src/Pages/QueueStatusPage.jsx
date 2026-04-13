import React, { useState, useEffect } from 'react';
import { FaTicketAlt, FaUsers, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { 
  initializeSocket, 
  connectSocket, 
  disconnectSocket,
  joinPatient, 
  leavePatient,
  onPatientCalled,
  onConsultationCompleted,
  offPatientCalled,
  offConsultationCompleted
} from '../services/socket.service';

function QueueStatusPage({ user, onBack }) {
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQueueStatus();
    const interval = setInterval(fetchQueueStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  // Socket.IO for real-time updates
  useEffect(() => {
    const socket = initializeSocket();
    connectSocket();

    if (queueData?.inQueue && queueData.queue) {
      const patientId = queueData.queue.department?._id || queueData.queue.patientId;
      if (patientId) {
        joinPatient(patientId);
      }
    }

    onPatientCalled((data) => {
      console.log('🔔 You have been called!', data);
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Your Turn!', {
          body: data.message || 'Please proceed to the consultation room.',
        });
      }
      
      alert(`🔔 ${data.message || 'Your turn! Please proceed to consultation room.'}`);
      fetchQueueStatus();
    });

    onConsultationCompleted((data) => {
      console.log('✅ Consultation completed', data);
      alert('✅ Your consultation has been completed. Thank you!');
      fetchQueueStatus();
    });

    return () => {
      if (queueData?.inQueue && queueData.queue) {
        const patientId = queueData.queue.department?._id || queueData.queue.patientId;
        if (patientId) {
          leavePatient(patientId);
        }
      }
      offPatientCalled();
      offConsultationCompleted();
      disconnectSocket();
    };
  }, [queueData?.inQueue]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const fetchQueueStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/queue/my-status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setQueueData(data.data);
        setError('');
      }
    } catch (err) {
      console.error('Failed to fetch queue status:', err);
      setError('Failed to load queue status');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveQueue = async () => {
    if (!confirm('Are you sure you want to leave the queue?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/queue/leave', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ You have left the queue');
        fetchQueueStatus();
      } else {
        alert('❌ ' + data.error.message);
      }
    } catch (err) {
      alert('❌ Failed to leave queue');
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <div style={{ fontSize: '18px', color: '#666' }}>Loading queue status...</div>
        </div>
      </div>
    );
  }

  if (!queueData?.inQueue) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f5f5f5',
        padding: '20px'
      }}>
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
          <h1 style={{ margin: 0, fontSize: '32px' }}>Queue Status</h1>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '60px 30px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>📋</div>
          <h2 style={{ color: '#666', fontSize: '24px', marginBottom: '10px' }}>
            Not in Queue
          </h2>
          <p style={{ color: '#999', fontSize: '16px' }}>
            You are not currently in any queue today
          </p>
        </div>
      </div>
    );
  }

  const { queue, patientsBefore, estimatedTimeMinutes } = queueData;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      padding: '20px'
    }}>
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
          Your Queue Status
        </h1>
        <p style={{ margin: 0, opacity: 0.9 }}>
          {queue.department?.name || 'N/A'} Department
        </p>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        borderRadius: '12px',
        padding: '40px',
        marginBottom: '20px',
        textAlign: 'center',
        color: 'white',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
      }}>
        <div style={{ fontSize: '14px', marginBottom: '10px', opacity: 0.9 }}>
          YOUR TOKEN NUMBER
        </div>
        <div style={{ fontSize: '64px', fontWeight: 'bold', marginBottom: '10px' }}>
          {queue.tokenNumber}
        </div>
        <div style={{ fontSize: '16px', opacity: 0.9 }}>
          Please keep this token safe
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '25px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            background: '#dbeafe',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 15px',
            fontSize: '28px'
          }}>
            📍
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
            {queue.queuePosition}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            Position in Queue
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '25px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            background: '#fef3c7',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 15px',
            fontSize: '28px'
          }}>
            <FaUsers />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
            {patientsBefore}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            Patients Before You
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '25px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            background: '#dcfce7',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 15px',
            fontSize: '28px'
          }}>
            <FaClock />
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
            {estimatedTimeMinutes}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            Minutes Wait Time
          </div>
        </div>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '25px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: queue.status === 'waiting' ? '#f59e0b' : queue.status === 'called' ? '#10b981' : '#3b82f6',
            marginRight: '10px'
          }}></div>
          <div>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '3px' }}>
              Current Status
            </div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
              {queue.status === 'waiting' && '⏳ Waiting in Queue'}
              {queue.status === 'called' && '🔔 Your Turn - Please Proceed!'}
              {queue.status === 'in-consultation' && '👨‍⚕️ In Consultation'}
            </div>
          </div>
        </div>

        {queue.status === 'called' && (
          <div style={{
            background: '#dcfce7',
            border: '2px solid #10b981',
            borderRadius: '8px',
            padding: '15px',
            marginTop: '15px'
          }}>
            <div style={{ fontWeight: 'bold', color: '#065f46', marginBottom: '5px' }}>
              🔔 Attention!
            </div>
            <div style={{ color: '#047857' }}>
              Your token has been called. Please proceed to the consultation room immediately.
            </div>
          </div>
        )}
      </div>

      <div style={{
        background: '#fff9e6',
        border: '1px solid #f59e0b',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '20px',
        textAlign: 'center',
        fontSize: '14px',
        color: '#92400e'
      }}>
        🔄 This page auto-refreshes every 10 seconds
      </div>

      {(queue.status === 'waiting' || queue.status === 'called') && (
        <button
          onClick={handleLeaveQueue}
          style={{
            width: '100%',
            padding: '16px',
            background: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.background = '#b91c1c'}
          onMouseLeave={(e) => e.target.style.background = '#dc2626'}
        >
          🚪 Leave Queue
        </button>
      )}
    </div>
  );
}

export default QueueStatusPage;