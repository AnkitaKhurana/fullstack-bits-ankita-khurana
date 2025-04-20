const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getVaccinationDrives,
  createVaccinationDrive,
  updateVaccinationDrive,
  deleteDrive,
  getVaccinationStats
} = require('../controllers/vaccinationDriveController');

router.use(auth);

router.route('/')
  .get(getVaccinationDrives)
  .post(createVaccinationDrive);

router.route('/:id')
  .put(updateVaccinationDrive)
  .delete(deleteDrive);

router.get('/stats', getVaccinationStats);

module.exports = router; 