// backend/server.js
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import { sequelize } from "./config/db.js";

// Load environment variables
dotenv.config();

// Import Models to sync them
import './models/userModel.js';
import './models/tripModel.js';

// Route and Config imports
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import tripRoutes from './routes/tripRoutes.js';
import "./config/passport.js";

const app = express();
const PORT = process.env.PORT || 3001;

// --- Start Server Function ---
const startServer = async () => {
    try {
        // 1. Authenticate with the database
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        // 2. Sync models
        await sequelize.sync({ alter: true }); // Use alter:true to safely update tables
        console.log('All models were synchronized successfully.');

        // 3. Set up middlewares after successful DB connection
        app.use(express.json());
        app.use(cors({
            origin: 'http://localhost:5173',
            credentials: true
        }));
        app.use(helmet());
        app.use(morgan("dev"));

        app.use(
            session({
                secret: process.env.SESSION_SECRET || "dev-secret",
                resave: false,
                saveUninitialized: false,
                cookie: {
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax'
                }
            })
        );

        app.use(passport.initialize());
        app.use(passport.session());

        // 4. Use Routes
        app.use("/api/products", productRoutes);
        app.use("/auth", authRoutes);
        app.use("/api/dashboard", dashboardRoutes);
        app.use('/api/trips', tripRoutes);

        // 5. Start listening for requests
        app.listen(PORT, () => {
            console.log(`✅ Server is running and listening on port ${PORT}`);
        });

    } catch (error) {
        console.error('❌ Unable to start the server:', error);
        process.exit(1); // Exit the process with an error code
    }
};

// --- Execute the Server Start ---
startServer();