import { connectDatabase } from '../../../src/config/database.js';
import { getProfile } from '../../../src/controllers/authController.js';
import { authenticate } from '../../../src/middleware/auth.js';
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

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Connect to database
    await connectDatabase();
    
    // Authenticate user
    await new Promise((resolve, reject) => {
      authenticate(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });

    // Call the getProfile controller
    await getProfile(req, res);
  } catch (error) {
    console.error('Profile API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}