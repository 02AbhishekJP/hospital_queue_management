const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  patientId: {
    type: String,
    required: true,
    unique: true
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
    default: 'Unknown'
  },
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    notes: String
  }],
  allergies: [String],
  currentMedications: [{
    name: String,
    dosage: String,
    frequency: String
  }],
  emergencyContact: {
    name: String,
    relationship: String,
    phoneNumber: String
  },
  insuranceDetails: {
    provider: String,
    policyNumber: String,
    validUntil: Date
  }
}, {
  timestamps: true
});

// Index for faster lookups
patientSchema.index({ userId: 1 });
patientSchema.index({ patientId: 1 });

// Method to generate patient ID
patientSchema.statics.generatePatientId = async function() {
  const count = await this.countDocuments();
  return `PAT-${String(count + 1).padStart(6, '0')}`;
};

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;