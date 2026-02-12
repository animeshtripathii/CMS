import mongoose from "mongoose";
import bcrypt from "bcrypt"
const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    otp: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

otpSchema.pre("save", async function (next) {
  // OTP update hua hai ya nahi yeh dekhein taaki duplicate hashing se bacha ja sake
  if (!this.isModified("otp")) return next();

  const saltRounds = 10;
  this.otp = await bcrypt.hash(this.otp, saltRounds);

  
});
export default mongoose.model("OTP", otpSchema);
