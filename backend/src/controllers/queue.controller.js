const Queue = require('../models/Queue');
const Department = require('../models/Department');
const Patient = require('../models/Patient');

/**
 * Join queue
 */
exports.joinQueue = async (req, res) => {
  try {
    const { departmentId, priority } = req.body;
    const patientId = req.patient?._id;

    if (!departmentId || !patientId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Department and patient information required' }
      });
    }

    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({
        success: false,
        error: { message: 'Department not found' }
      });
    }

    const today = new Date().setHours(0, 0, 0, 0);
    const existingQueue = await Queue.findOne({
      patientId,
      departmentId,
      date: today,
      status: { $in: ['waiting', 'called', 'in-consultation'] }
    });

    if (existingQueue) {
      return res.status(400).json({
        success: false,
        error: { message: 'You are already in the queue for this department today' }
      });
    }

    const queueNumber = await Queue.getNextQueueNumber(departmentId, new Date());
    const tokenNumber = Queue.generateTokenNumber(department.code, queueNumber);

    const waitingQueues = await Queue.find({
      departmentId,
      date: today,
      status: 'waiting'
    }).sort({ queuePosition: 1 });

    let queuePosition = waitingQueues.length + 1;

    if (priority && priority !== 'normal') {
      const priorityQueue = new Queue({ priority });
      const priorityWeight = priorityQueue.getPriorityWeight();
      
      for (let i = 0; i < waitingQueues.length; i++) {
        const existingQueue = new Queue({ priority: waitingQueues[i].priority });
        const existingWeight = existingQueue.getPriorityWeight();
        
        if (priorityWeight < existingWeight) {
          queuePosition = waitingQueues[i].queuePosition;
          await Queue.updateMany(
            {
              departmentId,
              date: today,
              status: 'waiting',
              queuePosition: { $gte: queuePosition }
            },
            { $inc: { queuePosition: 1, estimatedWaitTime: 30 } }
          );
          break;
        }
      }
    }

    const estimatedWaitTime = (queuePosition - 1) * 30;

    const queue = await Queue.create({
      queueNumber,
      tokenNumber,
      patientId,
      departmentId,
      date: today,
      queuePosition,
      estimatedWaitTime,
      priority: priority || 'normal',
      status: 'waiting'
    });

    await queue.populate([
      { path: 'patientId', select: 'userId patientId' },
      { path: 'departmentId', select: 'name code' }
    ]);

    const patient = await Patient.findById(patientId).populate('userId', 'firstName lastName');

    const io = req.app.get('io');
    if (io) {
      io.to(`department-${departmentId}`).emit('queue:updated', {
        action: 'joined',
        queue: queue,
        totalWaiting: queuePosition,
        patientName: patient?.userId ? `${patient.userId.firstName} ${patient.userId.lastName}` : 'Patient'
      });
    }

    res.status(201).json({
      success: true,
      message: `Token ${tokenNumber} assigned successfully!`,
      data: {
        queue: {
          _id: queue._id,
          tokenNumber: queue.tokenNumber,
          queuePosition: queue.queuePosition,
          estimatedWaitTime: queue.estimatedWaitTime,
          priority: queue.priority,
          status: queue.status,
          checkInTime: queue.checkInTime,
          department: {
            name: department.name,
            code: department.code
          }
        }
      }
    });
  } catch (error) {
    console.error('Join queue error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to join queue. Please try again.' }
    });
  }
};

/**
 * Get my queue status
 */
