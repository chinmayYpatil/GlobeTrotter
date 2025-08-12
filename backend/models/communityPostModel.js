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
    images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
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
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    },
});

User.hasMany(CommunityPost, { foreignKey: 'userId' });
CommunityPost.belongsTo(User, { foreignKey: 'userId' });

export default CommunityPost;