// backend/controllers/tripController.js
import Trip from '../models/tripModel.js';

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Private
export const createTrip = async (req, res) => {
    try {
        // Get trip details from the request body
        const { destination, startDate, endDate, budget, notes } = req.body;
        // Get the user ID from the authenticated user session
        const userId = req.user.id;

        if (!destination || !startDate || !endDate) {
            return res.status(400).json({ message: 'Please provide destination, start date, and end date' });
        }

        const newTrip = await Trip.create({
            destination,
            startDate,
            endDate,
            budget,
            notes,
            userId // Link the trip to the logged-in user
        });

        res.status(201).json({ message: "Trip created successfully", trip: newTrip });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};