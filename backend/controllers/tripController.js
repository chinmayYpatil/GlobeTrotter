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
        let finalBudget = { total: 0 };
        if (typeof budget === 'object' && budget !== null && budget.total !== undefined) {
            finalBudget = budget;
        } else if (typeof budget === 'number') {
            finalBudget = { total: budget };
        }

        const newTrip = await Trip.create({
            name, description, coverImage, startDate, endDate,
            budget: finalBudget,
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
        
        const formattedTrips = trips.map(trip => {
            const tripJSON = trip.toJSON();
            if (typeof tripJSON.budget === 'string') {
                try {
                    tripJSON.budget = JSON.parse(tripJSON.budget);
                } catch (e) {
                    tripJSON.budget = { total: 0 };
                }
            }
            return tripJSON;
        });
        res.status(200).json(formattedTrips);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

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

// --- IMPROVED AI Trip Generation Logic ---
const createAITripPrompt = (tripData) => {
    const { destination, noOfDays, budget, traveler } = tripData;
    
    // Map destinations to better-known places
    const destinationMap = {
        'Aravalli': 'Mount Abu and surrounding Aravalli Hills region',
        'Banaskantha': 'Palanpur, Ambaji temple area in North Gujarat',
        'Bharuch': 'Bharuch city on Narmada River, Gujarat',
        'Bhavnagar': 'Bhavnagar city and Palitana Jain temples, Gujarat',
        'Kutch': 'Rann of Kutch, Bhuj, and White Desert region, Gujarat',
        'Ahmedabad': 'Ahmedabad, largest city in Gujarat',
        'Surat': 'Surat, diamond and textile city of Gujarat',
        'Vadodara': 'Vadodara (Baroda), cultural capital of Gujarat',
        'Rajkot': 'Rajkot, industrial hub of Gujarat',
        'Gandhinagar': 'Gandhinagar, planned capital city of Gujarat',
        'Jamnagar': 'Jamnagar, brass city of Gujarat',
        'Junagadh': 'Junagadh city near Gir Forest, Gujarat',
        'Gir Somnath': 'Somnath Temple and Gir National Park area',
        'Dwarka': 'Dwarka, Krishna\'s holy city in Gujarat',
        'Porbandar': 'Porbandar, birthplace of Mahatma Gandhi'
    };

    const enhancedDestination = destinationMap[destination] || `${destination}, Gujarat, India`;
    
    return `You are a professional travel planner. Create a detailed ${noOfDays}-day travel itinerary for ${enhancedDestination}. 

Trip Details:
- Destination: ${enhancedDestination}
- Duration: ${noOfDays} days
- Budget: ${budget} 
- Group: ${traveler}

CRITICAL REQUIREMENTS:
1. Return ONLY valid JSON - no additional text
2. Use real places and attractions from the specified region
3. Include popular tourist spots, local cuisine, and cultural experiences
4. Use realistic Indian Rupee prices (₹)
5. Provide actual hotel names and places where possible
6. Use proper latitude/longitude coordinates for the region

Return this EXACT JSON structure:

{
  "tripData": [{
    "travelPlan": {
      "location": "${enhancedDestination}",
      "duration": "${noOfDays} Day(s)",
      "budget": "${budget}",
      "groupSize": "${traveler}",
      "hotelOptions": [
        {
          "hotelName": "Hotel Palace",
          "hotelAddress": "Main Road, ${destination}",
          "price": "₹2000-3500 per night",
          "hotelImageUrl": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300",
          "geoCoordinates": {"latitude": 23.0225, "longitude": 72.5714},
          "rating": 4.2,
          "description": "Comfortable hotel with modern amenities"
        }
      ],
      "itinerary": {
        ${Array.from({length: parseInt(noOfDays)}, (_, i) => `
        "day${i + 1}": {
          "morning": {
            "placeName": "Morning Attraction Day ${i + 1}",
            "placeDetails": "Detailed description of morning activities and sightseeing",
            "placeImageUrl": "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300",
            "geoCoordinates": {"latitude": 23.0225, "longitude": 72.5714},
            "ticketPricing": "₹100-200",
            "timeToSpend": "2-3 hours",
            "travelTime": "30 minutes from hotel"
          },
          "afternoon": {
            "placeName": "Afternoon Attraction Day ${i + 1}",
            "placeDetails": "Description of afternoon activities and experiences",
            "placeImageUrl": "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300",
            "geoCoordinates": {"latitude": 23.0325, "longitude": 72.5814},
            "ticketPricing": "₹150-300",
            "timeToSpend": "3-4 hours",
            "travelTime": "20 minutes"
          },
          "evening": {
            "placeName": "Evening Activity Day ${i + 1}",
            "placeDetails": "Evening entertainment, dining, or cultural activities",
            "placeImageUrl": "https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&h=300",
            "geoCoordinates": {"latitude": 23.0125, "longitude": 72.5614},
            "ticketPricing": "₹200-500",
            "timeToSpend": "2-3 hours",
            "travelTime": "15 minutes"
          },
          "bestTimeToVisit": "October to March"
        }${i < parseInt(noOfDays) - 1 ? ',' : ''}`).join('')}
      }
    }
  }]
}`;
};

const callGeminiAPI = async (prompt) => {
    const apiKey = process.env.GOOGLE_GEMINI_AI_API_KEY;
    if (!apiKey) throw new Error('Google Gemini API key not found in backend .env file.');

    const modelName = 'gemini-1.5-flash-latest';
    
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.4,
                        topK: 32,
                        topP: 1,
                        maxOutputTokens: 4096,
                    }
                })
            }
        );

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`AI API request failed: ${response.status} ${response.statusText} - ${errorBody}`);
        }
        
        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts[0]) {
            throw new Error('Invalid response structure from AI API.');
        }
        
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw error;
    }
};

