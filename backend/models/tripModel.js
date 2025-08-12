// backend/models/tripModel.js
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
        type: DataTypes.TEXT, // Use TEXT instead of JSONB for SQLite
        defaultValue: '{"total":0,"breakdown":{}}',
        get() {
            const rawValue = this.getDataValue('budget');
            try {
                return rawValue ? JSON.parse(rawValue) : { total: 0 };
            } catch (e) {
                return { total: 0 };
            }
        },
        set(value) {
            this.setDataValue('budget', JSON.stringify(value));
        }
    },
    shareId: {
        type: DataTypes.STRING,
        unique: true,
    },
    userEmail: {
        type: DataTypes.STRING,
        allowNull: true,
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