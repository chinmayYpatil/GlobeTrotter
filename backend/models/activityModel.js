import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Activity = sequelize.define('Activity', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    type: {
        type: DataTypes.STRING,
    },
    image: {
        type: DataTypes.STRING,
    },
    cost: {
        type: DataTypes.FLOAT,
    },
    duration: {
        type: DataTypes.FLOAT,
    },
    rating: {
        type: DataTypes.FLOAT,
    },
    groupSize: {
        type: DataTypes.STRING,
    },
    location: {
        type: DataTypes.STRING,
    },
    availability: {
        type: DataTypes.STRING,
    },
    difficulty: {
        type: DataTypes.STRING,
    }
});

export default Activity;