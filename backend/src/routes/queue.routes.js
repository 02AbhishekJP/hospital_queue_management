const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queue.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Public routes
router.get('/status/:departmentId', queueController.getQueueStatus);
router.get('/departments', queueController.getDepartments);

// Protected routes (require login)
router.post('/join', protect, queueController.joinQueue);
router.get('/my-status', protect, queueController.getMyQueueStatus);
router.delete('/leave', protect, queueController.leaveQueue);
router.get('/history', protect, queueController.getPatientHistory);

// Staff/Doctor routes
router.post('/call-next', protect, authorize('staff', 'doctor', 'admin'), queueController.callNextPatient);
router.post('/complete/:queueId', protect, authorize('staff', 'doctor', 'admin'), queueController.completeConsultation);

module.exports = router;