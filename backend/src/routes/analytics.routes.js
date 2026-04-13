const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// All routes require staff/admin access
router.get('/stats', protect, authorize('staff', 'doctor', 'admin'), analyticsController.getOverallStats);
router.get('/daily-flow', protect, authorize('staff', 'doctor', 'admin'), analyticsController.getDailyFlow);
router.get('/department-stats', protect, authorize('staff', 'doctor', 'admin'), analyticsController.getDepartmentStats);
router.get('/hourly-distribution', protect, authorize('staff', 'doctor', 'admin'), analyticsController.getHourlyDistribution);
router.get('/priority-distribution', protect, authorize('staff', 'doctor', 'admin'), analyticsController.getPriorityDistribution);
router.get('/wait-time-trends', protect, authorize('staff', 'doctor', 'admin'), analyticsController.getWaitTimeTrends);

module.exports = router;