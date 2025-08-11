import express from "express";
import passport from "passport";
import { googleCallback, logoutUser, registerUser, loginUser, getCurrentUser } from "../controllers/authController.js";

const router = express.Router();

// Local Authentication
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/me", getCurrentUser);

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
  googleCallback
);

export default router;