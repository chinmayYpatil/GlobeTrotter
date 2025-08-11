import Trip from '../models/tripModel.js';
import { randomBytes } from 'crypto'; // Import crypto for generating a random shareId

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Private
export const createTrip = async (req, res) => {
    try {
        // Get trip details from the request body
        const { name, description, coverImage, startDate, endDate, budget } = req.body;
        // Get the user ID and email from the authenticated user session
        const userId = req.user.id;
        const userEmail = req.user.email;

        if (!name || !startDate || !endDate) {
            return res.status(400).json({ message: 'Please provide a name, start date, and end date' });
        }

        const newTrip = await Trip.create({
            name,
            description,
            coverImage,
            startDate,
            endDate,
            budget: JSON.stringify(budget), // Correctly stringify the budget object
            userId, // Link the trip to the logged-in user
            userEmail, // Add the user's email
            shareId: randomBytes(8).toString('hex') // Generate a random shareable ID
        });

        res.status(201).json({ message: "Trip created successfully", trip: newTrip });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get all trips for a user
// @route   GET /api/trips
// @access  Private
export const getUserTrips = async (req, res) => {
    try {
        const trips = await Trip.findAll({ where: { userId: req.user.id } });
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};