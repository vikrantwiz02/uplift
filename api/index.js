import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import { connectDatabase } from '../src/config/database.js';

// Import route handlers
import authRoutes from '../src/routes/auth.js';
import moodRoutes from '../src/routes/mood.js';
import journalRoutes from '../src/routes/journal.js';
import meditationRoutes from '../src/routes/meditation.js';
import goalsRoutes from '../src/routes/goals.js';
import communityRoutes from '../src/routes/community.js';
import crisisRoutes from '../src/routes/crisis.js';
import aiRoutes from '../src/routes/ai.js';

const app = express();

// CORS configuration
const corsOptions = {
  origin: ['https://uplift-iota.vercel.app', 'http://localhost:8081', 'http://localhost:8082'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to database on first request
let dbConnected = false;
app.use(async (req, res, next) => {
  if (!dbConnected) {
    try {
      await connectDatabase();
      dbConnected = true;
    } catch (error) {
      console.error('Database connection failed:', error);
    }
  }
  next();
});

// API Routes
app.use('/auth', authRoutes);
app.use('/mood', moodRoutes);
app.use('/journal', journalRoutes);
app.use('/meditation', meditationRoutes);
app.use('/goals', goalsRoutes);
app.use('/community', communityRoutes);
app.use('/crisis', crisisRoutes);
app.use('/ai', aiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Uplift API is running',
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint to check environment variables
app.get('/debug', (req, res) => {
  res.json({
    hasMongoUri: !!process.env.MONGODB_URI,
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    nodeEnv: process.env.NODE_ENV,
    geminiKeyLength: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

export default (req, res) => {
  // Modify the request URL to remove the /api prefix for proper routing
  const originalUrl = req.url;
  if (originalUrl.startsWith('/api')) {
    req.url = originalUrl.substring(4);
  }
  
  return app(req, res);
};