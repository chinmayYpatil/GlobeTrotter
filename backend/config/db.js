// backend/config/db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Configure Sequelize to connect to your PostgreSQL database
const sequelize = new Sequelize(
    process.env.PGDATABASE,
    process.env.PGUSER,
    process.env.PGPASSWORD,
    {
        host: process.env.PGHOST,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // This is important for cloud-hosted databases like Neon
            }
        },
        logging: false // Set to console.log to see SQL queries if you need to debug
    }
);

export { sequelize };