const mongoose = require('mongoose');
const Queue = require('./src/models/Queue');
const Patient = require('./src/models/Patient');
const Department = require('./src/models/Department');
const User = require('./src/models/User');
require('dotenv').config();

async function generateTestData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital-queue');
    console.log('Connected to MongoDB');

    // Get departments
    const departments = await Department.find({ isActive: true });
    console.log(`Found ${departments.length} departments`);

    // Get a patient (or create one)
    let patient = await Patient.findOne();
    if (!patient) {
      console.log('No patient found, please create one first by registering!');
      process.exit(1);
    }

    console.log('Generating test data...');

    // Generate data for last 7 days
    const priorities = ['normal', 'senior-citizen', 'pregnant', 'emergency'];
    const statuses = ['completed', 'completed', 'completed', 'cancelled']; // Mostly completed

    for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
      const date = new Date();
      date.setDate(date.getDate() - dayOffset);
      const dayStart = new Date(date).setHours(0, 0, 0, 0);

      // Generate 5-15 random entries per day
      const entriesCount = Math.floor(Math.random() * 10) + 5;

      for (let i = 0; i < entriesCount; i++) {
        // Random department
        const dept = departments[Math.floor(Math.random() * departments.length)];
        
        // Random hour between 8 AM and 6 PM
        const hour = Math.floor(Math.random() * 10) + 8;
        const minute = Math.floor(Math.random() * 60);
        
        const checkInTime = new Date(dayStart);
        checkInTime.setHours(hour, minute, 0, 0);

        // Random wait time between 15-60 minutes
        const waitTime = Math.floor(Math.random() * 45) + 15;
        
        const consultationStartTime = new Date(checkInTime);
        consultationStartTime.setMinutes(consultationStartTime.getMinutes() + waitTime);
        
        const consultationEndTime = new Date(consultationStartTime);
        consultationEndTime.setMinutes(consultationEndTime.getMinutes() + 20); // 20 min consultation

        // Get next queue number
        const queueNumber = await Queue.getNextQueueNumber(dept._id, new Date(dayStart));
        const tokenNumber = Queue.generateTokenNumber(dept.code, queueNumber);

        await Queue.create({
          queueNumber,
          tokenNumber,
          patientId: patient._id,
          departmentId: dept._id,
          date: dayStart,
          queuePosition: i + 1,
          estimatedWaitTime: waitTime,
          actualWaitTime: waitTime,
          priority: priorities[Math.floor(Math.random() * priorities.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          checkInTime,
          consultationStartTime,
          consultationEndTime,
          calledTime: consultationStartTime,
          notes: 'Test consultation'
        });
      }

      console.log(`✅ Generated ${entriesCount} entries for ${date.toLocaleDateString()}`);
    }

    console.log('\n🎉 Test data generated successfully!');
    console.log('\nNow you can:');
    console.log('1. Login as staff');
    console.log('2. Click "View Analytics Dashboard"');
    console.log('3. See beautiful charts with real data!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error generating test data:', error);
    process.exit(1);
  }
}

generateTestData();