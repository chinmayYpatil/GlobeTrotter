import Trip from '../models/tripModel.js';

export const getDashboardData = async (req, res) => {
    try {
        const welcomeMessage = `Welcome back, ${req.user.firstName || req.user.displayName}!`;

        const recentTrips = await Trip.findAll({
            where: { userId: req.user.id },
            limit: 5,
            order: [['startDate', 'DESC']],
        });

        const recommendedDestinations = [
            { id: 1, city: 'Paris', country: 'France', image: 'url_to_paris_image' },
            { id: 2, city: 'Tokyo', country: 'Japan', image: 'url_to_tokyo_image' },
            { id: 3, city: 'New York', country: 'USA', image: 'url_to_ny_image' },
            { id: 4, city: 'Rome', country: 'Italy', image: 'url_to_rome_image' },
        ];

        const budgetHighlights = {
            totalSpent: 5000,
            averageTripCost: 1250,
        };

        res.status(200).json({
            welcomeMessage,
            recentTrips,
            recommendedDestinations,
            budgetHighlights,
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};