import express from 'express';
import { getDashboardData } from '../controllers/dashboardController.js';
import { ensureAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', ensureAuth, getDashboardData);

export default router;