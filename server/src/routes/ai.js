import { Router } from 'express';
import { aiChat, getWellnessTips } from '../controllers/aiController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/chat', aiChat);
router.get('/wellness-tips', getWellnessTips);

export default router;
