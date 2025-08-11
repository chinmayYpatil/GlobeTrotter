import City from '../models/cityModel.js';

const seedCities = async () => {
    const cities = [
        {
            name: 'Paris',
            country: 'France',
            image: 'https://images.pexels.com/photos/161853/eiffel-tower-paris-france-tower-161853.jpeg?auto=compress&cs=tinysrgb&w=400',
            costIndex: 85,
            popularity: 95,
            description: 'The City of Light, known for its art, fashion, and cuisine',
        },
        {
            name: 'Rome',
            country: 'Italy',
            image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=400',
            costIndex: 75,
            popularity: 90,
            description: 'The Eternal City, rich in history and architectural wonders',
        },
        {
            name: 'Barcelona',
            country: 'Spain',
            image: 'https://images.pexels.com/photos/819764/pexels-photo-819764.jpeg?auto=compress&cs=tinysrgb&w=400',
            costIndex: 70,
            popularity: 85,
            description: 'Architectural marvels and Mediterranean charm'
        },
        {
            name: 'Bali',
            country: 'Indonesia',
            image: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400',
            costIndex: 45,
            popularity: 92,
            description: 'Tropical paradise with stunning beaches and culture'
        },
        {
            name: 'New York',
            country: 'USA',
            image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=400',
            costIndex: 95,
            popularity: 93,
            description: 'The city that never sleeps, full of endless possibilities'
        },
        {
            name: 'Sydney',
            country: 'Australia',
            image: 'https://images.pexels.com/photos/2193300/pexels-photo-2193300.jpeg?auto=compress&cs=tinysrgb&w=400',
            costIndex: 88,
            popularity: 89,
            description: 'Iconic opera house, beautiful harbor, and vibrant culture.'
        },
        {
            name: 'Rio de Janeiro',
            country: 'Brazil',
            image: 'https://images.pexels.com/photos/287237/pexels-photo-287237.jpeg?auto=compress&cs=tinysrgb&w=400',
            costIndex: 60,
            popularity: 87,
            description: 'Famous for its carnival, beaches, and the Christ the Redeemer statue.'
        },
        {
            name: 'Cairo',
            country: 'Egypt',
            image: 'https://images.pexels.com/photos/1699419/pexels-photo-1699419.jpeg?auto=compress&cs=tinysrgb&w=400',
            costIndex: 30,
            popularity: 82,
            description: 'Home to ancient pyramids and a bustling city life along the Nile.'
        },
        {
            name: 'Prague',
            country: 'Czech Republic',
            image: 'https://images.pexels.com/photos/1530259/pexels-photo-1530259.jpeg?auto=compress&cs=tinysrgb&w=400',
            costIndex: 55,
            popularity: 86,
            description: 'A fairy-tale city with a rich history and stunning architecture.'
        },
        {
            name: 'Cape Town',
            country: 'South Africa',
            image: 'https://images.pexels.com/photos/2779863/pexels-photo-2779863.jpeg?auto=compress&cs=tinysrgb&w=400',
            costIndex: 50,
            popularity: 84,
            description: 'Stunning landscapes where mountains meet the sea.'
        },
        {
            name: 'Bangkok',
            country: 'Thailand',
            image: 'https://images.pexels.com/photos/373912/pexels-photo-373912.jpeg?auto=compress&cs=tinysrgb&w=400',
            costIndex: 40,
            popularity: 91,
            description: 'A city of contrasts with ornate shrines and vibrant street life.'
        },
        {
            name: 'Amsterdam',
            country: 'Netherlands',
            image: 'https://images.pexels.com/photos/208709/pexels-photo-208709.jpeg?auto=compress&cs=tinysrgb&w=400',
            costIndex: 80,
            popularity: 88,
            description: 'Famous for its canals, artistic heritage, and cycling culture.'
        },
        {
            name: 'Dubai',
            country: 'UAE',
            image: 'https://images.pexels.com/photos/3787839/pexels-photo-3787839.jpeg?auto=compress&cs=tinysrgb&w=400',
            costIndex: 92,
            popularity: 90,
            description: 'A futuristic city known for luxury shopping and ultramodern architecture.'
        },
        {
            name: 'Santorini',
            country: 'Greece',
            image: 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=400',
            costIndex: 78,
            popularity: 94,
            description: 'Iconic blue-domed churches, stunning sunsets, and beautiful beaches.'
        }
    ];

    // Check if cities already exist to avoid duplication
    const cityCount = await City.count();
    if (cityCount === 0) {
        await City.bulkCreate(cities);
        console.log('Cities have been seeded');
    } else {
        console.log('Cities already exist in the database.');
    }
};

export default seedCities;