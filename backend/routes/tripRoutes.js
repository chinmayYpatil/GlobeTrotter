import express from 'express';
import { createTrip, getUserTrips } from '../controllers/tripController.js';
import { ensureAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', ensureAuth, createTrip);
router.get('/', ensureAuth, getUserTrips); // Add this route

export default router;