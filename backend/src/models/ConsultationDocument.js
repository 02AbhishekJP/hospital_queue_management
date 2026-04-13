const mongoose = require('mongoose');

const consultationDocumentSchema = new mongoose.Schema({
  consultationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Queue',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  documentType: {
    type: String,
    enum: ['prescription', 'bill', 'lab-report', 'other'],
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  originalFileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes
consultationDocumentSchema.index({ consultationId: 1 });
consultationDocumentSchema.index({ patientId: 1 });
consultationDocumentSchema.index({ documentType: 1 });

const ConsultationDocument = mongoose.model('ConsultationDocument', consultationDocumentSchema);

module.exports = ConsultationDocument;