import { io } from 'socket.io-client';

let socket = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io('http://localhost:5000', {
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }
  return socket;
};

export const connectSocket = () => {
  if (socket && !socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};

export const joinDepartment = (departmentId) => {
  if (socket && socket.connected) {
    socket.emit('join-department', departmentId);
  }
};

export const leaveDepartment = (departmentId) => {
  if (socket && socket.connected) {
    socket.emit('leave-department', departmentId);
  }
};

export const joinPatient = (patientId) => {
  if (socket && socket.connected) {
    socket.emit('join-patient', patientId);
  }
};

export const leavePatient = (patientId) => {
  if (socket && socket.connected) {
    socket.emit('leave-patient', patientId);
  }
};

export const onQueueUpdate = (callback) => {
  if (socket) {
    socket.on('queue:updated', callback);
  }
};

export const onPatientCalled = (callback) => {
  if (socket) {
    socket.on('patient:called', callback);
  }
};

export const onConsultationCompleted = (callback) => {
  if (socket) {
    socket.on('consultation:completed', callback);
  }
};

export const offQueueUpdate = () => {
  if (socket) {
    socket.off('queue:updated');
  }
};

export const offPatientCalled = () => {
  if (socket) {
    socket.off('patient:called');
  }
};

export const offConsultationCompleted = () => {
  if (socket) {
    socket.off('consultation:completed');
  }
};

export const getSocket = () => socket;

export default {
  initializeSocket,
  connectSocket,
  disconnectSocket,
  joinDepartment,
  leaveDepartment,
  joinPatient,
  leavePatient,
  onQueueUpdate,
  onPatientCalled,
  onConsultationCompleted,
  offQueueUpdate,
  offPatientCalled,
  offConsultationCompleted,
  getSocket
};