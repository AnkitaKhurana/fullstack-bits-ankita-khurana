const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs');
const studentRoutes = require('./routes/studentRoutes');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Create temp directory for reports
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)){
    fs.mkdirSync(tempDir);
}

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', studentRoutes);
app.use('/api/vaccination-drives', require('./routes/vaccinationDrives'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 