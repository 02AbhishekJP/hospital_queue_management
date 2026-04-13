const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
  firstName: String,
  lastName: String,
  phoneNumber: String,
  isActive: Boolean
});

const User = mongoose.model('User', userSchema);

const staffUsers = [
  {
    email: 'staff@hospital.com',
    password: 'staff123',
    role: 'staff',
    firstName: 'Sarah',
    lastName: 'Johnson',
    phoneNumber: '9876543210',
    isActive: true
  },
  {
    email: 'doctor@hospital.com',
    password: 'doctor123',
    role: 'doctor',
    firstName: 'Dr. John',
    lastName: 'Smith',
    phoneNumber: '9876543211',
    isActive: true
  }
];

async function seedStaff() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital-queue');
    console.log('Connected to MongoDB');

    for (const staffUser of staffUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: staffUser.email });
      
      if (existingUser) {
        console.log(`User ${staffUser.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(staffUser.password, salt);

      // Create user
      await User.create({
        ...staffUser,
        password: hashedPassword
      });

      console.log(`✅ Created ${staffUser.role}: ${staffUser.email}`);
    }

    console.log('\n✅ Staff users seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Staff Account:');
    console.log('  Email: staff@hospital.com');
    console.log('  Password: staff123');
    console.log('\nDoctor Account:');
    console.log('  Email: doctor@hospital.com');
    console.log('  Password: doctor123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding staff:', error);
    process.exit(1);
  }
}

seedStaff();