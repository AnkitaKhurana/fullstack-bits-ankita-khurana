const Student = require('../models/Student');
const csv = require('csv-parse');
const VaccinationDrive = require('../models/VaccinationDrive');

// @desc    Get all students
// @route   GET /api/students
// @access  Private
const getStudents = async (req, res) => {
  try {
    const { search, class: studentClass, vaccinationStatus, page = 1, limit = 10, vaccine } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }
    if (studentClass) {
      query.class = studentClass;
    }
    if (vaccinationStatus === 'vaccinated') {
      query['vaccinations.0'] = { $exists: true };
    } else if (vaccinationStatus === 'unvaccinated') {
      query['vaccinations.0'] = { $exists: false };
    }
    if (vaccine) {
      query['vaccinations.vaccineName'] = vaccine;
    }

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .populate('vaccinations.drive', 'vaccineName date')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      students,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add new student
// @route   POST /api/students
// @access  Private
const addStudent = async (req, res) => {
  try {
    const { name, studentId, class: studentClass, dateOfBirth, parentName, contactNumber } = req.body;

    // Log the received data
    console.log('Received student data:', {
      name,
      studentId,
      class: studentClass,
      dateOfBirth,
      parentName,
      contactNumber
    });

    // Validation
    if (!name || !studentId || !studentClass || !dateOfBirth || !parentName || !contactNumber) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        message: 'Please provide all required fields',
        receivedData: { name, studentId, class: studentClass, dateOfBirth, parentName, contactNumber }
      });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ studentId });
    if (existingStudent) {
      return res.status(400).json({ 
        message: 'Student ID already exists',
        field: 'studentId'
      });
    }

    // Validate class number
    const classNum = parseInt(studentClass);
    if (isNaN(classNum) || classNum < 1 || classNum > 12) {
      return res.status(400).json({ 
        message: 'Class must be a number between 1 and 12',
        field: 'class'
      });
    }

    // Create student with all required fields
    const student = await Student.create({
      name: name.trim(),
      studentId: studentId.trim(),
      class: studentClass,
      dateOfBirth: new Date(dateOfBirth),
      parentName: parentName.trim(),
      contactNumber: contactNumber.trim(),
      vaccinations: []
    });

    console.log('Student created successfully:', student);
    res.status(201).json(student);
  } catch (err) {
    console.error('Detailed error in addStudent:', {
      name: err.name,
      message: err.message,
      errors: err.errors,
      stack: err.stack
    });
    
    if (err.name === 'ValidationError') {
      const errors = Object.keys(err.errors).map(key => ({
        field: key,
        message: err.errors[key].message,
        value: err.errors[key].value
      }));
      return res.status(400).json({ 
        message: 'Validation failed',
        errors 
      });
    }

    res.status(500).json({ 
      message: 'Failed to save student',
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// @desc    Bulk import students via CSV
// @route   POST /api/students/bulk
// @access  Private
const bulkImportStudents = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: 'Please upload a CSV file' });
    }

    const { file } = req.files;
    const students = [];
    
    // Parse CSV
    const parser = csv.parse({ columns: true, trim: true });
    
    parser.on('readable', async () => {
      let record;
      while ((record = parser.read())) {
        students.push({
          name: record.name,
          studentId: record.studentId,
          class: record.class
        });
      }
    });

    parser.on('end', async () => {
      try {
        await Student.insertMany(students, { ordered: false });
        res.json({ message: `${students.length} students imported successfully` });
      } catch (err) {
        res.status(400).json({ message: 'Error importing students', error: err.message });
      }
    });

    parser.write(file.data);
    parser.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const vaccinateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { driveId } = req.body;

    if (!driveId) {
      return res.status(400).json({ message: 'Vaccination drive ID is required' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const drive = await VaccinationDrive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ message: 'Vaccination drive not found' });
    }

    if (drive.availableDoses <= 0) {
      return res.status(400).json({ message: 'No doses available in this drive' });
    }

    if (!drive.applicableClasses.includes(student.class)) {
      return res.status(400).json({ message: 'This drive is not applicable for student\'s class' });
    }

    // Add vaccination record
    student.vaccinations.push({
      drive: driveId,
      date: new Date(),
      vaccineName: drive.vaccineName
    });

    // Decrease available doses
    drive.availableDoses -= 1;

    await Promise.all([
      student.save(),
      drive.save()
    ]);

    res.json({ message: 'Student marked as vaccinated successfully' });
  } catch (err) {
    console.error('Error in vaccinateStudent:', err);
    res.status(500).json({ message: 'Failed to mark vaccination' });
  }
};

module.exports = {
  getStudents,
  addStudent,
  bulkImportStudents,
  deleteStudent,
  vaccinateStudent
}; 