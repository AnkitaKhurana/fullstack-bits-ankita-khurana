const mongoose = require('mongoose');

const vaccinationDriveSchema = new mongoose.Schema({
  vaccineName: {
    type: String,
    required: [true, 'Vaccine name is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  availableDoses: {
    type: Number,
    required: [true, 'Number of available doses is required'],
    min: [0, 'Available doses cannot be negative']
  },
  applicableClasses: [{
    type: String,
    enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  }],
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('VaccinationDrive', vaccinationDriveSchema); 