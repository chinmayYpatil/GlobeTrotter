import Activity from '../models/activityModel.js';
import { Op } from 'sequelize';

export const searchActivities = async (req, res) => {
    try {
        const { query, type, maxCost, minRating, sortBy } = req.query;
        const where = {};

        if (query) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${query}%` } },
                { description: { [Op.iLike]: `%${query}%` } },
                { location: { [Op.iLike]: `%${query}%` } },
            ];
        }

        if (type && type !== 'all') {
            where.type = type;
        }

        if (maxCost) {
            where.cost = { [Op.lte]: parseFloat(maxCost) };
        }

        if (minRating) {
            where.rating = { [Op.gte]: parseFloat(minRating) };
        }

        let order = [['rating', 'DESC']]; // Default sort
        if (sortBy === 'price-low') {
            order = [['cost', 'ASC']];
        } else if (sortBy === 'price-high') {
            order = [['cost', 'DESC']];
        } else if (sortBy === 'rating') {
            order = [['rating', 'DESC']];
        } else if (sortBy === 'duration') {
            order = [['duration', 'ASC']];
        }

        const activities = await Activity.findAll({
            where,
            order,
            limit: 50 // Add a limit to prevent excessive data transfer
        });

        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};