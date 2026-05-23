const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Movies & Actors API',
    description: 'CSE 341 Week 03 - Full CRUD REST API for Movies and Actors collections'
  },
  host: process.env.RENDER_HOST || 'localhost:8080',
  schemes: [process.env.RENDER_HOST ? 'https' : 'http'],
  tags: [
    { name: 'Movies', description: 'CRUD operations for the movies collection' },
    { name: 'Actors', description: 'CRUD operations for the actors collection' }
  ]
};

const outputFile = './swagger-output.json';
const routes = ['./routes/index.js'];

swaggerAutogen(outputFile, routes, doc);
