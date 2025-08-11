import express from 'express';
import { createTrip } from '../controllers/tripController.js';
import { ensureAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', ensureAuth, createTrip);

export default router;