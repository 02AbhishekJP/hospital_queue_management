import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import QueuePage from './pages/QueuePage'
import QueueStatusPage from './pages/QueueStatusPage'
import BookAppointmentPage from './pages/BookAppointmentPage'
import SettingsPage from './pages/SettingsPage'
import StaffDashboardPage from './pages/StaffDashboardPage'
import AnalyticsPage from './pages/AnalyticsPage'
import TreatmentHistoryPage from './pages/TreatmentHistoryPage'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
      setCurrentPage('dashboard')
    }
    setLoading(false)
  }, [])

  const handleLoginSuccess = (data) => {
    setUser(data.user)
    setCurrentPage('dashboard')
  }

  const handleRegisterSuccess = (data) => {
    setUser(data.user)
    setCurrentPage('dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setCurrentPage('home')
  }

  const handleNavigate = (page) => {
    setCurrentPage(page)
  }

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser)
  }

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
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🏥</div>
          <div style={{ fontSize: '18px', color: '#666' }}>Loading...</div>
        </div>
      </div>
    )
  }

  // Route handling for logged-in users
// Route handling for logged-in users
// Route handling for logged-in users
  if (user) {
    // If user is staff/doctor/admin
    if (user.role === 'staff' || user.role === 'doctor' || user.role === 'admin') {
      if (currentPage === 'analytics') {
        return <AnalyticsPage user={user} onBack={() => setCurrentPage('dashboard')} />
      }
      return <StaffDashboardPage user={user} onLogout={handleLogout} onNavigate={handleNavigate} />
    }

    // Patient routes
   // Patient routes
    switch(currentPage) {
      case 'dashboard':
        return <DashboardPage user={user} onLogout={handleLogout} onNavigate={handleNavigate} />
      case 'joinQueue':
        return <QueuePage user={user} onBack={() => setCurrentPage('dashboard')} />
      case 'queueStatus':
        return <QueueStatusPage user={user} onBack={() => setCurrentPage('dashboard')} />
      case 'bookAppointment':
        return <BookAppointmentPage user={user} onBack={() => setCurrentPage('dashboard')} />
      case 'treatmentHistory':
        return <TreatmentHistoryPage user={user} onBack={() => setCurrentPage('dashboard')} />
      case 'settings':
        return <SettingsPage user={user} onBack={() => setCurrentPage('dashboard')} onUpdateUser={handleUpdateUser} />
      default:
        return <DashboardPage user={user} onLogout={handleLogout} onNavigate={handleNavigate} />
    }
  }

  // Login page
  if (currentPage === 'login') {
    return (
      <LoginPage
        onSwitchToRegister={() => setCurrentPage('register')}
        onLoginSuccess={handleLoginSuccess}
      />
    )
  }

  // Register page
  if (currentPage === 'register') {
    return (
      <RegisterPage
        onSwitchToLogin={() => setCurrentPage('login')}
        onRegisterSuccess={handleRegisterSuccess}
      />
    )
  }

  // Home page (landing)
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
        maxWidth: '600px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{ fontSize: '72px', marginBottom: '20px' }}>🏥</div>
        <h1 style={{ fontSize: '48px', margin: '0 0 20px 0', fontWeight: 'bold' }}>
          Hospital Queue Management
        </h1>
        <p style={{ fontSize: '20px', marginBottom: '40px', opacity: 0.9 }}>
          Join queues digitally, track wait times in real-time
        </p>
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setCurrentPage('login')}
            style={{
              padding: '16px 40px',
              background: 'white',
              color: '#028090',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
          >
            Login
          </button>
          
          <button
            onClick={() => setCurrentPage('register')}
            style={{
              padding: '16px 40px',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '2px solid white',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)