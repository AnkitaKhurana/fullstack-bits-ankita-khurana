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
/**
 * @swagger
 * /api/students/report:
 *   get:
 *     summary: Download student vaccination report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: vaccine
 *         schema:
 *           type: string
 *         description: Filter by vaccine name
 *     responses:
 *       200:
 *         description: CSV file containing vaccination report
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Server error generating report
 */
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

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of students
 */
router.get('/', auth, getStudents);

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       201:
 *         description: Student created successfully
 */
router.post('/', auth, addStudent);

module.exports = router; 