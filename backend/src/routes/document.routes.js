const express = require('express');
const router = express.Router();
const documentController = require('../controllers/document.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// All routes require authentication
router.post('/upload/:consultationId', protect, upload.single('document'), documentController.uploadDocument);
router.get('/:consultationId', protect, documentController.getConsultationDocuments);
router.get('/download/:documentId', protect, documentController.downloadDocument);
router.delete('/:documentId', protect, documentController.deleteDocument);

module.exports = router;