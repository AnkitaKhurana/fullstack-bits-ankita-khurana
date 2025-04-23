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

/**
 * @swagger
 * /api/vaccination-drives:
 *   get:
 *     summary: Get all vaccination drives
 *     tags: [Vaccination Drives]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vaccination drives
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VaccinationDrive'
 */
router.use(auth);

router.route('/')
  .get(getVaccinationDrives)
  .post(createVaccinationDrive);

/**
 * @swagger
 * /api/vaccination-drives/{id}:
 *   put:
 *     summary: Update a vaccination drive
 *     tags: [Vaccination Drives]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vaccination drive ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VaccinationDrive'
 *     responses:
 *       200:
 *         description: Vaccination drive updated successfully
 *       404:
 *         description: Vaccination drive not found
 */
router.route('/:id')
  .put(updateVaccinationDrive)
  .delete(deleteDrive);

router.get('/stats', getVaccinationStats);

module.exports = router; 