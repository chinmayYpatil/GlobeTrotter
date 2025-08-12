import CommunityPost from '../models/communityPostModel.js';
import Comment from '../models/commentModel.js';
import User from '../models/userModel.js';
import { Op } from 'sequelize';

// New function to handle image uploads for posts
export const uploadImage = async (req, res) => {
    // In a real application, you'd use multer here to process the file
    // and upload it to a cloud storage service (e.g., S3, Cloudinary).
    try {
        // For demonstration, we'll just return a new placeholder URL.
        const imageUrl = `https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=500&h=300&fit=crop&t=${Date.now()}`;
        
        res.status(200).json({ 
            message: 'Image uploaded successfully',
            imageUrl: imageUrl 
        });
    } catch (error) {
        res.status(500).json({ message: 'Image upload failed', error: error.message });
    }
};


export const getPosts = async (req, res) => {
    try {
        const { searchQuery, category, sortBy } = req.query;
        const where = {};
        if (searchQuery) {
            where[Op.or] = [
                { content: { [Op.iLike]: `%${searchQuery}%` } },
                { tripName: { [Op.iLike]: `%${searchQuery}%` } },
                { tripLocation: { [Op.iLike]: `%${searchQuery}%` } },
            ];
        }
        if (category && category !== 'all') {
            where.category = category;
        }

        let order = [['createdAt', 'DESC']];
        if (sortBy === 'popular') {
            order = [['likes', 'DESC']];
        } else if (sortBy === 'views') {
            order = [['views', 'DESC']];
        }

        const posts = await CommunityPost.findAll({
            where,
            order,
            include: [
                { 
                    model: User, 
                    attributes: ['displayName', 'photo', 'city'] 
                }, 
                { 
                    model: Comment, 
                    include: [{
                        model: User,
                        attributes: ['displayName', 'photo']
                    }] 
                }
            ]
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const createPost = async (req, res) => {
    try {
        const { title, content, category, location, duration, cost, rating, tags, images } = req.body;
        const newPost = await CommunityPost.create({
            content,
            tripName: title,
            tripLocation: location,
            tripDuration: duration,
            tripCost: cost,
            tripRating: rating,
            images, // Expecting an array with the new image URL
            category,
            tags,
            userId: req.user.id
        });
        const postWithUser = await CommunityPost.findByPk(newPost.id, {
            include: [{ model: User, attributes: ['displayName', 'photo', 'city'] }, { model: Comment, include: [User]}]
        });
        res.status(201).json(postWithUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const likePost = async (req, res) => {
    try {
        const post = await CommunityPost.findByPk(req.params.id);
        if (post) {
            post.likes += 1;
            await post.save();
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const createComment = async (req, res) => {
    try {
        const { content } = req.body;
        const newComment = await Comment.create({
            content,
            userId: req.user.id,
            postId: req.params.id
        });
        const commentWithUser = await Comment.findByPk(newComment.id, { 
            include: [{
                model: User,
                attributes: ['displayName', 'photo']
            }] 
        });
        res.status(201).json(commentWithUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};