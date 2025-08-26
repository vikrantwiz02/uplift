import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';

// Load environment variables
dotenv.config();

import { connectDatabase } from '../../server/src/config/database.js';
import '../../server/src/config/passport.js';

// Import routes
import authRoutes from '../../server/src/routes/auth.js';
import moodRoutes from '../../server/src/routes/mood.js';
import journalRoutes from '../../server/src/routes/journal.js';
import meditationRoutes from '../../server/src/routes/meditation.js';
import goalsRoutes from '../../server/src/routes/goals.js';
import communityRoutes from '../../server/src/routes/community.js';
import crisisRoutes from '../../server/src/routes/crisis.js';
import aiRoutes from '../../server/src/routes/ai.js';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://uplift-iota.vercel.app',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Session middleware for Google OAuth
app.use(session({
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect to database
connectDatabase();

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
  res.json({ status: 'OK', message: 'Uplift API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default (req, res) => {
  return app(req, res);
};
