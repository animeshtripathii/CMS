import express from "express";
import {
  initiateSignup,
  verifySignupOtp,
  login
} from "../controllers/auth.controller.js";

const router = express.Router();

/**
 * REGISTRATION PROCESS
 */

// Step 1: Start signup (create OTP)
router.post("/signup/initiate", initiateSignup);

// Step 2: Authenticate OTP and register user
router.post("/signup/verify", verifySignupOtp);
router.post("/login", login);

export default router;
