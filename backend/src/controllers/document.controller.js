const ConsultationDocument = require('../models/ConsultationDocument');
const Queue = require('../models/Queue');
const path = require('path');
const fs = require('fs');

/**
 * @desc    Upload document
 * @route   POST /api/documents/upload/:consultationId
 * @access  Private (Patient)
 */
exports.uploadDocument = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const { documentType, description } = req.body;
    const patientId = req.patient?._id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { message: 'Please upload a file' }
      });
    }

    // Verify consultation belongs to patient
    const consultation = await Queue.findById(consultationId);
    
    if (!consultation) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        error: { message: 'Consultation not found' }
      });
    }

    if (consultation.patientId.toString() !== patientId.toString()) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(403).json({
        success: false,
        error: { message: 'Not authorized to upload documents for this consultation' }
      });
    }

    // Create document record
    const document = await ConsultationDocument.create({
      consultationId,
      patientId,
      documentType: documentType || 'other',
      fileName: req.file.filename,
      originalFileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      fileUrl: `/uploads/${req.file.filename}`,
      uploadedBy: req.user._id,
      description: description || ''
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: { document }
    });
  } catch (error) {
    console.error('Upload document error:', error);
    
    // Delete uploaded file on error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      error: { message: 'Failed to upload document' }
    });
  }
};

/**
 * @desc    Get documents for a consultation
 * @route   GET /api/documents/:consultationId
 * @access  Private (Patient)
 */
exports.getConsultationDocuments = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const patientId = req.patient?._id;

    // Verify consultation belongs to patient
    const consultation = await Queue.findById(consultationId);
    
    if (!consultation) {
      return res.status(404).json({
        success: false,
        error: { message: 'Consultation not found' }
      });
    }

    if (consultation.patientId.toString() !== patientId.toString()) {
      return res.status(403).json({
        success: false,
        error: { message: 'Not authorized to view these documents' }
      });
    }

    const documents = await ConsultationDocument.find({ consultationId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { documents }
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch documents' }
    });
  }
};

/**
 * @desc    Download document
 * @route   GET /api/documents/download/:documentId
 * @access  Private (Patient)
 */
exports.downloadDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const patientId = req.patient?._id;

    const document = await ConsultationDocument.findById(documentId);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        error: { message: 'Document not found' }
      });
    }

    if (document.patientId.toString() !== patientId.toString()) {
      return res.status(403).json({
        success: false,
        error: { message: 'Not authorized to download this document' }
      });
    }

    const filePath = path.join(__dirname, '../../uploads', document.fileName);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: { message: 'File not found on server' }
      });
    }

    res.download(filePath, document.originalFileName);
  } catch (error) {
    console.error('Download document error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to download document' }
    });
  }
};

/**
 * @desc    Delete document
 * @route   DELETE /api/documents/:documentId
 * @access  Private (Patient)
 */
exports.deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const patientId = req.patient?._id;

    const document = await ConsultationDocument.findById(documentId);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        error: { message: 'Document not found' }
      });
    }

    if (document.patientId.toString() !== patientId.toString()) {
      return res.status(403).json({
        success: false,
        error: { message: 'Not authorized to delete this document' }
      });
    }

    // Delete file from disk
    const filePath = path.join(__dirname, '../../uploads', document.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete document record
    await ConsultationDocument.findByIdAndDelete(documentId);

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to delete document' }
    });
  }
};