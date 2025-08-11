import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './userModel.js';

const Trip = sequelize.define('Trip', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: false,
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
        type: DataTypes.DECIMAL(10, 2),
    },
    notes: {
        type: DataTypes.TEXT,
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