exports.getMyQueueStatus = async (req, res) => {
  try {
    const patientId = req.patient?._id;
    const today = new Date().setHours(0, 0, 0, 0);

    const myQueue = await Queue.findOne({
      patientId,
      date: today,
      status: { $in: ['waiting', 'called', 'in-consultation'] }
    })
      .populate('departmentId', 'name code');

    if (!myQueue) {
      return res.json({
        success: true,
        data: {
          inQueue: false,
          message: 'You are not in any queue today'
        }
      });
    }

    const patientsBefore = await Queue.countDocuments({
      departmentId: myQueue.departmentId,
      date: today,
      status: 'waiting',
      queuePosition: { $lt: myQueue.queuePosition }
    });

    const currentEstimate = patientsBefore * 30;
    if (currentEstimate !== myQueue.estimatedWaitTime) {
      myQueue.estimatedWaitTime = currentEstimate;
      await myQueue.save();
    }

    res.json({
      success: true,
      data: {
        inQueue: true,
        queue: {
          _id: myQueue._id,
          tokenNumber: myQueue.tokenNumber,
          queuePosition: myQueue.queuePosition,
          status: myQueue.status,
          estimatedWaitTime: myQueue.estimatedWaitTime,
          checkInTime: myQueue.checkInTime,
          priority: myQueue.priority,
          department: myQueue.departmentId
        },
        patientsBefore,
        estimatedTimeMinutes: currentEstimate
      }
    });
  } catch (error) {
    console.error('Get my queue status error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch queue status' }
    });
  }
};

/**
 * Get queue status for department
 */
exports.getQueueStatus = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const today = new Date().setHours(0, 0, 0, 0);

    const queues = await Queue.find({
      departmentId,
      date: today,
      status: { $in: ['waiting', 'called', 'in-consultation'] }
    })
      .populate('patientId', 'patientId')
      .sort({ queuePosition: 1 })
      .limit(50);

    const stats = {
      totalWaiting: queues.filter(q => q.status === 'waiting').length,
      currentlyServing: queues.find(q => q.status === 'in-consultation')?.tokenNumber || 'None',
      lastCalled: queues.find(q => q.status === 'called')?.tokenNumber || 'None',
      averageWaitTime: 0
    };

    const completed = await Queue.find({
      departmentId,
      date: today,
      status: 'completed',
      actualWaitTime: { $exists: true, $ne: null }
    });

    if (completed.length > 0) {
      const totalWaitTime = completed.reduce((sum, q) => sum + q.actualWaitTime, 0);
      stats.averageWaitTime = Math.round(totalWaitTime / completed.length);
    }

    res.json({
      success: true,
      data: {
        queues: queues.map(q => ({
          _id: q._id,
          tokenNumber: q.tokenNumber,
          queuePosition: q.queuePosition,
          status: q.status,
          priority: q.priority,
          checkInTime: q.checkInTime
        })),
        stats
      }
    });
  } catch (error) {
    console.error('Get queue status error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch queue status' }
    });
  }
};

/**
 * Leave queue
 */
exports.leaveQueue = async (req, res) => {
  try {
    const patientId = req.patient?._id;
    const today = new Date().setHours(0, 0, 0, 0);

    const queue = await Queue.findOne({
      patientId,
      date: today,
      status: { $in: ['waiting', 'called'] }
    });

    if (!queue) {
      return res.status(404).json({
        success: false,
        error: { message: 'No active queue entry found' }
      });
    }

    const oldPosition = queue.queuePosition;
    const departmentId = queue.departmentId;

    queue.status = 'cancelled';
    await queue.save();

    await Queue.updateMany(
      {
        departmentId,
        date: today,
        status: 'waiting',
        queuePosition: { $gt: oldPosition }
      },
      { 
        $inc: { queuePosition: -1, estimatedWaitTime: -30 } 
      }
    );

    const io = req.app.get('io');
    if (io) {
      io.to(`department-${departmentId}`).emit('queue:updated', {
        action: 'left',
        tokenNumber: queue.tokenNumber
      });
    }

    res.json({
      success: true,
      message: 'You have left the queue successfully'
    });
  } catch (error) {
    console.error('Leave queue error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to leave queue' }
    });
  }
};

/**
 * Get all departments
 */
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true })
      .select('name code description floor isEmergency')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: { departments }
    });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch departments' }
    });
  }
};

/**
 * Call next patient
 */
