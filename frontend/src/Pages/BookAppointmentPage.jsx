import React, { useState, useEffect } from 'react';
import { FaCalendar, FaUserMd, FaHospital, FaClock } from 'react-icons/fa';

function BookAppointmentPage({ user, onBack }) {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    departmentId: '',
    appointmentDate: '',
    appointmentTime: '',
    chiefComplaint: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    }
  };

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
    
    if (!formData.departmentId || !formData.appointmentDate || !formData.appointmentTime) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // For now, we'll just show a success message
      // In production, you'd call a real API endpoint
      setTimeout(() => {
        setSuccess(`✅ Appointment booked successfully!\n\nDepartment: ${departments.find(d => d._id === formData.departmentId)?.name}\nDate: ${formData.appointmentDate}\nTime: ${formData.appointmentTime}`);
        setLoading(false);
        
        // Reset form
        setTimeout(() => {
          setFormData({
            departmentId: '',
            appointmentDate: '',
            appointmentTime: '',
            chiefComplaint: '',
            notes: ''
          });
          setSuccess('');
        }, 3000);
      }, 1000);
    } catch (err) {
      setError('Failed to book appointment');
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

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
          📅 Book Appointment
        </h1>
        <p style={{ margin: 0, opacity: 0.9 }}>
          Schedule your hospital visit in advance
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
          color: '#065f46',
          whiteSpace: 'pre-line'
        }}>
          {success}
        </div>
      )}

      {/* Form */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <form onSubmit={handleSubmit}>
          {/* Patient Info */}
          <div style={{
            background: '#f0f9ff',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '25px',
            borderLeft: '4px solid #028090'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#028090' }}>
              Patient Information
            </h3>
            <p style={{ margin: '5px 0', color: '#666' }}>
              <strong>Name:</strong> {user.fullName || `${user.firstName} ${user.lastName}`}
            </p>
            <p style={{ margin: '5px 0', color: '#666' }}>
              <strong>Patient ID:</strong> {user.patientId}
            </p>
            <p style={{ margin: '5px 0', color: '#666' }}>
              <strong>Phone:</strong> {user.phoneNumber}
            </p>
          </div>

          {/* Department Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: '500',
              fontSize: '15px'
            }}>
              <FaHospital style={{ marginRight: '8px', color: '#028090' }} />
              Select Department *
            </label>
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '15px',
                cursor: 'pointer'
              }}
            >
              <option value="">-- Choose Department --</option>
              {departments.map(dept => (
                <option key={dept._id} value={dept._id}>
                  {dept.name} ({dept.code}) - Floor {dept.floor}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
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
                <FaCalendar style={{ marginRight: '8px', color: '#028090' }} />
                Appointment Date *
              </label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                min={today}
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
                <FaClock style={{ marginRight: '8px', color: '#028090' }} />
                Preferred Time *
              </label>
              <select
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '15px',
                  cursor: 'pointer'
                }}
              >
                <option value="">-- Select Time --</option>
                <option value="09:00">09:00 AM</option>
                <option value="09:30">09:30 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="10:30">10:30 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="11:30">11:30 AM</option>
                <option value="14:00">02:00 PM</option>
                <option value="14:30">02:30 PM</option>
                <option value="15:00">03:00 PM</option>
                <option value="15:30">03:30 PM</option>
                <option value="16:00">04:00 PM</option>
                <option value="16:30">04:30 PM</option>
              </select>
            </div>
          </div>

          {/* Chief Complaint */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: '500',
              fontSize: '15px'
            }}>
              Chief Complaint / Reason for Visit
            </label>
            <input
              type="text"
              name="chiefComplaint"
              value={formData.chiefComplaint}
              onChange={handleChange}
              placeholder="e.g., Chest pain, Regular checkup, Follow-up"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '15px'
              }}
            />
          </div>

          {/* Additional Notes */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: '500',
              fontSize: '15px'
            }}>
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional information you'd like to share..."
              rows="4"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '15px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Submit Button */}
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
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {loading ? 'Booking...' : '📅 Book Appointment'}
          </button>
        </form>

        {/* Info Note */}
        <div style={{
          marginTop: '25px',
          padding: '15px',
          background: '#fff9e6',
          borderRadius: '8px',
          border: '1px solid #f59e0b',
          fontSize: '14px',
          color: '#92400e'
        }}>
          <strong>📌 Note:</strong> You will receive a confirmation message after booking. 
          Please arrive 15 minutes before your appointment time.
        </div>
      </div>
    </div>
  );
}

export default BookAppointmentPage;