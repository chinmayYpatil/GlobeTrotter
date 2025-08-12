import dotenv from 'dotenv';
// Load environment variables at the very top
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { sequelize } from './config/db.js';

// Import Models to sync them
import './models/userModel.js';
import './models/tripModel.js';
import City from './models/cityModel.js';
import './models/activityModel.js';
import './models/communityPostModel.js';
import './models/commentModel.js';
import './models/aiTripModel.js'; // <-- Added sync for the new model

// Route and Config imports
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import './config/passport.js';
import seedCities from './seeders/citySeeder.js';
import seedActivities from './seeders/activitySeeder.js';
import seedCommunity from './seeders/communitySeeder.js';

const app = express();
const PORT = process.env.PORT || 3001;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        await sequelize.sync({ alter: true });
        console.log('All models were synchronized successfully.');

        // Seed the database
        await seedCities();
        await seedActivities();
        await seedCommunity();

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

        app.use('/auth', authRoutes);
        app.use('/api/dashboard', dashboardRoutes);
        app.use('/api/trips', tripRoutes);
        app.use('/api/activities', activityRoutes);
        app.use('/api/community', communityRoutes);

        app.listen(PORT, () => {
            console.log(`✅ Server is running and listening on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Unable to start the server:', error);
        process.exit(1);
    }
};

startServer();