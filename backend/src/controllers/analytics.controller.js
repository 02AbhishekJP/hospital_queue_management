const Queue = require('../models/Queue');
const Department = require('../models/Department');
const Patient = require('../models/Patient');

/**
 * @desc    Get overall statistics
 * @route   GET /api/analytics/stats
 * @access  Private (Staff/Admin)
 */
exports.getOverallStats = async (req, res) => {
  try {
    const today = new Date().setHours(0, 0, 0, 0);
    const thisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    // Today's stats
    const todayQueues = await Queue.find({ date: today });
    const todayCompleted = todayQueues.filter(q => q.status === 'completed');
    const todayWaiting = todayQueues.filter(q => q.status === 'waiting');

    // Month stats
    const monthQueues = await Queue.find({ 
      date: { $gte: thisMonth } 
    });

    // Calculate average wait time
    const completedWithWaitTime = todayCompleted.filter(q => q.actualWaitTime);
    const avgWaitTime = completedWithWaitTime.length > 0
      ? Math.round(completedWithWaitTime.reduce((sum, q) => sum + q.actualWaitTime, 0) / completedWithWaitTime.length)
      : 0;

    // Total patients
    const totalPatients = await Patient.countDocuments();

    // Active departments
    const activeDepartments = await Department.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: {
        today: {
          total: todayQueues.length,
          completed: todayCompleted.length,
          waiting: todayWaiting.length,
          avgWaitTime
        },
        thisMonth: {
          total: monthQueues.length,
          completed: monthQueues.filter(q => q.status === 'completed').length
        },
        overall: {
          totalPatients,
          activeDepartments
        }
      }
    });
  } catch (error) {
    console.error('Get overall stats error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch statistics' }
    });
  }
};

/**
 * @desc    Get daily patient flow (last 7 days)
 * @route   GET /api/analytics/daily-flow
 * @access  Private (Staff/Admin)
 */
exports.getDailyFlow = async (req, res) => {
  try {
    const days = 7;
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date).setHours(0, 0, 0, 0);
      const dayEnd = new Date(date).setHours(23, 59, 59, 999);

      const queues = await Queue.find({
        date: { $gte: dayStart, $lte: dayEnd }
      });

      data.push({
        date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        total: queues.length,
        completed: queues.filter(q => q.status === 'completed').length,
        cancelled: queues.filter(q => q.status === 'cancelled').length
      });
    }

    res.json({
      success: true,
      data: { dailyFlow: data }
    });
  } catch (error) {
    console.error('Get daily flow error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch daily flow data' }
    });
  }
};

/**
 * @desc    Get department-wise statistics
 * @route   GET /api/analytics/department-stats
 * @access  Private (Staff/Admin)
 */
exports.getDepartmentStats = async (req, res) => {
  try {
    const today = new Date().setHours(0, 0, 0, 0);
    const departments = await Department.find({ isActive: true });

    const stats = await Promise.all(departments.map(async (dept) => {
      const queues = await Queue.find({
        departmentId: dept._id,
        date: today
      });

      const completed = queues.filter(q => q.status === 'completed');
      const avgWaitTime = completed.length > 0
        ? Math.round(completed.reduce((sum, q) => sum + (q.actualWaitTime || 0), 0) / completed.length)
        : 0;

      return {
        name: dept.name,
        code: dept.code,
        total: queues.length,
        completed: completed.length,
        waiting: queues.filter(q => q.status === 'waiting').length,
        avgWaitTime
      };
    }));

    res.json({
      success: true,
      data: { departments: stats }
    });
  } catch (error) {
    console.error('Get department stats error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch department statistics' }
    });
  }
};

/**
 * @desc    Get hourly distribution (peak hours)
 * @route   GET /api/analytics/hourly-distribution
 * @access  Private (Staff/Admin)
 */
exports.getHourlyDistribution = async (req, res) => {
  try {
    const today = new Date().setHours(0, 0, 0, 0);
    const todayEnd = new Date().setHours(23, 59, 59, 999);

    const queues = await Queue.find({
      date: { $gte: today, $lte: todayEnd }
    });

    // Group by hour
    const hourlyData = Array(24).fill(0);
    queues.forEach(q => {
      const hour = new Date(q.checkInTime).getHours();
      hourlyData[hour]++;
    });

    const formattedData = hourlyData.map((count, hour) => ({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      count
    }));

    res.json({
      success: true,
      data: { hourlyDistribution: formattedData }
    });
  } catch (error) {
    console.error('Get hourly distribution error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch hourly distribution' }
    });
  }
};

/**
 * @desc    Get priority distribution
 * @route   GET /api/analytics/priority-distribution
 * @access  Private (Staff/Admin)
 */
exports.getPriorityDistribution = async (req, res) => {
  try {
    const today = new Date().setHours(0, 0, 0, 0);
    const todayEnd = new Date().setHours(23, 59, 59, 999);

    const queues = await Queue.find({
      date: { $gte: today, $lte: todayEnd }
    });

    const distribution = {
      normal: 0,
      'senior-citizen': 0,
      pregnant: 0,
      emergency: 0
    };

    queues.forEach(q => {
      distribution[q.priority]++;
    });

    const data = Object.keys(distribution).map(key => ({
      priority: key.replace('-', ' ').toUpperCase(),
      count: distribution[key]
    }));

    res.json({
      success: true,
      data: { priorityDistribution: data }
    });
  } catch (error) {
    console.error('Get priority distribution error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch priority distribution' }
    });
  }
};

/**
 * @desc    Get wait time trends (last 7 days)
 * @route   GET /api/analytics/wait-time-trends
 * @access  Private (Staff/Admin)
 */
exports.getWaitTimeTrends = async (req, res) => {
  try {
    const days = 7;
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date).setHours(0, 0, 0, 0);
      const dayEnd = new Date(date).setHours(23, 59, 59, 999);

      const completed = await Queue.find({
        date: { $gte: dayStart, $lte: dayEnd },
        status: 'completed',
        actualWaitTime: { $exists: true, $ne: null }
      });

      const avgWaitTime = completed.length > 0
        ? Math.round(completed.reduce((sum, q) => sum + q.actualWaitTime, 0) / completed.length)
        : 0;

      data.push({
        date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        avgWaitTime
      });
    }

    res.json({
      success: true,
      data: { waitTimeTrends: data }
    });
  } catch (error) {
    console.error('Get wait time trends error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch wait time trends' }
    });
  }
};