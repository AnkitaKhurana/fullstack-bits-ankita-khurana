const express = require('express');
const router = express.Router();
const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');
const fs = require('fs');
const Student = require('../models/Student');
const {
  getStudents,
  addStudent,
  bulkImportStudents,
  deleteStudent,
  vaccinateStudent
} = require('../controllers/studentController');

// @route   GET /api/students/report
// @desc    Download student vaccination report
// @access  Private
router.get('/report', async (req, res) => {
  try {
    const { vaccine } = req.query;
    let query = {};
    
    if (vaccine) {
      query['vaccinations.vaccineName'] = vaccine;
    }

    const students = await Student.find(query)
      .select('studentId name class vaccinations')
      .lean();

    // Create CSV data
    const csvData = students.map(student => ({
      studentId: student.studentId,
      name: student.name,
      class: `Grade ${student.class}`,
      vaccinationStatus: student.vaccinations?.length ? 'Vaccinated' : 'Not Vaccinated',
      vaccineName: student.vaccinations?.[0]?.vaccineName || '-',
      vaccinationDate: student.vaccinations?.[0]?.date 
        ? new Date(student.vaccinations[0].date).toLocaleDateString()
        : '-'
    }));

    // Create temporary file
    const tempFile = path.join(__dirname, '../temp', 'report.csv');
    const csvWriter = createObjectCsvWriter({
      path: tempFile,
      header: [
        { id: 'studentId', title: 'Student ID' },
        { id: 'name', title: 'Name' },
        { id: 'class', title: 'Class' },
        { id: 'vaccinationStatus', title: 'Vaccination Status' },
        { id: 'vaccineName', title: 'Vaccine Name' },
        { id: 'vaccinationDate', title: 'Vaccination Date' }
      ]
    });

    await csvWriter.writeRecords(csvData);

    // Send file
    res.download(tempFile, 'vaccination-report.csv', (err) => {
      // Delete temp file after sending
      if (err) {
        console.error('Error sending file:', err);
      }
      fs.unlink(tempFile, (err) => {
        if (err) console.error('Error deleting temp file:', err);
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Base routes
router.get('/', getStudents);
router.post('/', addStudent);
router.post('/bulk', bulkImportStudents);
router.delete('/:id', deleteStudent);

// Vaccination route - make sure this is before the report route
router.post('/:studentId/vaccinate', vaccinateStudent);

module.exports = router; 