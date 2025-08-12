// backend/config/db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load env variables
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Neon requires SSL without strict cert checks
    },
  },
  logging: false, // Change to console.log if you want SQL logs
});

export { sequelize };
