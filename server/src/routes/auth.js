import { Router } from 'express';
import passport from 'passport';
import { register, login, getProfile, updateProfile, forgotPassword, resetPassword, logout, googleAuthSuccess } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Traditional auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:8081'}/auth?error=authentication_failed` }),
  googleAuthSuccess
);

// Check if user is authenticated
router.get('/check', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user, authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
});

export default router;
