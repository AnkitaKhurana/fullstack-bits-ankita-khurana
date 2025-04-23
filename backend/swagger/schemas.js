/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - name
 *         - studentId
 *         - class
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         name:
 *           type: string
 *           description: Student's full name
 *         studentId:
 *           type: string
 *           description: Unique student identifier
 *         class:
 *           type: string
 *           description: Student's class/grade
 *           enum: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         parentName:
 *           type: string
 *         contactNumber:
 *           type: string
 *         vaccinations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Vaccination'
 *     
 *     VaccinationDrive:
 *       type: object
 *       required:
 *         - vaccineName
 *         - date
 *         - availableDoses
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         vaccineName:
 *           type: string
 *           description: Name of the vaccine
 *         date:
 *           type: string
 *           format: date
 *           description: Date of vaccination drive
 *         availableDoses:
 *           type: number
 *           minimum: 1
 *           description: Number of doses available
 *         applicableClasses:
 *           type: array
 *           items:
 *             type: string
 *           description: List of classes eligible for vaccination
 *         status:
 *           type: string
 *           enum: [scheduled, completed, cancelled]
 *           description: Current status of the drive
 *     
 *     Vaccination:
 *       type: object
 *       properties:
 *         driveId:
 *           type: string
 *           description: Reference to vaccination drive
 *         vaccineName:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 *     
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *               message:
 *                 type: string
 *     
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */ 