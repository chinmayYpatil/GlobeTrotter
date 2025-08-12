import express from "express";
import passport from "passport";
import { 
    googleCallback, 
    logoutUser, 
    registerUser, 
    loginUser, 
    getCurrentUser,
    updateUserProfile,
    uploadAvatar
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Local Authentication
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

// Profile routes
router.get("/me", getCurrentUser);
router.put("/profile", protect, updateUserProfile);
router.post("/upload-avatar", protect, uploadAvatar); 

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
  googleCallback
);

export default router;