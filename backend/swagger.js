const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'School Vaccination Portal API',
      version: '1.0.0',
      description: 'API documentation for School Vaccination Portal',
      contact: {
        name: 'Ankita Khurana',
        url: 'https://github.com/AnkitaKhurana/fullstack-bits-ankita-khurana'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Authentication endpoints'
      },
      {
        name: 'Students',
        description: 'Student management endpoints'
      },
      {
        name: 'Vaccination Drives',
        description: 'Vaccination drive management'
      },
      {
        name: 'Reports',
        description: 'Report generation endpoints'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: [
    './routes/*.js',
    './swagger/*.js'
  ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec; 