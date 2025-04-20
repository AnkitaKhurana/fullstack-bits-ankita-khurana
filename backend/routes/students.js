const express = require('express');
const router = express.Router();
const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');
const fs = require('fs');
const Student = require('../models/Student');
const auth = require('../middleware/auth');
const {
  getStudents,
  addStudent,
  bulkImportStudents,
  deleteStudent
} = require('../controllers/studentController');

router.use(auth);

router.route('/')
  .get(getStudents)
  .post(addStudent);

router.route('/:id')
  .delete(deleteStudent);

router.post('/bulk', bulkImportStudents);

// @route   GET /api/students/report
// @desc    Download student vaccination report
// @access  Private
router.get('/report', auth, async (req, res) => {
  try {
    const { vaccine } = req.query;
    let query = {};
    
    if (vaccine) {
      query['vaccinations.vaccineName'] = vaccine;
    }

    const students = await Student.find(query)
      .select('studentId name class vaccinations')
      .lean();

    // Ensure temp directory exists
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)){
      fs.mkdirSync(tempDir);
    }

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

    const tempFile = path.join(tempDir, `report-${Date.now()}.csv`);
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

    res.download(tempFile, 'vaccination-report.csv', (err) => {
      if (err) {
        console.error('Error sending file:', err);
        return res.status(500).json({ message: 'Error downloading file' });
      }
      // Clean up temp file
      fs.unlink(tempFile, (err) => {
        if (err) console.error('Error deleting temp file:', err);
      });
    });
  } catch (err) {
    console.error('Report generation error:', err);
    res.status(500).json({ message: 'Server error generating report' });
  }
});

module.exports = router; 