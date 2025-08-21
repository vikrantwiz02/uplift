import { Router } from 'express';
import { getCrisisResources, createCrisisResource, updateCrisisResource, deleteCrisisResource } from '../controllers/crisisController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', getCrisisResources);

// Admin only routes (you may want to add admin middleware)
router.use(authenticate);
router.post('/', createCrisisResource);
router.put('/:id', updateCrisisResource);
router.delete('/:id', deleteCrisisResource);

export default router;
