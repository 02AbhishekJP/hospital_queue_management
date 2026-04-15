<div align="center">

# 🏥 Hospital Queue Management System

### Digital Queue Management Solution with Real-time Updates & Analytics

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [Screenshots](#-screenshots) • [License](#-license)

</div>

---

## 📖 Table of Contents

- [About](#-about-the-project)
- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Performance](#-performance)
- [Security](#-security)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 About The Project

A comprehensive **Full-Stack MERN** application designed to revolutionize hospital queue management. This digital solution eliminates traditional waiting room chaos by providing real-time queue tracking, intelligent priority management, and automated patient notifications.

**Built as a complete production-ready system** with authentication, real-time updates, analytics, document management, and SMS integration.

### Why This Project?

Traditional hospital queues create:
- ❌ Uncertainty about wait times
- ❌ Overcrowded waiting areas
- ❌ Poor patient experience
- ❌ Inefficient staff management
- ❌ No real-time visibility

This system solves all these problems! ✅

---

## 🔥 Problem Statement

**Current Challenges in Hospital Queue Management:**

1. **Patient Frustration**
   - No visibility into queue position
   - Uncertain wait times
   - Need to physically wait in crowded areas

2. **Staff Inefficiency**
   - Manual queue management
   - No centralized tracking
   - Difficulty managing multiple departments

3. **Resource Wastage**
   - Overcrowded waiting rooms
   - Inefficient time utilization
   - No data-driven insights

4. **Poor Communication**
   - Manual calling of patients
   - No automated notifications
   - Missed appointments

---

## ✨ Solution

A **digital queue management ecosystem** that provides:

### For Patients 👥
- 📱 Virtual queue tokens
- 📊 Real-time position tracking
- 🔔 SMS notifications when turn approaches
- 📅 Appointment booking
- 📋 Complete treatment history
- 📄 Document upload/download

### For Hospital Staff 👨‍⚕️
- 🎯 Unified queue dashboard
- 📞 One-click patient calling
- ✅ Consultation management
- 📊 Real-time analytics
- 📈 Department-wise insights
- 📱 SMS notification triggers

### For Management 📊
- 📈 Performance metrics
- 📉 Wait time analytics
- 🏥 Department comparisons
- 🕐 Peak hours identification
- 📊 Patient flow visualization

---

## 🚀 Features

### Core Functionality

#### **Patient Features**
- ✅ User registration & authentication
- ✅ Digital token generation with unique IDs (e.g., CARDIO-001)
- ✅ Real-time queue position tracking
- ✅ Estimated wait time calculation (30 min per patient)
- ✅ Priority-based queue entry (Emergency, Pregnant, Senior Citizen, Normal)
- ✅ SMS notifications at multiple stages
- ✅ Appointment booking system
- ✅ Treatment history with complete details
- ✅ Document upload (prescriptions, bills) - PDF, JPG, PNG
- ✅ Document download functionality
- ✅ Profile management
- ✅ Leave queue option

#### **Staff/Doctor Features**
- ✅ Secure staff authentication
- ✅ Multi-department queue management
- ✅ Call next patient functionality
- ✅ Complete consultation workflow
- ✅ Real-time queue statistics
- ✅ Auto-refresh dashboard (5-second intervals)
- ✅ Patient information visibility
- ✅ Department switching

#### **Analytics Dashboard**
- ✅ Daily patient flow trends (7-day view)
- ✅ Wait time analysis charts
- ✅ Department-wise comparison (bar charts)
- ✅ Hourly distribution (peak hours identification)
- ✅ Priority distribution (pie charts)
- ✅ Real-time statistics cards
- ✅ Auto-refresh analytics (30-second intervals)

### Advanced Features

#### **Real-time Updates (Socket.IO)**
- ⚡ Live queue position updates
- ⚡ Instant patient calling notifications
- ⚡ Staff dashboard auto-refresh
- ⚡ Patient status page auto-updates
- ⚡ Room-based broadcasting (department-wise)

#### **SMS Notifications (Twilio)**
- 📱 Queue joined confirmation
- 📱 Turn approaching alert (2 patients before)
- 📱 Patient called notification
- 📱 Consultation completed message
- 📱 Appointment confirmation

#### **Priority Queue System**
- 🚨 Emergency - Priority 1 (Highest)
- 🤰 Pregnant - Priority 2
- 👴 Senior Citizen - Priority 3
- 👤 Normal - Priority 4 (Lowest)
- Auto-repositioning when priority patients join

#### **Document Management**
- 📄 File upload (Multer integration)
- 📄 File type validation (PDF, JPG, PNG only)
- 📄 File size limit (10MB max)
- 📄 Secure file storage
- 📄 Download functionality
- 📄 Delete option for patients

#### **Security Features**
- 🔐 JWT authentication
- 🔐 Password encryption (bcrypt)
- 🔐 Role-based access control (4 roles)
- 🔐 Protected API routes
- 🔐 Input validation
- 🔐 CORS configuration

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| **React.js** | UI Library | 18.x |
| **Vite** | Build Tool | 5.x |
| **Chart.js** | Data Visualization | 4.x |
| **react-chartjs-2** | React wrapper for Chart.js | 5.x |
| **Socket.IO Client** | Real-time Communication | 4.x |
| **React Icons** | Icon Library | 5.x |

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime Environment | 18.x+ |
| **Express.js** | Web Framework | 4.x |
| **MongoDB** | Database | 6.x |
| **Mongoose** | ODM | 8.x |
| **Socket.IO** | WebSocket Server | 4.x |
| **JWT** | Authentication | 9.x |
| **Bcrypt** | Password Hashing | 5.x |
| **Multer** | File Upload | 1.x |
| **Twilio** | SMS Service | 5.x |
| **dotenv** | Environment Variables | 16.x |
| **cors** | Cross-Origin Resource Sharing | 2.x |

### Development Tools
- **Git** - Version Control
- **Postman** - API Testing
- **VS Code** - Code Editor
- **MongoDB Compass** - Database GUI

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Patient    │  │    Staff     │  │   Doctor     │          │
│  │   Dashboard  │  │   Dashboard  │  │   Dashboard  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│           │                │                  │                  │
└───────────┼────────────────┼──────────────────┼──────────────────┘
            │                │                  │
            └────────────────┴──────────────────┘
                             │
                    ┌────────▼────────┐
                    │   React.js      │
                    │   Frontend      │
                    │  (Port 3000)    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   Socket.IO     │ ◄─── Real-time Updates
                    │   WebSocket     │
                    └────────┬────────┘
                             │
┌────────────────────────────▼───────────────────────────────────┐
│                     API LAYER                                   │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              Express.js REST API                         │ │
│  │              (Port 5000)                                 │ │
│  │                                                          │ │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  │ │
│  │  │  Auth   │  │  Queue  │  │Document │  │Analytics│  │ │
│  │  │  Routes │  │  Routes │  │ Routes  │  │ Routes  │  │ │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘  │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────┬───────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
│   MongoDB      │  │   Multer        │  │   Twilio       │
│   Database     │  │   File Storage  │  │   SMS API      │
│                │  │   (/uploads)    │  │                │
└────────────────┘  └─────────────────┘  └────────────────┘
```

### Data Flow

```
1. User Registration/Login
   ↓
2. JWT Token Generated
   ↓
3. Token Stored in LocalStorage
   ↓
4. Token Sent with Every Request
   ↓
5. Middleware Validates Token
   ↓
6. Request Processed
   ↓
7. Response Sent to Client
   ↓
8. Socket.IO Broadcasts Updates
   ↓
9. All Connected Clients Updated
```


---

## 📁 Project Structure

```
hospital-queue-management-system/
│
├── backend/                                # Server-side code
│   ├── src/
│   │   ├── controllers/                   # Business logic
│   │   │   ├── auth.controller.js         # Authentication (register, login)
│   │   │   ├── queue.controller.js        # Queue operations (join, status, call)
│   │   │   ├── document.controller.js     # File upload/download
│   │   │   └── analytics.controller.js    # Statistics & charts
│   │   │
│   │   ├── models/                        # Database schemas
│   │   │   ├── User.js                    # User accounts
│   │   │   ├── Patient.js                 # Patient details (PAT-XXXXXX)
│   │   │   ├── Queue.js                   # Queue entries
│   │   │   ├── Department.js              # Hospital departments
│   │   │   └── ConsultationDocument.js    # Uploaded files metadata
│   │   │
│   │   ├── routes/                        # API endpoints
│   │   │   ├── auth.routes.js             # POST /api/auth/register, login
│   │   │   ├── queue.routes.js            # POST /api/queue/join, status
│   │   │   ├── document.routes.js         # POST /api/documents/upload
│   │   │   └── analytics.routes.js        # GET /api/analytics/stats
│   │   │
│   │   ├── middleware/                    # Interceptors
│   │   │   ├── auth.middleware.js         # JWT verification, role check
│   │   │   └── upload.middleware.js       # Multer file handling
│   │   │
│   │   └── services/                      # Helper functions
│   │       ├── sms.service.js             # Twilio SMS integration
│   │       └── queue-monitor.service.js   # Background job (turn approaching)
│   │
│   ├── uploads/                           # Uploaded files storage
│   ├── server.js                          # Entry point, Socket.IO setup
│   ├── package.json                       # Dependencies
│   ├── .env.example                       # Environment variables template
│   ├── seed-departments.js                # Database seeder (5 departments)
│   ├── seed-staff.js                      # Staff account seeder
│   └── generate-test-data.js              # Test data generator
│
├── frontend/                              # Client-side code
│   ├── src/
│   │   ├── pages/                         # React components
│   │   │   ├── LoginPage.jsx              # Login interface
│   │   │   ├── RegisterPage.jsx           # User registration
│   │   │   ├── DashboardPage.jsx          # Patient home (5 quick actions)
│   │   │   ├── StaffDashboardPage.jsx     # Staff home (queue management)
│   │   │   ├── QueuePage.jsx              # Join queue (dept + priority)
│   │   │   ├── QueueStatusPage.jsx        # View position (auto-refresh)
│   │   │   ├── BookAppointmentPage.jsx    # Book appointments
│   │   │   ├── TreatmentHistoryPage.jsx   # Past consultations + uploads
│   │   │   ├── SettingsPage.jsx           # Profile update
│   │   │   └── AnalyticsPage.jsx          # Charts (6 visualizations)
│   │   │
│   │   ├── services/                      # Helper modules
│   │   │   └── socket.service.js          # Socket.IO client wrapper
│   │   │
│   │   ├── main.jsx                       # App entry, routing logic
│   │   └── index.css                      # Global styles
│   │
│   ├── public/                            # Static files
│   ├── package.json                       # Dependencies
│   └── vite.config.js                     # Build configuration
│
├── README.md                              # This file
├── LICENSE                                # MIT License
└── .gitignore                             # Git ignore rules
```

---

## ⚙️ Installation

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v16.x or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5.x or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/downloads)

### Step 1: Clone Repository

```bash
git clone https://github.com/02AbhishekJP/hospital-queue-management-system.git
cd hospital-queue-management-system
```

### Step 2: Backend Setup

```bash
cd backend
npm install
```

**Create `.env` file:**

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

**Edit `.env` file with your credentials:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/hospital-queue

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Twilio SMS (Optional - for SMS notifications)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

**Seed Database:**

```bash
# Seed departments (Cardiology, Orthopedics, Pediatrics, Emergency, General Medicine)
node seed-departments.js

# Seed staff users (staff@hospital.com, doctor@hospital.com)
node seed-staff.js

# Optional: Generate test data for analytics
node generate-test-data.js
```

**Start Backend:**

```bash
npm run dev
```

✅ Backend running on **http://localhost:5000**

---

### Step 3: Frontend Setup

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend running on **http://localhost:3000**

---

## 🎮 Usage

### Default Login Credentials

#### Staff Account
Email: staff@hospital.com
Password: staff123

#### Doctor Account
Email: doctor@hospital.com
Password: doctor123

#### Patient Account
Create via registration page at http://localhost:3000

---

### Quick Start Guide

#### **For Patients:**

1. **Register:**
   - Go to http://localhost:3000
   - Click "Create Account"
   - Fill details (name, email, password, phone, blood group)
   - Auto-generates Patient ID (e.g., PAT-000001)

2. **Join Queue:**
   - Login → Dashboard → "Join Queue"
   - Select department (Cardiology, Orthopedics, etc.)
   - Select priority (Emergency, Pregnant, Senior Citizen, Normal)
   - Get token number (e.g., CARDIO-001)
   - Receive SMS confirmation

3. **Track Status:**
   - Dashboard → "My Queue Status"
   - See position, patients before you, wait time
   - Auto-refreshes every 10 seconds
   - Receive SMS when turn approaches

4. **View History:**
   - Dashboard → "Treatment History"
   - See past consultations
   - Upload prescriptions/bills
   - Download documents

#### **For Staff/Doctors:**

1. **Login:**
   - Use staff@hospital.com / staff123

2. **Manage Queue:**
   - Select department from dropdown
   - View all waiting patients
   - See statistics (Total Waiting, Avg Wait Time)
   - Auto-refreshes every 5 seconds

3. **Call Patient:**
   - Click "Call Next Patient"
   - Patient gets SMS notification
   - Patient status changes to "Called"

4. **Complete Consultation:**
   - Click "✓ Complete" next to called patient
   - Patient removed from queue
   - Data saved to history

5. **View Analytics:**
   - Click "📊 View Analytics Dashboard"
   - See 6 charts:
     - Daily patient flow (7 days)
     - Wait time trends
     - Department comparison
     - Peak hours distribution
     - Priority distribution
     - Department details table

---

## 📡 API Documentation

### Base URL
http://localhost:5000/api

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phoneNumber": "9876543210",
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "bloodGroup": "A+"
}

Response: {
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: {
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

---

### Queue Endpoints

#### Join Queue
```http
POST /queue/join
Authorization: Bearer {token}
Content-Type: application/json

{
  "departmentId": "507f1f77bcf86cd799439011",
  "priority": "normal"
}

Response: {
  "success": true,
  "message": "Token CARDIO-001 assigned successfully!",
  "data": {
    "queue": {
      "tokenNumber": "CARDIO-001",
      "queuePosition": 5,
      "estimatedWaitTime": 120
    }
  }
}
```

#### Get My Queue Status
```http
GET /queue/my-status
Authorization: Bearer {token}

Response: {
  "success": true,
  "data": {
    "inQueue": true,
    "queue": {
      "tokenNumber": "CARDIO-001",
      "queuePosition": 3,
      "status": "waiting",
      "estimatedWaitTime": 60
    },
    "patientsBefore": 2
  }
}
```

#### Call Next Patient (Staff Only)
```http
POST /queue/call-next
Authorization: Bearer {token}
Content-Type: application/json

{
  "departmentId": "507f1f77bcf86cd799439011"
}

Response: {
  "success": true,
  "message": "Patient CARDIO-001 has been called"
}
```

#### Complete Consultation (Staff Only)
```http
POST /queue/complete/{queueId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "notes": "Consultation completed successfully"
}

Response: {
  "success": true,
  "message": "Consultation completed successfully"
}
```

---

### Analytics Endpoints (Staff Only)

#### Get Overall Statistics
```http
GET /analytics/stats
Authorization: Bearer {token}

Response: {
  "success": true,
  "data": {
    "today": {
      "total": 45,
      "completed": 32,
      "waiting": 8,
      "avgWaitTime": 35
    },
    "thisMonth": {
      "total": 1250,
      "completed": 1100
    }
  }
}
```

#### Get Daily Flow (7 days)
```http
GET /analytics/daily-flow
Authorization: Bearer {token}

Response: {
  "success": true,
  "data": {
    "dailyFlow": [
      { "date": "Apr 6", "total": 42, "completed": 38 },
      { "date": "Apr 7", "total": 45, "completed": 40 }
    ]
  }
}
```

---

### Document Endpoints

#### Upload Document
```http
POST /documents/upload/{consultationId}
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- document: (file) prescription.pdf
- documentType: "prescription"

Response: {
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "document": {
      "fileName": "prescription-1234567890.pdf",
      "fileUrl": "/uploads/prescription-1234567890.pdf"
    }
  }
}
```

#### Download Document
```http
GET /documents/download/{documentId}
Authorization: Bearer {token}

Response: File download
```

---

### Complete API Endpoint List

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | User login |
| GET | `/auth/me` | Yes | Get current user |
| POST | `/auth/logout` | Yes | Logout user |
| GET | `/queue/departments` | No | Get all departments |
| GET | `/queue/status/:deptId` | No | Get department queue status |
| POST | `/queue/join` | Yes | Join queue |
| GET | `/queue/my-status` | Yes | Get my queue position |
| DELETE | `/queue/leave` | Yes | Leave queue |
| GET | `/queue/history` | Yes | Get consultation history |
| POST | `/queue/call-next` | Staff | Call next patient |
| POST | `/queue/complete/:id` | Staff | Complete consultation |
| GET | `/analytics/stats` | Staff | Overall statistics |
| GET | `/analytics/daily-flow` | Staff | 7-day patient flow |
| GET | `/analytics/department-stats` | Staff | Department comparison |
| GET | `/analytics/hourly-distribution` | Staff | Peak hours data |
| GET | `/analytics/priority-distribution` | Staff | Priority breakdown |
| GET | `/analytics/wait-time-trends` | Staff | Wait time trends |
| POST | `/documents/upload/:consultationId` | Yes | Upload document |
| GET | `/documents/:consultationId` | Yes | Get consultation documents |
| GET | `/documents/download/:docId` | Yes | Download document |
| DELETE | `/documents/:docId` | Yes | Delete document |

---

## 📸 Screenshots

### Patient Interface

#### Login Dashboard
![Login Dashboard](https://github.com/02AbhishekJP/hospital_queue_management/blob/main/images/login_dashboard.png)
*Clean registration form with validation*

#### Patient Dashboard
![Patient Dashboard](https://github.com/02AbhishekJP/hospital_queue_management/blob/main/images/user%20home%20page.png)
*Quick actions: Book Appointment, Join Queue, Check Status, History, Settings*

#### Join Queue
![Join Queue](https://github.com/02AbhishekJP/hospital_queue_management/blob/main/images/user%20joining%20queue%20page.png)
*Select department and priority level*

#### Queue Status
![Queue Status](https://github.com/02AbhishekJP/hospital_queue_management/blob/main/images/queue%20status%20page.png)
*Real-time position tracking with auto-refresh*

#### Treatment History
![Treatment History](https://github.com/02AbhishekJP/hospital_queue_management/blob/main/images/user%20treatment%20history.png)
*Past consultations with document upload/download*

---

### Staff Interface

#### Staff Dashboard
![Staff Dashboard](https://github.com/02AbhishekJP/hospital_queue_management/blob/main/images/staff%20dashboard%20page.png)
*Queue management with call next patient feature*

#### Analytics Dashboard
![Analytics Dashboard](https://github.com/02AbhishekJP/hospital_queue_management/blob/main/images/Analytics%20dashboard%20page%20at%20staff.png)
*6 interactive charts with real-time data*

---

## 🎯 Performance

### Optimizations Implemented

- ✅ **Database Indexing**
```javascript
  queueSchema.index({ departmentId: 1, date: 1, status: 1 });
  queueSchema.index({ patientId: 1, date: 1 });
```

- ✅ **Query Optimization**
  - Limited results: `.limit(50)`
  - Selective field population
  - Compound indexes for frequent queries

- ✅ **Real-time Efficiency**
  - Socket.IO rooms (department-wise broadcasting)
  - Prevents unnecessary updates to all clients

- ✅ **File Upload**
  - File size limit: 10MB
  - File type validation
  - Efficient storage structure

- ✅ **Frontend Performance**
  - Component lazy loading
  - Minimal re-renders
  - Efficient state management

### Performance Metrics

| Operation | Response Time | Notes |
|-----------|---------------|-------|
| User Login | < 500ms | Including JWT generation |
| Join Queue | < 300ms | Including SMS trigger |
| Get Queue Status | < 100ms | With indexing |
| Call Next Patient | < 200ms | With Socket.IO broadcast |
| Analytics Load | < 1s | 7 days of data, 6 charts |
| File Upload | < 2s | 5MB file |
| Real-time Update | < 50ms | Socket.IO latency |

---

## 🔐 Security

### Implemented Security Measures

#### Authentication & Authorization
- ✅ **JWT Tokens** - Secure, stateless authentication
- ✅ **bcrypt Hashing** - Password encryption (10 salt rounds)
- ✅ **Role-Based Access Control (RBAC)** - 4 user roles
  - Patient (default)
  - Staff
  - Doctor
  - Admin

#### Input Validation
- ✅ Email format validation
- ✅ Phone number format (10 digits)
- ✅ Password strength requirements
- ✅ File type validation (PDF, JPG, PNG only)
- ✅ File size limits (10MB max)

#### API Security
- ✅ CORS configuration
- ✅ Protected routes (JWT middleware)
- ✅ Request validation
- ✅ Error handling (no sensitive data leakage)

#### Data Protection
- ✅ Environment variables for secrets
- ✅ MongoDB injection prevention
- ✅ XSS protection
- ✅ HTTPS ready (production)

### Security Best Practices

```javascript
// Example: Password hashing
const hashedPassword = await bcrypt.hash(password, 10);

// Example: JWT verification
const decoded = jwt.verify(token, process.env.JWT_SECRET);

// Example: Role authorization
authorize('staff', 'doctor', 'admin')
```

---

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['patient', 'staff', 'doctor', 'admin']),
  firstName: String,
  lastName: String,
  phoneNumber: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Patients Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  patientId: String (unique, e.g., PAT-000001),
  dateOfBirth: Date,
  gender: String,
  bloodGroup: String,
  address: String,
  emergencyContact: String,
  medicalHistory: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Queues Collection
```javascript
{
  _id: ObjectId,
  queueNumber: Number,
  tokenNumber: String (e.g., CARDIO-001),
  patientId: ObjectId (ref: Patient),
  departmentId: ObjectId (ref: Department),
  date: Date,
  queuePosition: Number,
  estimatedWaitTime: Number,
  actualWaitTime: Number,
  priority: String (enum: ['normal', 'senior-citizen', 'pregnant', 'emergency']),
  status: String (enum: ['waiting', 'called', 'in-consultation', 'completed', 'cancelled']),
  checkInTime: Date,
  calledTime: Date,
  consultationStartTime: Date,
  consultationEndTime: Date,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Departments Collection
```javascript
{
  _id: ObjectId,
  name: String,
  code: String (e.g., CARDIO),
  description: String,
  floor: Number,
  isEmergency: Boolean,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### ConsultationDocuments Collection
```javascript
{
  _id: ObjectId,
  consultationId: ObjectId (ref: Queue),
  patientId: ObjectId (ref: Patient),
  documentType: String (enum: ['prescription', 'bill', 'lab-report', 'other']),
  fileName: String,
  originalFileName: String,
  fileSize: Number,
  mimeType: String,
  fileUrl: String,
  uploadedBy: ObjectId (ref: User),
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Future Enhancements

### Phase 1: Core Features
- [ ] **Video Consultation** - WebRTC integration for telemedicine
- [ ] **Digital Prescription** - E-prescription generation
- [ ] **Payment Integration** - Razorpay/Stripe for online payments
- [ ] **Insurance Integration** - Claim verification

### Phase 2: Advanced Features
- [ ] **Multi-Hospital Network** - Support multiple hospitals
- [ ] **AI Chatbot** - 24/7 patient support (Dialogflow)
- [ ] **Predictive Analytics** - ML-based wait time prediction
- [ ] **Health Records (EHR)** - Complete medical history

### Phase 3: Expansion
- [ ] **Mobile Apps** - React Native (iOS & Android)
- [ ] **Multi-Language Support** - Hindi, Regional languages
- [ ] **Voice Commands** - Alexa/Google Assistant integration
- [ ] **Wearable Integration** - Apple Watch, Fitbit

### Phase 4: Enterprise
- [ ] **Lab Integration** - Direct lab report delivery
- [ ] **Pharmacy Integration** - Medicine delivery
- [ ] **Ambulance Tracking** - GPS-based tracking
- [ ] **Bed Management** - Real-time bed availability

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**!

### How to Contribute

1. **Fork the Project**
```bash
   Click "Fork" button on GitHub
```

2. **Clone Your Fork**
```bash
   git clone https://github.com/YOUR_USERNAME/hospital-queue-management-system.git
```

3. **Create Feature Branch**
```bash
   git checkout -b feature/AmazingFeature
```

4. **Make Your Changes**
   - Write clean, documented code
   - Follow existing code style
   - Add comments where necessary

5. **Commit Changes**
```bash
   git commit -m "Add: AmazingFeature - brief description"
```

6. **Push to Branch**
```bash
   git push origin feature/AmazingFeature
```

7. **Open Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Provide clear description of changes

### Contribution Guidelines

- ✅ Follow existing code structure
- ✅ Write meaningful commit messages
- ✅ Update documentation if needed
- ✅ Test your changes thoroughly
- ✅ One feature per pull request
- ✅ Be respectful and constructive

### Code of Conduct

Please be respectful, inclusive, and professional. We aim to create a welcoming environment for all contributors.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` file for more information.

```
MIT License

Copyright (c) 2026 Abhishek JP

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Contact

**Abhishek JP**

- 📧 Email: your.email@example.com
- 💼 LinkedIn: [linkedin.com/in/abhishekjp](https://linkedin.com/in/abhishekjp)
- 🐙 GitHub: [@02AbhishekJP](https://github.com/02AbhishekJP)
- 🌐 Portfolio: [yourportfolio.com](https://yourportfolio.com)

**Project Link:** [https://github.com/02AbhishekJP/hospital-queue-management-system](https://github.com/02AbhishekJP/hospital-queue-management-system)

---

## 🙏 Acknowledgments

Special thanks to:

- **MongoDB** - For the flexible NoSQL database
- **Express.js** - For the robust web framework
- **React.js** - For the powerful UI library
- **Node.js** - For the JavaScript runtime
- **Socket.IO** - For real-time capabilities
- **Chart.js** - For beautiful visualizations
- **Twilio** - For SMS integration
- **Multer** - For file upload handling
- **Open Source Community** - For amazing libraries and tools

---

## 📈 Project Stats

![GitHub stars](https://img.shields.io/github/stars/02AbhishekJP/hospital-queue-management-system?style=social)
![GitHub forks](https://img.shields.io/github/forks/02AbhishekJP/hospital-queue-management-system?style=social)
![GitHub issues](https://img.shields.io/github/issues/02AbhishekJP/hospital-queue-management-system)
![GitHub pull requests](https://img.shields.io/github/issues-pr/02AbhishekJP/hospital-queue-management-system)
![GitHub last commit](https://img.shields.io/github/last-commit/02AbhishekJP/hospital-queue-management-system)
![GitHub repo size](https://img.shields.io/github/repo-size/02AbhishekJP/hospital-queue-management-system)

---

<div align="center">

### ⭐ Star this repository if you find it helpful! ⭐

**Built with ❤️ by Abhishek JP**

[⬆ Back to Top](#-hospital-queue-management-system)

</div>
