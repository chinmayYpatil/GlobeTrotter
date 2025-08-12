import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
    createTrip, 
    getUserTrips, 
    getTripById,
    generateAITrip,
    getUserAITrips,
    getAITripById,
    searchCities 
} from '../controllers/tripController.js';

const router = express.Router();

// --- City Search Route (does not need protection if public) ---
router.get('/cities/search', searchCities);

// --- Manual Trip Routes (all protected) ---
router.post('/', protect, createTrip);
router.get('/', protect, getUserTrips);
router.get('/:id', protect, getTripById);

// --- AI Trip Routes (all protected) ---
router.post('/generate-ai', protect, generateAITrip);
router.get('/ai-trips', protect, getUserAITrips);
router.get('/ai-trips/:tripId', protect, getAITripById);

export default router;
