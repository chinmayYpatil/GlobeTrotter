import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import dotenv from 'dotenv';

dotenv.config();

// Google OAuth2 Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const [user, created] = await User.findOrCreate({
                    where: { email: profile.emails[0].value },
                    defaults: {
                        googleId: profile.id,
                        displayName: profile.displayName,
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        photo: profile.photos[0].value,
                        email: profile.emails[0].value
                    }
                });
                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

// Local Email & Password Strategy
passport.use(
    new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ where: { email: email } });

                if (!user) {
                    return done(null, false, { message: 'That email is not registered.' });
                }
                
                if (!user.password) {
                    return done(null, false, { message: 'This account was created using Google. Please log in with Google.' });
                }

                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password incorrect.' });
                }
            } catch (err) {
                return done(err);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});