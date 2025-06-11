// models/request.model.js
import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    requestBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },
    forProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    forProfessor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professor",
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export const Request = mongoose.model("Request", requestSchema);