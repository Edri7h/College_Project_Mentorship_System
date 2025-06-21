// models/professor.model.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const ProfessorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Email is required"],
    trim: true
  },
  role: {
    type: String,
    enum: ['professor', 'hod'],
    default: 'professor'
  },
  isAvailableToMentor: {
    type: Boolean,
    default: true
  },
  receivedRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    }
  ],

  profile: {
    name: String,
    photo: String,
    department: String
  }
}, { timestamps: true });

ProfessorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export const Professor = mongoose.model("Professor", ProfessorSchema);
