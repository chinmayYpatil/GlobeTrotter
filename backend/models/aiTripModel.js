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
        type: DataTypes.TEXT, // Use TEXT instead of JSONB for SQLite
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('tripData');
            return rawValue ? JSON.parse(rawValue) : null;
        },
        set(value) {
            this.setDataValue('tripData', JSON.stringify(value));
        }
    },
    userSelection: {
        type: DataTypes.TEXT, // Use TEXT instead of JSONB for SQLite
        allowNull: false,
        get() {
            const rawValue = this.getDataValue('userSelection');
            return rawValue ? JSON.parse(rawValue) : null;
        },
        set(value) {
            this.setDataValue('userSelection', JSON.stringify(value));
        }
    },
    userEmail: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

User.hasMany(AITrip, { foreignKey: 'userId' });
AITrip.belongsTo(User, { foreignKey: 'userId' });

export default AITrip;