import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const City = sequelize.define('City', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
    },
    costIndex: {
        type: DataTypes.INTEGER,
    },
    popularity: {
        type: DataTypes.INTEGER,
    },
    description: {
        type: DataTypes.TEXT,
    },
});

export default City;