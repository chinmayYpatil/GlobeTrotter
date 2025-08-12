// backend/config/db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// For development, use SQLite instead of PostgreSQL to avoid connection issues
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // This will create a local SQLite file
    logging: false, // Set to console.log to see SQL queries if you need to debug
    define: {
        // These options help with compatibility
        freezeTableName: true,
        timestamps: true
    }
});

export { sequelize };