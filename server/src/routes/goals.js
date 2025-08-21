import { Router } from 'express';
import { createWellnessGoal, getWellnessGoals, updateWellnessGoal, deleteWellnessGoal, incrementStreak } from '../controllers/goalsController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/', createWellnessGoal);
router.get('/', getWellnessGoals);
router.put('/:id', updateWellnessGoal);
router.delete('/:id', deleteWellnessGoal);
router.patch('/:id/increment-streak', incrementStreak);

export default router;
