const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Hospital Queue Management System API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodbConnected: mongoose.connection.readyState === 1
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is working perfectly!',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Basic departments endpoint (for testing)
app.get('/api/departments', (req, res) => {
  res.json({
    success: true,
    data: [
      { _id: '1', name: 'Cardiology', code: 'CARDIO' },
      { _id: '2', name: 'Orthopedics', code: 'ORTHO' },
      { _id: '3', name: 'Pediatrics', code: 'PEDIA' }
    ]
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

app.set('io', io);
// Import routes
// Import routes
const authRoutes = require('./src/routes/auth.routes');
const queueRoutes = require('./src/routes/queue.routes');
const documentRoutes = require('./src/routes/document.routes');
const analyticsRoutes = require('./src/routes/analytics.routes');

// Use routes
// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Serve uploaded files
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital-queue';
    
    await mongoose.connect(mongoURI);
    
    console.log('✅ MongoDB connected successfully');
    console.log('📦 Database: hospital-queue');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('');
    console.error('💡 Troubleshooting:');
    console.error('   1. Make sure MongoDB service is running');
    console.error('   2. Run: net start MongoDB');
    console.error('');
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    httpServer.listen(PORT, () => {
      console.log('');
      console.log('═══════════════════════════════════════════');
      console.log('🏥 Hospital Queue Management System');
      console.log('═══════════════════════════════════════════');
      console.log('🚀 Server running on port ' + PORT);
      console.log('🌐 Environment: ' + (process.env.NODE_ENV || 'development'));
      console.log('📡 Health Check: http://localhost:' + PORT + '/health');
      console.log('🔌 Test API: http://localhost:' + PORT + '/api/test');
      console.log('═══════════════════════════════════════════');
      console.log('');
      console.log('✅ Backend is ready!');
      console.log('💡 Press Ctrl+C to stop the server');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = { app, io };