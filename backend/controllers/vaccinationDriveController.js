const VaccinationDrive = require('../models/VaccinationDrive');
const Student = require('../models/Student');

// @desc    Get all vaccination drives
// @route   GET /api/vaccination-drives
// @access  Private
const getVaccinationDrives = async (req, res) => {
  try {
    const { upcoming } = req.query;
    let query = {};

    if (upcoming === 'true') {
      query = {
        date: { 
          $gte: new Date(),
          $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Next 30 days
        },
        status: 'scheduled'
      };
    }

    const drives = await VaccinationDrive.find(query)
      .sort({ date: 1 });

    res.json(drives);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new vaccination drive
// @route   POST /api/vaccination-drives
// @access  Private
const createVaccinationDrive = async (req, res) => {
  try {
    const { vaccineName, date, availableDoses, applicableClasses } = req.body;

    // Check for overlapping drives
    const overlappingDrive = await VaccinationDrive.findOne({
      date: date,
      status: 'scheduled'
    });

    if (overlappingDrive) {
      return res.status(400).json({ 
        message: 'A vaccination drive is already scheduled for this date' 
      });
    }

    const drive = await VaccinationDrive.create({
      vaccineName,
      date,
      availableDoses,
      applicableClasses
    });

    res.status(201).json(drive);
  } catch (err) {
    if (err.message.includes('15 days in advance')) {
      return res.status(400).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update vaccination drive
// @route   PUT /api/vaccination-drives/:id
// @access  Private
const updateVaccinationDrive = async (req, res) => {
  try {
    const drive = await VaccinationDrive.findById(req.params.id);

    if (!drive) {
      return res.status(404).json({ message: 'Vaccination drive not found' });
    }

    // Check if drive is in the past
    if (new Date(drive.date) < new Date()) {
      return res.status(400).json({ 
        message: 'Cannot edit past vaccination drives' 
      });
    }

    const updatedDrive = await VaccinationDrive.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedDrive);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get vaccination drive statistics
// @route   GET /api/vaccination-drives/stats
// @access  Private
const getVaccinationStats = async (req, res) => {
  try {
    // Get total students count
    const totalStudents = await Student.countDocuments();
    
    // Get vaccinated students count
    const vaccinatedStudents = await Student.countDocuments({
      'vaccinations.status': 'completed'
    });
    
    // Get upcoming drives count using countDocuments directly
    const upcomingDrives = await VaccinationDrive.countDocuments({
      date: { 
        $gte: new Date(),
        $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Next 30 days
      },
      status: 'scheduled'
    });

    // Calculate vaccination rate
    const vaccinationRate = totalStudents ? (vaccinatedStudents / totalStudents) * 100 : 0;

    res.json({
      totalStudents,
      vaccinatedStudents,
      vaccinationRate,
      upcomingDrives
    });
  } catch (err) {
    console.error('Error in getVaccinationStats:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteDrive = async (req, res) => {
  try {
    const drive = await VaccinationDrive.findById(req.params.id);
    
    if (!drive) {
      return res.status(404).json({ message: 'Vaccination drive not found' });
    }

    // Check if drive is in the past
    if (new Date(drive.date) < new Date()) {
      return res.status(400).json({ message: 'Cannot delete past vaccination drives' });
    }

    await VaccinationDrive.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vaccination drive deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getVaccinationDrives,
  createVaccinationDrive,
  updateVaccinationDrive,
  getVaccinationStats,
  deleteDrive
}; 