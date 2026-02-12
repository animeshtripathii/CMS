import express from "express";
import {
  initiateSignup,
  verifySignupOtp,
  login
} from "../controllers/auth.controller.js";

const router = express.Router();


// Step 1: Signup shuru karein (OTP banayein)
router.post("/signup/initiate", initiateSignup);

// Step 2: OTP authenticate karein aur user ko register karein
router.post("/signup/verify", verifySignupOtp);
router.post("/login", login);

export default router;
