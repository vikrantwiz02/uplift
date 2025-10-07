import { connectDatabase } from '../../src/config/database.js';
import { login } from '../../src/controllers/authController.js';
import cors from 'cors';

// CORS configuration
const corsOptions = {
  origin: ['https://uplift-iota.vercel.app', 'http://localhost:8081', 'http://localhost:8082'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

export default async function handler(req, res) {
  // Handle CORS
  const corsHandler = cors(corsOptions);
  await new Promise((resolve, reject) => {
    corsHandler(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Connect to database
    await connectDatabase();
    
    // Call the login controller
    await login(req, res);
  } catch (error) {
    console.error('Login API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}