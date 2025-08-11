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
            displayName: `${firstName} ${lastName}`,
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
                user: { 
                    id: newUser.id, 
                    email: newUser.email, 
                    name: newUser.displayName,
                    avatar: newUser.photo 
                }
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
            const { id, email, displayName, photo, city, additionalInfo, createdAt } = user;
            return res.status(200).json({
                message: "Login successful",
                user: { 
                    id, 
                    email, 
                    name: displayName, 
                    avatar: photo,
                    location: city,
                    bio: additionalInfo,
                    createdAt
                }
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
        const { id, email, displayName, photo, city, additionalInfo, createdAt } = req.user;
        return res.status(200).json({ 
            user: { 
                id, 
                email, 
                name: displayName, 
                avatar: photo,
                location: city,
                bio: additionalInfo,
                createdAt
            } 
        });
    }
    return res.status(200).json({ user: null });
};

export const updateUserProfile = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not Authorized' });
    }

    const { name, email, location, bio, avatar } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check for email uniqueness if it's being changed
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email: email } });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }
        
        const nameParts = name ? name.split(' ') : [user.firstName, user.lastName];

        user.displayName = name || user.displayName;
        user.firstName = nameParts[0] || user.firstName;
        user.lastName = nameParts.slice(1).join(' ') || user.lastName;
        user.email = email || user.email;
        user.city = location || user.city;
        user.additionalInfo = bio || user.additionalInfo;
        // The frontend sends 'avatar', but the DB model uses 'photo'
        if (avatar) {
            user.photo = avatar;
        }

        await user.save();
        
        const { id, displayName, photo, city, additionalInfo, createdAt } = user;
        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id,
                email: user.email,
                name: displayName,
                avatar: photo,
                location: city,
                bio: additionalInfo,
                createdAt
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// New function to handle avatar upload
export const uploadAvatar = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not Authorized' });
    }
    
    // In a real application, you would use a library like 'multer' to handle the file upload.
    // For now, we will simulate the upload and return a new placeholder URL.
    try {
        // Here you would process and save the file, e.g., to a cloud storage service.
        // For this project, we'll just return a new static placeholder URL.
        const avatarUrl = `https://i.pravatar.cc/150?u=${req.user.id}&t=${Date.now()}`;
        
        res.status(200).json({ 
            message: 'Image uploaded successfully',
            avatar: avatarUrl // The frontend expects an 'avatar' property in the response
        });
    } catch (error) {
        res.status(500).json({ message: 'Image upload failed', error: error.message });
    }
};