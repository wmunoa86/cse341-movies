const { MongoClient } = require('mongodb');

let db;

const connectDB = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db(process.env.DB_NAME || 'cse341-movies');
  console.log('Connected to MongoDB');
};

const getDB = () => {
  if (!db) throw new Error('Database not initialized. Call connectDB first.');
  return db;
};

module.exports = { connectDB, getDB };