exports.callNextPatient = async (req, res) => {
  try {
    const { departmentId } = req.body;
    
    if (!departmentId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Department ID is required' }
      });
    }

    const today = new Date().setHours(0, 0, 0, 0);

    const nextPatient = await Queue.findOne({
      departmentId,
      date: today,
      status: 'waiting'
    })
      .sort({ queuePosition: 1 })
      .populate('patientId', 'patientId userId')
      .populate('departmentId', 'name code');

    if (!nextPatient) {
      return res.status(404).json({
        success: false,
        error: { message: 'No patients waiting in queue' }
      });
    }

    nextPatient.status = 'called';
    nextPatient.calledTime = new Date();
    await nextPatient.save();

    const patient = await Patient.findById(nextPatient.patientId).populate('userId', 'firstName lastName');

    const io = req.app.get('io');
    if (io) {
      io.to(`department-${departmentId}`).emit('queue:updated', {
        action: 'called',
        queue: nextPatient,
        tokenNumber: nextPatient.tokenNumber
      });

      if (nextPatient.patientId) {
        io.to(`patient-${nextPatient.patientId}`).emit('patient:called', {
          tokenNumber: nextPatient.tokenNumber,
          message: 'Your turn! Please proceed to the consultation room.',
          department: nextPatient.departmentId
        });
      }
    }

    res.json({
      success: true,
      message: `Patient ${nextPatient.tokenNumber} has been called`,
      data: {
        queue: {
          tokenNumber: nextPatient.tokenNumber,
          patientName: patient?.userId ? `${patient.userId.firstName} ${patient.userId.lastName}` : 'Patient',
          calledTime: nextPatient.calledTime
        }
      }
    });
  } catch (error) {
    console.error('Call next patient error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to call next patient' }
    });
  }
};

/**
 * Complete consultation
 */
exports.completeConsultation = async (req, res) => {
  try {
    const { queueId } = req.params;
    const { notes, diagnosis } = req.body;

    const queue = await Queue.findById(queueId);
    
    if (!queue) {
      return res.status(404).json({
        success: false,
        error: { message: 'Queue entry not found' }
      });
    }

    queue.status = 'completed';
    queue.consultationEndTime = new Date();
    queue.notes = notes || '';
    
    if (!queue.actualWaitTime && queue.consultationStartTime) {
      const waitTimeMs = queue.consultationStartTime - queue.checkInTime;
      queue.actualWaitTime = Math.round(waitTimeMs / (1000 * 60));
    }
    
    await queue.save();

    await Queue.updateMany(
      {
        departmentId: queue.departmentId,
        date: queue.date,
        status: 'waiting',
        queuePosition: { $gt: queue.queuePosition }
      },
      { 
        $inc: { queuePosition: -1, estimatedWaitTime: -30 } 
      }
    );

    const io = req.app.get('io');
    if (io) {
      io.to(`department-${queue.departmentId}`).emit('queue:updated', {
        action: 'completed',
        tokenNumber: queue.tokenNumber
      });

      io.to(`patient-${queue.patientId}`).emit('consultation:completed', {
        message: 'Your consultation has been completed. Thank you!',
        queueId: queue._id
      });
    }

    res.json({
      success: true,
      message: 'Consultation completed successfully',
      data: { queue }
    });
  } catch (error) {
    console.error('Complete consultation error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to complete consultation' }
    });
  }
};

/**
 * Get patient consultation history
 */
exports.getPatientHistory = async (req, res) => {
  try {
    const patientId = req.patient?._id;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Patient information required' }
      });
    }

    const history = await Queue.find({
      patientId,
      status: 'completed'
    })
      .populate('departmentId', 'name code')
      .sort({ consultationEndTime: -1 })
      .limit(50);

    res.json({
      success: true,
      data: {
        history: history.map(h => ({
          _id: h._id,
          tokenNumber: h.tokenNumber,
          department: h.departmentId,
          date: h.date,
          checkInTime: h.checkInTime,
          consultationStartTime: h.consultationStartTime,
          consultationEndTime: h.consultationEndTime,
          actualWaitTime: h.actualWaitTime,
          notes: h.notes,
          priority: h.priority
        }))
      }
    });
  } catch (error) {
    console.error('Get patient history error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch consultation history' }
    });
  }
};