// backend/models/communityPostModel.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './userModel.js';

const CommunityPost = sequelize.define('CommunityPost', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    tripName: {
        type: DataTypes.STRING,
    },
    tripLocation: {
        type: DataTypes.STRING,
    },
    tripDuration: {
        type: DataTypes.STRING,
    },
    tripCost: {
        type: DataTypes.STRING,
    },
    tripRating: {
        type: DataTypes.FLOAT,
    },
    // Convert array to TEXT for SQLite compatibility
    images: {
        type: DataTypes.TEXT,
        get() {
            const rawValue = this.getDataValue('images');
            try {
                return rawValue ? JSON.parse(rawValue) : [];
            } catch (e) {
                return [];
            }
        },
        set(value) {
            this.setDataValue('images', JSON.stringify(value || []));
        }
    },
    category: {
        type: DataTypes.STRING,
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    shares: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    // Convert array to TEXT for SQLite compatibility
    tags: {
        type: DataTypes.TEXT,
        get() {
            const rawValue = this.getDataValue('tags');
            try {
                return rawValue ? JSON.parse(rawValue) : [];
            } catch (e) {
                return [];
            }
        },
        set(value) {
            this.setDataValue('tags', JSON.stringify(value || []));
        }
    },
});

User.hasMany(CommunityPost, { foreignKey: 'userId' });
CommunityPost.belongsTo(User, { foreignKey: 'userId' });

export default CommunityPost;