const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: { title: 'My API', description: 'Prototype API' },
  host: 'localhost:3000',
  schemes: ['http','https']
};

swaggerAutogen('./swagger-output.json', ['./app.js'], doc);
