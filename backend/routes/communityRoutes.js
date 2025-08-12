import express from 'express';
import { getPosts, createPost, likePost, createComment, uploadImage } from '../controllers/communityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getPosts);
router.post('/', protect, createPost);
router.post('/upload-image', protect, uploadImage);
router.post('/:id/like', protect, likePost);
router.post('/:id/comments', protect, createComment);

export default router;