import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables FIRST
dotenv.config();

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { connectDatabase } from './config/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import moodRoutes from './routes/mood.js';
import journalRoutes from './routes/journal.js';
import meditationRoutes from './routes/meditation.js';
import goalsRoutes from './routes/goals.js';
import communityRoutes from './routes/community.js';
import crisisRoutes from './routes/crisis.js';
import aiRoutes from './routes/ai.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - Enable CORS for development
app.use(cors({
  origin: [
    'http://localhost:8080', // Vite dev server
    'http://localhost:3001', // Production unified server
    'http://127.0.0.1:8080',
    'http://127.0.0.1:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Uplift API is running' });
});

// API root endpoint - provides information about available endpoints
app.get('/api', (req, res) => {
  res.json({
    message: 'Uplift Wellbeing API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      mood: '/api/mood',
      journal: '/api/journal',
      meditation: '/api/meditation',
      goals: '/api/goals',
      community: '/api/community',
      crisis: '/api/crisis',
      ai: '/api/ai'
    },
    health: '/health'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/meditation', meditationRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/crisis', crisisRoutes);
app.use('/api/ai', aiRoutes);

// Serve static files from the dist directory (built frontend)
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Handle React routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  
  res.sendFile(path.join(distPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Uplift App running on port ${PORT}`);
      console.log(`🌐 Full-stack app: http://localhost:${PORT}`);
      console.log(`🔗 API endpoints: http://localhost:${PORT}/api`);
      console.log(`📱 Frontend & Backend unified on single port!`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    // In production, continue even if DB connection fails initially
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    } else {
      // Start server anyway in production
      app.listen(PORT, () => {
        console.log(`🚀 Uplift App running on port ${PORT} (DB connection pending)`);
      });
    }
  }
};

startServer();
