import { collection, addDoc, doc, setDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

// AI Trip Generation Service
export const generateAITrip = async (tripData) => {
  try {
    if (!tripData.userId) {
      throw new Error('userId is required in tripData before generating trip');
    }

    const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
    if (!apiKey) {
      throw new Error('Google Gemini API key not found');
    }

    // Create the prompt for the AI
    const prompt = createAITripPrompt(tripData);

    // Call Google Gemini API
    const aiResponse = await callGeminiAPI(prompt, apiKey);

    // Parse the AI response and create trip structure
    const generatedTrip = parseAIResponse(aiResponse, tripData);

    // Store in Firebase
    const tripId = await storeTripInFirebase(generatedTrip);

    return {
      success: true,
      tripId: tripId,
      trip: generatedTrip
    };
  } catch (error) {
    console.error('Error in generateAITrip:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const createAITripPrompt = (tripData) => {
  const { destination, noOfDays, budget, traveler, startDate, endDate } = tripData;

  return `Create a detailed travel itinerary for a ${noOfDays}-day trip to ${destination} with the following specifications:

Travel Details:
- Destination: ${destination}
- Duration: ${noOfDays} days
- Budget Level: ${budget}
- Travel Group: ${traveler}
- Travel Dates: ${startDate} to ${endDate}

Please provide a comprehensive itinerary in the following JSON format:

{
  "tripName": "Creative trip name",
  "description": "Brief description of the trip",
  "destination": "${destination}",
  "duration": ${noOfDays},
  "budget": "${budget}",
  "travelGroup": "${traveler}",
  "startDate": "${startDate}",
  "endDate": "${endDate}",
  "totalBudget": {
    "amount": "estimated total cost",
    "currency": "INR"
  },
  "itinerary": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "title": "Day 1 Title",
      "description": "Day overview",
      "activities": [
        {
          "time": "09:00",
          "title": "Activity title",
          "description": "Activity description",
          "location": "Location name",
          "duration": "2 hours",
          "cost": "₹500",
          "type": "sightseeing/food/adventure/culture"
        }
      ],
      "accommodation": {
        "name": "Hotel name",
        "type": "hotel/hostel/guesthouse",
        "cost": "₹2000",
        "description": "Accommodation description"
      },
      "meals": [
        {
          "type": "breakfast/lunch/dinner",
          "suggestion": "Restaurant name",
          "cost": "₹300",
          "description": "Meal description"
        }
      ]
    }
  ],
  "highlights": [
    "Key highlight 1",
    "Key highlight 2",
    "Key highlight 3"
  ],
  "tips": [
    "Travel tip 1",
    "Travel tip 2",
    "Travel tip 3"
  ],
  "packingList": [
    "Essential item 1",
    "Essential item 2",
    "Essential item 3"
  ]
}

Important guidelines:
1. Make the itinerary realistic and practical for the given duration
2. Consider the budget level (cheap: focus on budget-friendly options, moderate: balanced options, luxury: premium experiences)
3. Adapt activities for the travel group size and type
4. Include a mix of sightseeing, local experiences, and relaxation
5. Provide specific locations, timings, and estimated costs
6. Make sure all JSON is properly formatted and valid
7. Focus on ${destination} specific attractions and experiences
8. Consider local culture, weather, and seasonal factors`;
};

const callGeminiAPI = async (prompt, apiKey) => {
  try {
    const modelName = 'gemini-2.0-flash'; // can be changed to a supported model
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    throw new Error('Invalid response format from Gemini API');
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to generate trip with AI');
  }
};

const parseAIResponse = (aiResponse, tripData) => {
  try {
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in AI response');
    }

    const parsedTrip = JSON.parse(jsonMatch[0]);

    return {
      ...parsedTrip,
      id: generateTripId(),
      userId: tripData.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isAIGenerated: true,
      status: 'active'
    };
  } catch (error) {
    console.error('Error parsing AI response:', error);
    throw new Error('Failed to parse AI-generated trip data');
  }
};

const generateTripId = () => {
  return 'trip_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
};

const storeTripInFirebase = async (tripData) => {
  try {
    if (!tripData.userId) {
      throw new Error('userId is required to store trip');
    }

    const tripRef = await addDoc(collection(db, 'trips'), {
      ...tripData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const userTripRef = doc(db, 'users', tripData.userId, 'trips', tripRef.id);
    await setDoc(userTripRef, {
      ...tripData,
      tripId: tripRef.id,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return tripRef.id;
  } catch (error) {
    console.error('Error storing trip in Firebase:', error);
    throw error;
  }
};

export const getAIGeneratedTrips = async (userId) => {
  try {
    if (!userId) throw new Error('userId is required to fetch trips');
    const userTripsRef = collection(db, 'users', userId, 'trips');
    const q = query(userTripsRef, where('isAIGenerated', '==', true));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching AI trips:', error);
    throw new Error('Failed to fetch AI generated trips');
  }
};
