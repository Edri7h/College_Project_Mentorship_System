import mongoose from "mongoose";
import bcrypt from "bcrypt";

const AdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true
    },
    profile: {
      name: String,
      photo: String // cloudinary URL (optional)
    }
  },
  { timestamps: true }
);

// Pre-save hook to hash password
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error("Error hashing password:", error);
    next(error);
  }
});

export const Admin = mongoose.model("Admin", AdminSchema);
