const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

const createInitialUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Check if user exists
    const existingUser = await User.findOne({ username: 'coordinator' });
    if (existingUser) {
      console.log('Coordinator user already exists');
      process.exit(0);
    }

    // Create new user
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({
      username: 'coordinator',
      password: hashedPassword,
      role: 'coordinator'
    });

    console.log('Coordinator user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating user:', error);
    process.exit(1);
  }
};

createInitialUser(); 