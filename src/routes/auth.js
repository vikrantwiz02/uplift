import { Router } from 'express';
import { register, login, getProfile, updateProfile, forgotPassword, resetPassword, logout, checkAuth } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Authentication routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Profile routes
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

// Check if user is authenticated
router.get('/check', checkAuth);

export default router;
