import Trip from '../models/tripModel.js';
import AITrip from '../models/aiTripModel.js';
import City from '../models/cityModel.js';
import { Op } from 'sequelize';
import { randomBytes } from 'crypto';
import fetch from 'node-fetch';

// --- City Search Function ---
export const searchCities = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(200).json([]);
        }
        const cities = await City.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${query}%` } },
                    { country: { [Op.iLike]: `%${query}%` } }
                ]
            },
            limit: 10
        });
        res.status(200).json(cities);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// --- Manual Trip Functions ---
export const createTrip = async (req, res) => {
    try {
        const { name, description, coverImage, startDate, endDate, budget } = req.body;
        
        // --- FIX: Robust budget handling ---
        // This ensures the budget is always stored as a consistent JSON object.
        let finalBudget = { total: 0 };
        if (typeof budget === 'object' && budget !== null && budget.total !== undefined) {
            finalBudget = budget;
        } else if (typeof budget === 'number') {
            finalBudget = { total: budget };
        }

        const newTrip = await Trip.create({
            name, description, coverImage, startDate, endDate,
            budget: finalBudget, // Save the correctly formatted object
            userId: req.user.id,
            userEmail: req.user.email,
            shareId: randomBytes(8).toString('hex')
        });
        res.status(201).json({ message: "Trip created successfully", trip: newTrip });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getUserTrips = async (req, res) => {
    try {
        const trips = await Trip.findAll({ where: { userId: req.user.id } });
        
        // --- FIX: Safely parse budget field ---
        // Ensures frontend always gets a consistent object.
        const formattedTrips = trips.map(trip => {
            const tripJSON = trip.toJSON();
            if (typeof tripJSON.budget === 'string') {
                try {
                    tripJSON.budget = JSON.parse(tripJSON.budget);
                } catch (e) {
                    tripJSON.budget = { total: 0 }; // Default on parse error
                }
            }
            return tripJSON;
        });
        res.status(200).json(formattedTrips);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// --- NEW FUNCTION: Fetches a single manual trip by its ID ---
export const getTripById = async (req, res) => {
    try {
        const { id } = req.params;
        const trip = await Trip.findOne({ where: { id, userId: req.user.id }});

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found or you do not have permission.' });
        }
        
        const tripJSON = trip.toJSON();
        if (typeof tripJSON.budget === 'string') {
           tripJSON.budget = JSON.parse(tripJSON.budget);
        }

        res.status(200).json(tripJSON);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// --- AI Trip Generation Logic (Your robust parser is kept as it is excellent) ---
const createAITripPrompt = (tripData) => {
    const { destination, noOfDays, budget, traveler } = tripData;
    return `Generate a complete Travel Plan for a trip to the primary city of: ${destination}. The trip is for ${noOfDays} Days for ${traveler} with a ${budget} budget.
IMPORTANT INSTRUCTIONS:
- The final output MUST BE ONLY a single, valid JSON object.
- Do NOT include any text, explanations, or markdown formatting like \`\`\`json before or after the JSON object.
- The "location" key in the output JSON must be the city name extracted from "${destination}".
- All keys and string values in the JSON MUST be enclosed in double quotes.
- Do NOT use currency symbols like $ or € — write amounts as plain strings, e.g., "1500-2500".
- For any unavailable data, use the string "Not Available".
- Ensure there are no trailing commas in any objects or arrays.
- Follow this JSON structure EXACTLY:

{"tripData":[{"travelPlan":{"location":"${destination}","duration":"${noOfDays} Day(s)","budget":"${budget}","groupSize":"${traveler}","hotelOptions":[{"hotelName":"string","hotelAddress":"string","price":"string","hotelImageUrl":"string","geoCoordinates":{"latitude":number,"longitude":number},"rating":number,"description":"string"}],"itinerary":{"day1":{"morning":{"placeName":"string","placeDetails":"string","placeImageUrl":"string","geoCoordinates":{"latitude":number,"longitude":number},"ticketPricing":"string","timeToSpend":"string","travelTime":"string"},"afternoon":{"placeName":"string","placeDetails":"string","placeImageUrl":"string","geoCoordinates":{"latitude":number,"longitude":number},"ticketPricing":"string","timeToSpend":"string","travelTime":"string"},"evening":{"placeName":"string","placeDetails":"string","placeImageUrl":"string","geoCoordinates":{"latitude":number,"longitude":number},"ticketPricing":"string","timeToSpend":"string","travelTime":"string"},"bestTimeToVisit":"string"}}}}]}`;
};


const callGeminiAPI = async (prompt) => {
    const apiKey = process.env.GOOGLE_GEMINI_AI_API_KEY;
    if (!apiKey) throw new Error('Google Gemini API key not found in backend .env file.');

    const modelName = 'gemini-1.5-flash-latest';
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
    );

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`AI API request failed: ${response.status} ${response.statusText} - ${errorBody}`);
    }
    const data = await response.json();
    if (!data.candidates || !data.candidates[0].content.parts[0].text) {
        throw new Error('Invalid response structure from AI API.');
    }
    return data.candidates[0].content.parts[0].text;
};

const parseAIResponse = (aiResponse) => {
    console.log("Raw AI Response:", aiResponse);
    const firstBracket = aiResponse.indexOf('{');
    const lastBracket = aiResponse.lastIndexOf('}');

    if (firstBracket === -1 || lastBracket === -1) {
        throw new Error('No valid JSON object found in the AI response.');
    }

    let jsonString = aiResponse.substring(firstBracket, lastBracket + 1);

    jsonString = jsonString
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
        .replace(/\n/g, ' ')
        .replace(/\r/g, ' ')
        .replace(/,\s*([}\]])/g, '$1');

    try {
        return JSON.parse(jsonString);
    } catch (e) {
        console.warn("Standard parsing failed. Attempting more aggressive cleaning...");
        jsonString = jsonString.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3'); 

        try {
            const finalParsed = JSON.parse(jsonString);
            console.log("Successfully parsed after aggressive cleaning.");
            return finalParsed;
        } catch (finalError) {
            console.error("Failed to parse cleaned JSON:", jsonString);
            throw new Error(`SyntaxError in AI response JSON after all cleaning attempts: ${finalError.message}`);
        }
    }
};


export const generateAITrip = async (req, res) => {
    try {
        const userSelection = req.body;
        const prompt = createAITripPrompt(userSelection);
        const aiResponseText = await callGeminiAPI(prompt);
        
        const parsedTripData = parseAIResponse(aiResponseText);
        const docId = Date.now().toString();

        const newAITrip = await AITrip.create({
            id: docId,
            tripData: parsedTripData.tripData,
            userSelection: userSelection,
            userEmail: req.user.email,
            userId: req.user.id
        });

        res.status(201).json({ success: true, trip: newAITrip });
    } catch (error) {
        console.error('Error in generateAITrip controller:', error);
        res.status(500).json({ success: false, error: 'Failed to generate trip with AI. ' + error.message });
    }
};

export const getUserAITrips = async (req, res) => {
    try {
        const aiTrips = await AITrip.findAll({ 
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(aiTrips);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getAITripById = async (req, res) => {
    try {
        const { tripId } = req.params;
        const trip = await AITrip.findOne({ where: { id: tripId, userId: req.user.id } });
        if (trip) {
            res.status(200).json(trip);
        } else {
            res.status(404).json({ message: 'Trip not found or you do not have permission to view it.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
