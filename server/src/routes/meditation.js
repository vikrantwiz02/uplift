import { Router } from 'express';
import { createMeditationSession, getMeditationSessions, updateMeditationSession, deleteMeditationSession, getSessionStats } from '../controllers/meditationController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/', createMeditationSession);
router.get('/', getMeditationSessions);
router.get('/stats', getSessionStats);
router.put('/:id', updateMeditationSession);
router.delete('/:id', deleteMeditationSession);

export default router;
