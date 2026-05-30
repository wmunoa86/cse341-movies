const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Movies & Actors API',
    description: `CSE 341 Week 04 - Full CRUD REST API for Movies and Actors with Google OAuth authentication.

**Authentication flow:**
1. Visit \`GET /auth/google\` to log in with your Google account.
2. After login, your session cookie is set automatically.
3. Use the Swagger UI normally — the session cookie is sent with each request.
4. Visit \`GET /auth/logout\` to end your session.

**Protected routes** (require login): POST, PUT, DELETE on /movies and /actors.
**Public routes**: GET on /movies and /actors, all /auth endpoints.`
  },
  host: process.env.RENDER_HOST || 'localhost:8080',
  schemes: [process.env.RENDER_HOST ? 'https' : 'http'],
  securityDefinitions: {
    GoogleOAuth: {
      type: 'oauth2',
      authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
      flow: 'implicit',
      scopes: {
        profile: 'Read your Google profile',
        email: 'Read your Google email address'
      }
    }
  },
  tags: [
    { name: 'Auth', description: 'Google OAuth login, logout, and session status' },
    { name: 'Movies', description: 'CRUD operations for the movies collection' },
    { name: 'Actors', description: 'CRUD operations for the actors collection' }
  ]
};

const outputFile = './swagger-output.json';
const routes = ['./routes/index.js'];

swaggerAutogen(outputFile, routes, doc);
