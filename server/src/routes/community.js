import { Router } from 'express';
import { createCommunityPost, getCommunityPosts, updateCommunityPost, deleteCommunityPost, likeCommunityPost, getCommunityPost } from '../controllers/communityController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, getCommunityPosts);
router.get('/:id', optionalAuth, getCommunityPost);

router.use(authenticate);

router.post('/', createCommunityPost);
router.put('/:id', updateCommunityPost);
router.delete('/:id', deleteCommunityPost);
router.patch('/:id/like', likeCommunityPost);

export default router;
