import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false // Default roop se, query results mein password field shamil na karein
    },
    role: {
      type: String,
      enum: ["ADMIN", "EDITOR", "VIEWER"],
      default: "VIEWER"
    }
  },
  { timestamps: true }
);


userSchema.pre("save", async function (next) {
  // Hashing tabhi karein jab password field update hua ho
  if (!this.isModified("password")) return next();

  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);

});
export default mongoose.model("User", userSchema);
