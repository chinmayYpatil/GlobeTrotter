import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './userModel.js';

const Trip = sequelize.define('Trip', {
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
    coverImage: {
        type: DataTypes.STRING,
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    budget: {
        type: DataTypes.JSONB,
        // The defaultValue needs to be a string for the database
        defaultValue: '{"total":0,"breakdown":{}}', 
    },
    shareId: {
        type: DataTypes.STRING,
        unique: true,
    },
});

// Define the Relationship
User.hasMany(Trip, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
});
Trip.belongsTo(User, {
    foreignKey: 'userId',
});

export default Trip;