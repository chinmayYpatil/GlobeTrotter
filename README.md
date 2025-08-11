# GlobeTrotter-Group 81

## Tech Stack
PERN stack (PostgreSQL, Express.js, React, Node.js)

## Features

### AI-Powered Trip Generation
- **Google Gemini AI Integration**: Uses Google's Gemini AI to generate personalized travel itineraries
- **Smart Trip Planning**: Creates comprehensive trip plans based on destination, budget, travel group, and dates
- **Firebase Integration**: Stores generated trips securely in Firebase Firestore
- **Real-time Generation**: AI generates complete itineraries with activities, accommodations, and budget estimates

### Trip Planning Features
- **Destination Selection**: Choose from 30+ destinations in Gujarat, India
- **Budget Customization**: Select from cheap, moderate, or luxury budget levels
- **Travel Group Options**: Plan for solo travel, couples, families, or groups of friends
- **Date Range Selection**: Set custom start and end dates for your trip
- **Comprehensive Itineraries**: Get day-by-day plans with activities, meals, and accommodation

### User Experience
- **Animated Modal**: Smooth animations when accessing trip planning options
- **Loading States**: Beautiful loading animations during AI generation
- **Form Validation**: Comprehensive validation for all user inputs
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project
- Google Gemini AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GlobeTrotter
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   
   Create `.env` files in both backend and frontend directories:
   
   **Frontend (.env)**
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GOOGLE_GEMINI_AI_API_KEY=your_gemini_api_key
   VITE_API_URL=http://localhost:5000
   ```

4. **Start the application**
   ```bash
   # Start backend server
   cd backend
   npm start
   
   # Start frontend development server
   cd ../frontend
   npm run dev
   ```

## API Integration

### Google Gemini AI
The application uses Google Gemini AI to generate personalized travel itineraries. The AI considers:
- Destination preferences and local attractions
- Budget constraints and cost optimization
- Travel group size and dynamics
- Trip duration and time management
- Seasonal factors and local culture

### Firebase Firestore
All generated trips are stored in Firebase Firestore with the following structure:
- User-specific trip collections
- Comprehensive itinerary data
- Budget and accommodation details
- Activity schedules and recommendations

## File Structure

```
GlobeTrotter/
├── frontend/
│   ├── src/
│   │   ├── screens/
│   │   │   └── BuildTripAI.jsx          # AI trip generation form
│   │   ├── services/
│   │   │   └── aiTripService.js         # AI and Firebase integration
│   │   ├── config/
│   │   │   └── firebase.js              # Firebase configuration
│   │   └── components/
│   │       ├── TripPlanningModal.jsx    # Modal with AI option
│   │       └── AIGenerationLoader.jsx   # Loading component
│   └── AI_TRIP_SETUP.md                 # Detailed setup guide
└── backend/
    └── ...                              # Backend files
```

## Usage

1. **Access AI Trip Generation**: Click "Plan a trip" on the dashboard
2. **Choose AI Option**: Select "Build a trip with AI" from the modal
3. **Fill Trip Details**: Enter destination, duration, budget, travel group, and dates
4. **Generate Trip**: Click "Generate Trip" to create your personalized itinerary
5. **View Results**: Navigate to the generated trip to see your complete itinerary

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

