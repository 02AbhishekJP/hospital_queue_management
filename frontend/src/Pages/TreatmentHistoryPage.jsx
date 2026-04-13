import React, { useState, useEffect } from 'react';
import { FaHistory, FaCalendar, FaClock, FaHospital, FaFileUpload, FaFilePdf, FaFileImage, FaDownload, FaTrash } from 'react-icons/fa';

function TreatmentHistoryPage({ user, onBack }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState({});
  const [uploadingFor, setUploadingFor] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/queue/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setHistory(data.data.history);
        // Fetch documents for each consultation
        data.data.history.forEach(item => {
          fetchDocuments(item._id);
        });
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async (consultationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/documents/${consultationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setDocuments(prev => ({
          ...prev,
          [consultationId]: data.data.documents
        }));
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  const handleFileSelect = async (consultationId, documentType, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('❌ Only JPG, PNG, and PDF files are allowed');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('❌ File size must be less than 10MB');
      return;
    }

    setUploadingFor(consultationId);

    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);
    formData.append('description', `${documentType} for consultation`);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/documents/upload/${consultationId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ ${documentType} uploaded successfully!`);
        fetchDocuments(consultationId);
      } else {
        alert('❌ ' + data.error.message);
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('❌ Failed to upload document');
    } finally {
      setUploadingFor(null);
    }
  };

  const handleDownload = async (documentId, fileName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/documents/download/${documentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('❌ Failed to download document');
      }
    } catch (err) {
      console.error('Download error:', err);
      alert('❌ Failed to download document');
    }
  };

  const handleDelete = async (consultationId, documentId) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Document deleted successfully');
        fetchDocuments(consultationId);
      } else {
        alert('❌ ' + data.error.message);
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('❌ Failed to delete document');
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
          <div style={{ fontSize: '18px', color: '#666' }}>Loading history...</div>
        </div>
      </div>
    );
  }

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
          <FaHistory style={{ marginRight: '10px' }} />
          Treatment History
        </h1>
        <p style={{ margin: 0, opacity: 0.9 }}>
          View your past consultations and upload documents
        </p>
      </div>

      {history.length === 0 ? (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '60px 30px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>📋</div>
          <h2 style={{ color: '#666', fontSize: '24px', marginBottom: '10px' }}>
            No Treatment History
          </h2>
          <p style={{ color: '#999', fontSize: '16px' }}>
            Your completed consultations will appear here
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {history.map((item, index) => (
            <div key={index} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '25px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #028090'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '20px',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#028090',
                    marginBottom: '5px'
                  }}>
                    Token: {item.tokenNumber}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    <FaHospital style={{ marginRight: '5px' }} />
                    {item.department?.name || 'N/A'} Department
                  </div>
                </div>
                <div style={{
                  padding: '8px 16px',
                  background: '#d1fae5',
                  color: '#065f46',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  COMPLETED
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                marginBottom: '20px'
              }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                    <FaCalendar style={{ marginRight: '5px' }} />
                    Date
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>
                    {new Date(item.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                    <FaClock style={{ marginRight: '5px' }} />
                    Time
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>
                    {item.consultationEndTime ? new Date(item.consultationEndTime).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'N/A'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                    Wait Time
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>
                    {item.actualWaitTime || 'N/A'} minutes
                  </div>
                </div>
              </div>

              {/* Uploaded Documents */}
              {documents[item._id] && documents[item._id].length > 0 && (
                <div style={{
                  background: '#f9fafb',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '15px'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
                    📎 Uploaded Documents
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {documents[item._id].map((doc, docIndex) => (
                      <div key={docIndex} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px',
                        background: 'white',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {doc.mimeType === 'application/pdf' ? (
                            <FaFilePdf style={{ fontSize: '24px', color: '#dc2626' }} />
                          ) : (
                            <FaFileImage style={{ fontSize: '24px', color: '#3b82f6' }} />
                          )}
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
                              {doc.originalFileName}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              {doc.documentType.replace('-', ' ').toUpperCase()} • {(doc.fileSize / 1024).toFixed(2)} KB
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleDownload(doc._id, doc.originalFileName)}
                            style={{
                              padding: '8px 12px',
                              background: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <FaDownload /> Download
                          </button>
                          <button
                            onClick={() => handleDelete(item._id, doc._id)}
                            style={{
                              padding: '8px 12px',
                              background: '#dc2626',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Buttons */}
              <div style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap'
              }}>
                <label style={{
                  padding: '10px 20px',
                  background: uploadingFor === item._id ? '#ccc' : '#028090',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: uploadingFor === item._id ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FaFileUpload />
                  {uploadingFor === item._id ? 'Uploading...' : 'Upload Prescription'}
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                    onChange={(e) => handleFileSelect(item._id, 'prescription', e)}
                    disabled={uploadingFor === item._id}
                    style={{ display: 'none' }}
                  />
                </label>

                <label style={{
                  padding: '10px 20px',
                  background: uploadingFor === item._id ? '#ccc' : '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: uploadingFor === item._id ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FaFileUpload />
                  {uploadingFor === item._id ? 'Uploading...' : 'Upload Bill'}
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                    onChange={(e) => handleFileSelect(item._id, 'bill', e)}
                    disabled={uploadingFor === item._id}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TreatmentHistoryPage;