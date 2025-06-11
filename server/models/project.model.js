

// import mongoose from "mongoose";

// const projectSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true  
//   },
//   description: {
//     type: String,
//     trim: true  
//   },
//   category: {
//     type: String,
//     required: true  
//   },
//   isAvailable: {
//     type: Boolean,
//     default: true  
//   },
//   selectedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Student"
//   },
//   mentorBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Professor"
//   }
// }, { timestamps: true });

// export const Project = mongoose.model("Project", projectSchema);



// models/project.model.js
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  selectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
  },
  mentorBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Professor"
  }
}, { timestamps: true });

export const Project = mongoose.model("Project", projectSchema);