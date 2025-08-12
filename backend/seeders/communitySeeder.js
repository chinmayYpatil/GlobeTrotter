import CommunityPost from '../models/communityPostModel.js';
import Comment from '../models/commentModel.js';
import User from '../models/userModel.js';

const seedCommunity = async () => {
    try {
        const postCount = await CommunityPost.count();
        if (postCount > 0) {
            console.log('Community posts already exist in the database.');
            return;
        }

        // Find users to associate with posts and comments
        const users = await User.findAll();
        if (users.length < 2) {
            console.log('Not enough users to seed community data. Please create more users.');
            return;
        }

        const postsData = [
            {
                user: users[0],
                content: "Just completed an amazing paragliding adventure in the Swiss Alps! The views were absolutely breathtaking and the experience was worth every penny. Highly recommend for adventure seekers!",
                tripName: "Swiss Alps Adventure",
                tripLocation: "Interlaken, Switzerland",
                tripDuration: "5 days",
                tripCost: "$2,500",
                tripRating: 4.9,
                images: [
                    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=300&fit=crop"
                ],
                category: "adventure",
                likes: 127,
                shares: 8,
                views: 1247,
                tags: ["paragliding", "switzerland", "mountains", "adventure"],
                comments: [{ user: users[1], content: 'Wow, looks amazing!' }]
            },
            {
                user: users[1],
                content: "Cultural immersion in Japan was incredible! From traditional tea ceremonies to modern Tokyo, every moment was filled with wonder. The food, the people, the history - everything exceeded expectations.",
                tripName: "Japan Cultural Journey",
                tripLocation: "Tokyo & Kyoto, Japan",
                tripDuration: "12 days",
                tripCost: "$3,800",
                tripRating: 4.8,
                images: [
                    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=500&h=300&fit=crop"
                ],
                category: "cultural",
                likes: 89,
                shares: 12,
                views: 892,
                tags: ["japan", "culture", "tokyo", "kyoto", "food"],
                comments: []
            },
            {
                user: users[0],
                content: "Relaxing beach vacation in Bali was exactly what I needed. Crystal clear waters, amazing sunsets, and the most peaceful atmosphere. Perfect for unwinding and reconnecting with nature.",
                tripName: "Bali Beach Retreat",
                tripLocation: "Ubud & Seminyak, Bali",
                tripDuration: "8 days",
                tripCost: "$1,900",
                tripRating: 4.7,
                images: [
                    "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=500&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop"
                ],
                category: "leisure",
                likes: 156,
                shares: 19,
                views: 1567,
                tags: ["bali", "beach", "relaxation", "nature", "sunset"],
                comments: []
            }
        ];

        for (const postData of postsData) {
            const post = await CommunityPost.create({
                content: postData.content,
                tripName: postData.tripName,
                tripLocation: postData.tripLocation,
                tripDuration: postData.tripDuration,
                tripCost: postData.tripCost,
                tripRating: postData.tripRating,
                images: postData.images,
                category: postData.category,
                likes: postData.likes,
                shares: postData.shares,
                views: postData.views,
                tags: postData.tags,
                userId: postData.user.id
            });

            for (const commentData of postData.comments) {
                await Comment.create({
                    content: commentData.content,
                    userId: commentData.user.id,
                    postId: post.id
                });
            }
        }

        console.log('Community posts and comments have been seeded');
    } catch (error) {
        console.error('Error seeding community data:', error);
    }
};

export default seedCommunity;