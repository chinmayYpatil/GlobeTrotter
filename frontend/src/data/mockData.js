export const mockTrips = [
  {
    id: '1',
    name: 'European Adventure',
    startDate: '2024-06-15',
    endDate: '2024-06-25',
    description: 'A magical journey through Europe\'s most beautiful cities',
    coverImage: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: '2024-01-15T10:00:00Z',
    shareId: 'abc123def',
    budget: {
      total: 2500,
      breakdown: { transport: 800, accommodation: 1000, activities: 400, food: 300 }
    },
    stops: [
      {
        id: '1',
        cityId: '1',
        startDate: '2024-06-15',
        endDate: '2024-06-18',
        activities: ['1', '2']
      },
      {
        id: '2',
        cityId: '2',
        startDate: '2024-06-18',
        endDate: '2024-06-22',
        activities: ['3', '4']
      }
    ]
  },
  {
    id: '2',
    name: 'Asia Discovery',
    startDate: '2024-08-01',
    endDate: '2024-08-15',
    description: 'Exploring the vibrant cultures and cuisines of Asia',
    coverImage: 'https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: '2024-02-01T10:00:00Z',
    shareId: 'xyz789ghi',
    budget: {
      total: 3200,
      breakdown: { transport: 1200, accommodation: 800, activities: 600, food: 600 }
    },
    stops: []
  }
];

export const mockCities = [
  {
    id: '1',
    name: 'Paris',
    country: 'France',
    image: 'https://images.pexels.com/photos/161853/eiffel-tower-paris-france-tower-161853.jpeg?auto=compress&cs=tinysrgb&w=400',
    costIndex: 85,
    popularity: 95,
    description: 'The City of Light, known for its art, fashion, and cuisine'
  },
  {
    id: '2',
    name: 'Rome',
    country: 'Italy',
    image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=400',
    costIndex: 75,
    popularity: 90,
    description: 'The Eternal City, rich in history and architectural wonders'
  },
  {
    id: '3',
    name: 'Tokyo',
    country: 'Japan',
    image: 'https://images.pexels.com/photos/2411956/pexels-photo-2411956.jpeg?auto=compress&cs=tinysrgb&w=400',
    costIndex: 90,
    popularity: 88,
    description: 'A vibrant metropolis blending tradition and innovation'
  },
  {
    id: '4',
    name: 'Barcelona',
    country: 'Spain',
    image: 'https://images.pexels.com/photos/819764/pexels-photo-819764.jpeg?auto=compress&cs=tinysrgb&w=400',
    costIndex: 70,
    popularity: 85,
    description: 'Architectural marvels and Mediterranean charm'
  },
  {
    id: '5',
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400',
    costIndex: 45,
    popularity: 92,
    description: 'Tropical paradise with stunning beaches and culture'
  },
  {
    id: '6',
    name: 'New York',
    country: 'USA',
    image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=400',
    costIndex: 95,
    popularity: 93,
    description: 'The city that never sleeps, full of endless possibilities'
  }
];

export const mockActivities = [
  {
    id: '1',
    name: 'Eiffel Tower Visit',
    cityId: '1',
    type: 'sightseeing',
    cost: 25,
    duration: 3,
    description: 'Visit the iconic Eiffel Tower and enjoy panoramic views of Paris',
    image: 'https://images.pexels.com/photos/161853/eiffel-tower-paris-france-tower-161853.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8
  },
  {
    id: '2',
    name: 'Seine River Cruise',
    cityId: '1',
    type: 'leisure',
    cost: 15,
    duration: 1.5,
    description: 'Romantic cruise along the Seine River with dinner option',
    image: 'https://images.pexels.com/photos/1530259/pexels-photo-1530259.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.6
  },
  {
    id: '3',
    name: 'Colosseum Tour',
    cityId: '2',
    type: 'historical',
    cost: 20,
    duration: 2.5,
    description: 'Guided tour of the ancient Roman amphitheater',
    image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9
  },
  {
    id: '4',
    name: 'Vatican Museums',
    cityId: '2',
    type: 'cultural',
    cost: 30,
    duration: 4,
    description: 'Explore one of the world\'s greatest art collections',
    image: 'https://images.pexels.com/photos/2409681/pexels-photo-2409681.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7
  },
  {
    id: '5',
    name: 'Shibuya Crossing Experience',
    cityId: '3',
    type: 'cultural',
    cost: 0,
    duration: 1,
    description: 'Experience the world\'s busiest pedestrian crossing',
    image: 'https://images.pexels.com/photos/2411956/pexels-photo-2411956.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.5
  },
  {
    id: '6',
    name: 'Sagrada Familia Tour',
    cityId: '4',
    type: 'architectural',
    cost: 22,
    duration: 2,
    description: 'Visit Gaudí\'s masterpiece basilica',
    image: 'https://images.pexels.com/photos/819764/pexels-photo-819764.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8
  }
];