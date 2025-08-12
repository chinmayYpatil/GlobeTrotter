import Activity from '../models/activityModel.js';

const seedActivities = async () => {
    const activities = [
        {
            name: "Agile Spoonbill Paragliding",
            description: "Experience the thrill of paragliding over stunning mountain landscapes with certified instructors. Perfect for beginners and experienced flyers alike.",
            type: "adventure",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
            cost: 120,
            duration: 3,
            rating: 4.8,
            groupSize: "2-6 people",
            location: "Mountain Peak Resort",
            availability: "Daily",
            difficulty: "Beginner"
        },
        {
            name: "Alive Bat Adventure Tours",
            description: "Explore hidden caves and discover the fascinating world of bats with expert guides. Educational and thrilling experience for nature lovers.",
            type: "adventure",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
            cost: 85,
            duration: 2,
            rating: 4.6,
            groupSize: "4-8 people",
            location: "Crystal Cave System",
            availability: "Weekends",
            difficulty: "Intermediate"
        },
        {
            name: "Sunset Mountain Hiking",
            description: "Guided sunset hike to the mountain summit with panoramic views and photography opportunities. Includes refreshments and safety equipment.",
            type: "leisure",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
            cost: 65,
            duration: 4,
            rating: 4.9,
            groupSize: "6-12 people",
            location: "Mountain Trailhead",
            availability: "Daily",
            difficulty: "Beginner"
        },
        {
            name: "Cultural Village Tour",
            description: "Immerse yourself in local culture with guided tours of traditional villages, artisan workshops, and authentic cuisine tasting.",
            type: "cultural",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
            cost: 45,
            duration: 5,
            rating: 4.7,
            groupSize: "8-15 people",
            location: "Heritage Village",
            availability: "Daily",
            difficulty: "All Levels"
        },
        {
            name: "River Rafting Experience",
            description: "White water rafting adventure through scenic river canyons. Professional guides ensure safety while providing an exhilarating experience.",
            type: "adventure",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
            cost: 95,
            duration: 3,
            rating: 4.8,
            groupSize: "6-8 people",
            location: "Rapid River",
            availability: "Seasonal",
            difficulty: "Intermediate"
        },
        {
            name: "Historical Castle Exploration",
            description: "Step back in time with guided tours of ancient castles, including hidden passages, royal chambers, and fascinating historical stories.",
            type: "historical",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
            cost: 35,
            duration: 2,
            rating: 4.5,
            groupSize: "10-20 people",
            location: "Royal Castle",
            availability: "Daily",
            difficulty: "All Levels"
        },
        {
            name: "Gourmet Food Safari",
            description: "Culinary adventure through local markets, street food stalls, and hidden restaurants. Taste authentic flavors and learn cooking secrets.",
            type: "food",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
            cost: 75,
            duration: 4,
            rating: 4.9,
            groupSize: "4-8 people",
            location: "Food District",
            availability: "Daily",
            difficulty: "All Levels"
        },
        {
            name: "Artisan Craft Workshop",
            description: "Learn traditional crafts from master artisans. Create your own souvenirs while supporting local craftsmanship and cultural heritage.",
            type: "cultural",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
            cost: 55,
            duration: 3,
            rating: 4.6,
            groupSize: "6-10 people",
            location: "Craft Center",
            availability: "Weekdays",
            difficulty: "All Levels"
        }
    ];

    const activityCount = await Activity.count();
    if (activityCount === 0) {
        await Activity.bulkCreate(activities);
        console.log('Activities have been seeded');
    } else {
        console.log('Activities already exist in the database.');
    }
};

export default seedActivities;