const parseAIResponse = (aiResponse) => {
    console.log("Raw AI Response:", aiResponse);
    
    try {
        // First, try to find JSON boundaries
        const firstBracket = aiResponse.indexOf('{');
        const lastBracket = aiResponse.lastIndexOf('}');

        if (firstBracket === -1 || lastBracket === -1) {
            throw new Error('No valid JSON object found in the AI response.');
        }

        let jsonString = aiResponse.substring(firstBracket, lastBracket + 1);
        
        // Clean the JSON string
        jsonString = jsonString
            // Remove control characters
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
            // Replace newlines and carriage returns with spaces
            .replace(/\n/g, ' ')
            .replace(/\r/g, ' ')
            // Remove trailing commas before closing brackets
            .replace(/,\s*([}\]])/g, '$1')
            // Fix any unquoted keys
            .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
            // Remove any extra spaces
            .replace(/\s+/g, ' ')
            .trim();

        console.log("Cleaned JSON String:", jsonString);

        // Try to parse the cleaned JSON
        const parsedData = JSON.parse(jsonString);
        console.log("Successfully parsed JSON:", parsedData);
        
        // Validate the structure
        if (!parsedData.tripData || !Array.isArray(parsedData.tripData) || parsedData.tripData.length === 0) {
            throw new Error('Invalid trip data structure in AI response');
        }

        return parsedData;

    } catch (error) {
        console.error("JSON Parsing Error:", error.message);
        console.error("Failed JSON String:", aiResponse);
        
        // If parsing fails, return a fallback structure
        const fallbackData = createFallbackTripData();
        console.log("Using fallback trip data");
        return fallbackData;
    }
};

const createFallbackTripData = () => {
    return {
        "tripData": [{
            "travelPlan": {
                "location": "Gujarat, India",
                "duration": "3 Day(s)",
                "budget": "moderate",
                "groupSize": "2 people",
                "hotelOptions": [{
                    "hotelName": "Heritage Hotel",
                    "hotelAddress": "City Center, Gujarat",
                    "price": "₹2500-3500 per night",
                    "hotelImageUrl": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300",
                    "geoCoordinates": {"latitude": 23.0225, "longitude": 72.5714},
                    "rating": 4.0,
                    "description": "Comfortable accommodation with local charm"
                }],
                "itinerary": {
                    "day1": {
                        "morning": {
                            "placeName": "City Heritage Walk",
                            "placeDetails": "Explore the historical areas and local markets",
                            "placeImageUrl": "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300",
                            "geoCoordinates": {"latitude": 23.0225, "longitude": 72.5714},
                            "ticketPricing": "₹100",
                            "timeToSpend": "2-3 hours",
                            "travelTime": "15 minutes"
                        },
                        "afternoon": {
                            "placeName": "Local Museum Visit",
                            "placeDetails": "Learn about local culture and history",
                            "placeImageUrl": "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300",
                            "geoCoordinates": {"latitude": 23.0325, "longitude": 72.5814},
                            "ticketPricing": "₹200",
                            "timeToSpend": "3 hours",
                            "travelTime": "20 minutes"
                        },
                        "evening": {
                            "placeName": "Sunset Point",
                            "placeDetails": "Enjoy beautiful sunset views and local snacks",
                            "placeImageUrl": "https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&h=300",
                            "geoCoordinates": {"latitude": 23.0125, "longitude": 72.5614},
                            "ticketPricing": "Free",
                            "timeToSpend": "2 hours",
                            "travelTime": "25 minutes"
                        },
                        "bestTimeToVisit": "October to March"
                    }
                }
            }
        }]
    };
};

export const generateAITrip = async (req, res) => {
    try {
        console.log('Generating AI trip with user selection:', req.body);
        
        const userSelection = req.body;
        
        // Validate input
        if (!userSelection.destination || !userSelection.noOfDays || !userSelection.budget || !userSelection.traveler) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required fields: destination, noOfDays, budget, or traveler' 
            });
        }

        const prompt = createAITripPrompt(userSelection);
        console.log('Generated prompt for AI:', prompt.substring(0, 200) + '...');
        
        const aiResponseText = await callGeminiAPI(prompt);
        console.log('Received AI response, length:', aiResponseText.length);
        
        const parsedTripData = parseAIResponse(aiResponseText);
        console.log('Parsed trip data successfully');
        
        const docId = Date.now().toString();

        const newAITrip = await AITrip.create({
            id: docId,
            tripData: parsedTripData.tripData,
            userSelection: userSelection,
            userEmail: req.user.email,
            userId: req.user.id
        });

        console.log('AI trip saved to database with ID:', docId);
        res.status(201).json({ success: true, trip: newAITrip });
        
    } catch (error) {
        console.error('Error in generateAITrip controller:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to generate trip with AI. ' + error.message 
        });
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