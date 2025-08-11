import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import passport from 'passport';

export const registerUser = async (req, res) => {
    const { firstName, lastName, email, phoneNumber, city, country, additionalInfo, password } = req.body;

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: "Please enter all required fields" });
    }

    try {
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            city,
            country,
            additionalInfo,
            password: hashedPassword
        });

        req.logIn(newUser, (err) => {
            if (err) throw err;
            res.status(201).json({
                message: "User registered and logged in successfully",
                user: { id: newUser.id, email: newUser.email, firstName: newUser.firstName }
            });
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const loginUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(401).json({ message: info.message });
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.status(200).json({
                message: "Login successful",
                user: { id: user.id, email: user.email, firstName: user.firstName }
            });
        });
    })(req, res, next);
};

export const googleCallback = (req, res) => {
    // Redirects to a frontend route that will then fetch user data
    res.redirect("http://localhost:5173"); 
};

export const logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy(() => {
            res.clearCookie('connect.sid'); // Clears the session cookie
            res.status(200).json({ message: 'Successfully logged out' });
        });
    });
};

export const getCurrentUser = (req, res) => {
    if (req.isAuthenticated()) {
        const { id, email, firstName, displayName } = req.user;
        return res.status(200).json({ user: { id, email, firstName, displayName } });
    }
    return res.status(200).json({ user: null });
};