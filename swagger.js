const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: { title: 'My API', description: 'Prototype API' },
  host: 'machine-test-api.onrender.com',
  schemes: ['https']
};

swaggerAutogen('./swagger-output.json', ['./app.js'], doc);
