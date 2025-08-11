import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import { sequelize } from './config/db.js';

// Load environment variables
dotenv.config();

// Import Models to sync them
import './models/userModel.js';
import './models/tripModel.js';
import City from './models/cityModel.js'; // Import the City model

// Route and Config imports
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import './config/passport.js';
import seedCities from './seeders/citySeeder.js'; // Import the seeder

const app = express();
const PORT = process.env.PORT || 3001;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        
        await sequelize.sync({ force: true });
        console.log('All models were synchronized successfully.');

        // Seed the database
        const cityCount = await City.count();
        if (cityCount === 0) {
            await seedCities();
        }

        app.use(express.json());
        app.use(
            cors({
                origin: 'http://localhost:5173',
                credentials: true,
            })
        );
        app.use(helmet());
        app.use(morgan('dev'));

        app.use(
            session({
                secret: process.env.SESSION_SECRET || 'dev-secret',
                resave: false,
                saveUninitialized: false,
                cookie: {
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                },
            })
        );

        app.use(passport.initialize());
        app.use(passport.session());

        app.use('/api/products', productRoutes);
        app.use('/auth', authRoutes);
        app.use('/api/dashboard', dashboardRoutes);
        app.use('/api/trips', tripRoutes);

        app.listen(PORT, () => {
            console.log(`✅ Server is running and listening on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Unable to start the server:', error);
        process.exit(1);
    }
};

startServer();