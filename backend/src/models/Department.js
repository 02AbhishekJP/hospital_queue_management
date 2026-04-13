const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Department name is required'],
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Department code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String
  },
  floor: {
    type: Number
  },
  headDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  totalBeds: {
    type: Number,
    default: 0
  },
  availableBeds: {
    type: Number,
    default: 0
  },
  operatingHours: {
    openTime: {
      type: String,
      default: '08:00'
    },
    closeTime: {
      type: String,
      default: '20:00'
    }
  },
  isEmergency: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
departmentSchema.index({ code: 1 });
departmentSchema.index({ isActive: 1 });

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;