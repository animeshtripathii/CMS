import bcrypt from "bcrypt";
import User from "../models/users.js";
import OTP from "../models/otp.js";
import { generateOTP } from "../utils/generateOtp.js";
import jwt from "jsonwebtoken";
/**
 * Begin registration process by creating a One-Time Password
 */
export const initiateSignupService = async (email) => {
  // Verify if the user account is already present
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  // Delete any existing OTP records for this email
  await OTP.deleteMany({ email });

  // Create a new OTP code
  const otp = generateOTP();

  // Save the OTP to the database (hashing handled by middleware)
  await OTP.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000)
  });

  return {
    otp,
    expiresIn: "5 minutes"
  };
};

/**
 * Authenticate OTP and finalize user creation
 */
export const verifySignupOtpService = async ({
  email,
  otp,
  name,
  password,
  role,
}) => {
  // Retrieve the OTP record associated with the email
  const otpRecord = await OTP.findOne({ email });
  if (!otpRecord) {
    throw new Error("OTP expired or not found");
  }

  // Validate if the OTP is still within its validity period
  if (otpRecord.expiresAt < Date.now()) {
    await OTP.deleteOne({ email });
    throw new Error("OTP expired");
  }

  // Compare the provided OTP with the stored hash
  const isValidOtp = await bcrypt.compare(otp, otpRecord.otp);
  if (!isValidOtp) {
    throw new Error("Invalid OTP");
  }

  // Register the new user (password is automatically hashed)
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Invalidate the OTP after successful use
  await OTP.deleteOne({ email });

  return {
    id: user._id,
    name: user.name,
    email: user.email
  };
};



export const loginService = async (email, password) => {
  const user = await User
    .findOne({ email })
    .select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};
