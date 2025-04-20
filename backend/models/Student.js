const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  class: {
    type: String,
    required: [true, 'Class is required'],
    enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  parentName: {
    type: String,
    required: [true, 'Parent/Guardian name is required'],
    trim: true
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true
  },
  vaccinations: [{
    vaccineName: String,
    date: Date,
    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VaccinationDrive'
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema); 