// backend/models/aiTripModel.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './userModel.js';

const AITrip = sequelize.define('AITrip', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    tripData: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    userSelection: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    userEmail: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

User.hasMany(AITrip, { foreignKey: 'userId' });
AITrip.belongsTo(User, { foreignKey: 'userId' });

export default AITrip;