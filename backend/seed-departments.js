const mongoose = require('mongoose');
require('dotenv').config();

const departmentSchema = new mongoose.Schema({
  name: String,
  code: String,
  description: String,
  floor: Number,
  isEmergency: Boolean,
  isActive: Boolean
});

const Department = mongoose.model('Department', departmentSchema);

const departments = [
  {
    name: 'Cardiology',
    code: 'CARDIO',
    description: 'Heart and cardiovascular care',
    floor: 2,
    isEmergency: false,
    isActive: true
  },
  {
    name: 'Orthopedics',
    code: 'ORTHO',
    description: 'Bone and joint treatment',
    floor: 3,
    isEmergency: false,
    isActive: true
  },
  {
    name: 'Pediatrics',
    code: 'PEDIA',
    description: 'Children healthcare',
    floor: 1,
    isEmergency: false,
    isActive: true
  },
  {
    name: 'Emergency',
    code: 'EMERG',
    description: '24/7 emergency care',
    floor: 0,
    isEmergency: true,
    isActive: true
  },
  {
    name: 'General Medicine',
    code: 'GENMED',
    description: 'General health checkups',
    floor: 1,
    isEmergency: false,
    isActive: true
  }
];

async function seedDepartments() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital-queue');
    console.log('Connected to MongoDB');

    // Clear existing departments
    await Department.deleteMany({});
    console.log('Cleared existing departments');

    // Insert new departments
    await Department.insertMany(departments);
    console.log('✅ Departments seeded successfully!');
    console.log('Added departments:', departments.map(d => d.name).join(', '));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding departments:', error);
    process.exit(1);
  }
}

seedDepartments();