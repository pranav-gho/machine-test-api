// swagger.js
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Doctor API',
    description: 'Simple API for user signup, login and doctor search with filters'
  },
  host: 'localhost:3000',
  schemes: ['http']
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js']; // Points to your main app file

swaggerAutogen(outputFile, endpointsFiles, doc);
