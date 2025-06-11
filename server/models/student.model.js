import mongoose from "mongoose";
import bcrypt from "bcrypt";

const StudentSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    match: /^[a-z]\d{6}@skit\.ac\.in$/
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  selectedProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  },
  // mentor: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Professor",
  //   default: null,
  // },
  isProfileComplete: {
    type: Boolean,
    default: false
  },

  profile: {
    name: { type: String, default: null },
    rollNo: { type: String, default: null },
    photo: { type: String, default: null },
    department: {
      type: String,
      enum: ["IT", "CSE", "ECE"],
      default: null
    }
  }

}, { timestamps: true });





StudentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next()

  } catch (error) {
    console.log(error);
    next(error);
  }
})

export const Student = mongoose.model("Student", StudentSchema);