import bcrypt from "bcrypt";
import User from "../models/users.js";
import OTP from "../models/otp.js";
import { generateOTP } from "../utils/generateOtp.js";
import jwt from "jsonwebtoken";
/**
 * One-Time Password banakar registration process shuru karein
 */
export const initiateSignupService = async (email) => {
  // Verify karein ki user account pehle se maujood hai ya nahi
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  // Is email ke liye koi bhi maujooda OTP records delete karein
  await OTP.deleteMany({ email });

  // Naya OTP code banayein
  const otp = generateOTP();

  // OTP ko database mein save karein (hashing middleware dwara handle ki gayi hai)
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
 * OTP authenticate karein aur user creation ko finalize karein
 */
export const verifySignupOtpService = async ({
  email,
  otp,
  name,
  password,
  role,
}) => {
  // Email se juda OTP record retrieve karein
  const otpRecord = await OTP.findOne({ email });
  if (!otpRecord) {
    throw new Error("OTP expired or not found");
  }

  // Validate karein ki OTP abhi bhi validity period mein hai ya nahi
  if (otpRecord.expiresAt < Date.now()) {
    await OTP.deleteOne({ email });
    throw new Error("OTP expired");
  }

  // Diye gaye OTP ko stored hash ke saath compare karein
  const isValidOtp = await bcrypt.compare(otp, otpRecord.otp);
  if (!isValidOtp) {
    throw new Error("Invalid OTP");
  }

  // Naye user ko register karein (password automatically hash ho jata hai)
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Safal upyog ke baad OTP ko invalidate karein
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
