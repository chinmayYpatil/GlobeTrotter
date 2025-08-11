import Trip from '../models/tripModel.js';
import City from '../models/cityModel.js';
import { Op } from 'sequelize';

export const getDashboardData = async (req, res) => {
    try {
        const welcomeMessage = `Welcome back, ${req.user.firstName || req.user.displayName}!`;

        let previousTrips = await Trip.findAll({
            where: {
                userId: req.user.id,
                startDate: {
                    [Op.lt]: new Date(),
                },
            },
            limit: 3,
            order: [['startDate', 'DESC']],
        });

        // Ensure budget is parsed
        previousTrips = previousTrips.map(trip => {
            if (typeof trip.budget === 'string') {
                trip.budget = JSON.parse(trip.budget);
            }
            return trip;
        });


        const topRegions = await City.findAll({
            order: [['popularity', 'DESC']],
        });

        res.status(200).json({
            welcomeMessage,
            previousTrips,
            topRegions,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};