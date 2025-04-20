const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

const initializeDb = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB');

    // Check if coordinator exists
    const existingUser = await User.findOne({ username: 'coordinator' });
    if (!existingUser) {
      // Create coordinator user
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        username: 'coordinator',
        password: hashedPassword,
        role: 'coordinator'
      });
      console.log('Coordinator user created successfully');
    } else {
      console.log('Coordinator user already exists');
    }

    // Close connection
    await mongoose.connection.close();
    console.log('Database initialization complete');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initializeDb(); 