const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
  queueNumber: {
    type: Number,
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    default: null
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    default: null
  },
  date: {
    type: Date,
    required: true,
    default: () => new Date().setHours(0, 0, 0, 0)
  },
  tokenNumber: {
    type: String,
    required: true
  },
  checkInTime: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['waiting', 'called', 'in-consultation', 'completed', 'cancelled'],
    default: 'waiting'
  },
  queuePosition: {
    type: Number,
    required: true
  },
  estimatedWaitTime: {
    type: Number,
    default: 0
  },
  actualWaitTime: {
    type: Number,
    default: null
  },
  priority: {
    type: String,
    enum: ['normal', 'senior-citizen', 'emergency', 'pregnant'],
    default: 'normal'
  },
  calledTime: {
    type: Date,
    default: null
  },
  consultationStartTime: {
    type: Date,
    default: null
  },
  consultationEndTime: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
queueSchema.index({ date: 1, departmentId: 1, status: 1 });
queueSchema.index({ patientId: 1, date: 1 });
queueSchema.index({ queuePosition: 1 });
queueSchema.index({ tokenNumber: 1, date: 1 });

// Pre-save middleware to calculate actual wait time
queueSchema.pre('save', function(next) {
  if (this.consultationStartTime && this.checkInTime && !this.actualWaitTime) {
    const waitTimeMs = this.consultationStartTime - this.checkInTime;
    this.actualWaitTime = Math.round(waitTimeMs / (1000 * 60));
  }
  next();
});

// Method to calculate priority weight for sorting
queueSchema.methods.getPriorityWeight = function() {
  const weights = {
    'emergency': 1,
    'pregnant': 2,
    'senior-citizen': 3,
    'normal': 4
  };
  return weights[this.priority] || 4;
};

// Static method to get next queue number for a department
queueSchema.statics.getNextQueueNumber = async function(departmentId, date) {
  const startOfDay = new Date(date).setHours(0, 0, 0, 0);
  const endOfDay = new Date(date).setHours(23, 59, 59, 999);
  
  const lastQueue = await this.findOne({
    departmentId,
    date: { $gte: startOfDay, $lte: endOfDay }
  }).sort({ queueNumber: -1 });
  
  return lastQueue ? lastQueue.queueNumber + 1 : 1;
};

// Static method to generate token number
queueSchema.statics.generateTokenNumber = function(departmentCode, queueNumber) {
  const paddedNumber = String(queueNumber).padStart(3, '0');
  return `${departmentCode}-${paddedNumber}`;
};

// Static method to get queue statistics
queueSchema.statics.getQueueStats = async function(departmentId, date) {
  const startOfDay = new Date(date).setHours(0, 0, 0, 0);
  const endOfDay = new Date(date).setHours(23, 59, 59, 999);
  
  const stats = await this.aggregate([
    {
      $match: {
        departmentId: mongoose.Types.ObjectId(departmentId),
        date: { $gte: new Date(startOfDay), $lte: new Date(endOfDay) }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgWaitTime: { $avg: '$actualWaitTime' }
      }
    }
  ]);
  
  return stats;
};

const Queue = mongoose.model('Queue', queueSchema);

module.exports = Queue;