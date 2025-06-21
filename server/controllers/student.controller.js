import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Student } from "../models/student.model.js";
import { Project } from "../models/project.model.js";
import { Professor } from "../models/professor.model.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
import { Request } from "../models/Request.model.js";


export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password?.trim()) {
    return res.status(400).json({
      message: "Invalid email or password",
      success: false
    });
  }

  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign({ _id: student._id, role: "student" }, process.env.JWT_SECRET_KEY, {
      expiresIn: '7d'
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production'
    });

    return res.status(200).json({
      message: "Login successful",
      success: true,
      student: {
        
        _id: student._id,
        profile: student.profile,
        email: student.email,
        // selectedProjectId:student.selectedProject,
        isProfileComplete:student.isProfileComplete
      }
    });

  } catch (error) {
    console.error("Error in student login:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


export const logout = async (req, res) => {

  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {

    console.error("Error in student logout:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }
};


// Get ALL projects regardless of availability
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate({
        path: "mentorBy",
        select: "profile.name profile.department email"
      });

    return res.status(200).json({
      success: true,
      projects
    });

  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};



// select project 
export const selectProject = async (req, res) => {
  const studentId = req.user._id;
  const { projectId } = req.body;

  if (!projectId) {
    return res.status(400).json({
      success: false,
      message: "Project ID is required",
    });
  }

  try {
    // Fetch student and validate selection status
    const student = await Student.findById(studentId);
    if (student.selectedProject) {
      return res.status(400).json({
        success: false,
        message: "You have already selected a project",
      });
    }

    // Check project availability 
    const project = await Project.findById(projectId);
    if (!project || !project.isAvailable) {
      return res.status(404).json({
        success: false,
        message: "Project not available or already selected",
      });
    }

    // Mark project as selected
    project.selectedBy = studentId;
    project.isAvailable = false;
    await project.save();

    // Update student with selected project 
    student.selectedProject = projectId;
    await student.save();

    return res.status(200).json({
      success: true,
      message: "Project selected successfully",
    });

  } catch (error) {
    console.error("Error selecting project:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};





// req a mentor - prof 
// export const requestMentor = async (req, res) => {
//   const studentId = req.user._id;
//   const { professorId } = req.body;

//   if (!professorId) {
//     return res.status(400).json({
//       success: false,
//       message: "Professor ID is required",
//     });
//   }

//   try {
//     // Fetch student
//     const student = await Student.findById(studentId);
//     if (!student || !student.selectedProject) {
//       return res.status(400).json({
//         success: false,
//         message: "Project not selected. Please select a project first.",
//       });
//     }

//     // Check if student already has an active pending request
//     const existingPendingRequest = await Request.findOne({
//       requestBy: studentId,
//       status: "pending",
//     });

//     if (existingPendingRequest) {
//       return res.status(400).json({
//         success: false,
//         message: "You already have a pending mentorship request.",
//       });
//     }

//     // Check if this professor already rejected this student
//     const previouslyRejected = await Request.findOne({
//       requestBy: studentId,
//       forProfessor: professorId,
//       status: "rejected",
//     });

//     if (previouslyRejected) {
//       return res.status(400).json({
//         success: false,
//         message: "You have already been rejected by this professor.",
//       });
//     }

//     // Check professor availability
//     const professor = await Professor.findById(professorId);
//     if (!professor || !professor.isAvailableToMentor) {
//       return res.status(400).json({
//         success: false,
//         message: "Professor is not available to mentor at the moment.",
//       });
//     }

//     // Create new mentorship request
//     await Request.create({
//       requestBy: studentId,
//       forProject: student.selectedProject,
//       forProfessor: professorId,
//       status: "pending",
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Mentorship request sent successfully.",
//     });

//   } catch (error) {
//     console.error("Error sending mentorship request:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error.",
//     });
//   }
// };
export const requestMentor = async (req, res) => {
  const studentId = req.user._id;
  const { professorId } = req.body;

  if (!professorId) {
    return res.status(400).json({
      success: false,
      message: "Professor ID is required",
    });
  }

  try {
    // Fetch student
    const student = await Student.findById(studentId);
    if (!student || !student.selectedProject) {
      return res.status(400).json({
        success: false,
        message: "Project not selected. Please select a project first.",
      });
    }

    // Check if student already has an active pending request
    const existingPendingRequest = await Request.findOne({
      requestBy: studentId,
      status: "pending",
    });

    if (existingPendingRequest) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending mentorship request.",
      });
    }

    // Check if this professor already rejected this student
    const previouslyRejected = await Request.findOne({
      requestBy: studentId,
      forProfessor: professorId,
      status: "rejected",
    });

    if (previouslyRejected) {
      return res.status(400).json({
        success: false,
        message: "You have already been rejected by this professor.",
      });
    }

    // Check professor availability
    const professor = await Professor.findById(professorId);
    if (!professor || !professor.isAvailableToMentor) {
      return res.status(400).json({
        success: false,
        message: "Professor is not available to mentor at the moment.",
      });
    }

    // Create new mentorship request
    await Request.create({
      requestBy: studentId,
      forProject: student.selectedProject,
      forProfessor: professorId,
      status: "pending",
    });

    // ✅ Add studentId to professor's receivedRequests array
    await Professor.findByIdAndUpdate(professorId, {
      $addToSet: { receivedRequests: studentId }
    });

    return res.status(200).json({
      success: true,
      message: "Mentorship request sent successfully.",
    });

  } catch (error) {
    console.error("Error sending mentorship request:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};



// get prof by dept
// export const getProfessorsByDepartment = async (req, res) => {

//   const department = req.query.department || "";
//   // console.log(department)

//   if (!department || !["IT", "CSE", "ECE"].includes(department)) {
//     return res.status(400).json({
//       success: false,
//       message: "Valid department is required",
//     });
//   }

//   try {
//     const professors = await Professor.find({
//       "profile.department": department,
//       isAvailableToMentor: true,
//     }).select("profile.name email");

//     return res.status(200).json({
//       success: true,
//       professors,
//     });

//   } catch (error) {
//     console.error("Error fetching professors by department:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };
export const getProfessorsByDepartment = async (req, res) => {
  const studentId = req.user._id;
  const department = req.query.department || "";

  if (!department || !["IT", "CSE", "ECE"].includes(department)) {
    return res.status(400).json({
      success: false,
      message: "Valid department is required",
    });
  }

  try {
    const professors = await Professor.find({
      "profile.department": department,
      isAvailableToMentor: true,
    })
      .select("profile.name email receivedRequests profile.profileImage profile.department currentMenteesCount");

    return res.status(200).json({
      success: true,
      professors,
      studentId, // Optional, you can send this to frontend for comparison
    });

  } catch (error) {
    console.error("Error fetching professors by department:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


//student update profile
export const studentUpdateProfile = async (req, res) => {
  const { name, rollNo, department } = req.body;
  const file = req.file;
  const studentId = req.user._id;


  if (!file || !rollNo || !department || !name) {
    return res.status(400).json({
      message: "All fields are required",
      success: false
    });
  }

  try {
    const fileUri = getDataUri(file);

    if (!fileUri?.content) {
      return res.status(400).json({
        message: "Invalid file format",
        success: false
      });
    }

    const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
      resource_type: "raw"
    });

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    student.profile.name = name;
    student.profile.rollNo = rollNo;
    student.profile.department = department;

    if (cloudResponse?.secure_url) {
      student.profile.photo = cloudResponse.secure_url;
    }

    student.isProfileComplete = true;
    await student.save();
    

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
       student: {
        _id: student._id,
        profile: student.profile,
        email: student.email,
        // selectedProjectId:student.selectedProject,
        isProfileComplete:student.isProfileComplete
      }
    });

  } catch (error) {
    console.error("Error in updating profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// student dashboard api
export const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;

    const student = await Student.findById(studentId)
      .populate("selectedProject");
      // console.log(student.selectedProject); // 🔍 See what this logs

    if (!student) {
      return res.status(401).json({
        message: "Student doesn't exist",
        success: false
      });
    }

    const selectedProject = student.selectedProject;

    // Check if student has a pending mentorship request
    const existingRequest = await Request.findOne({
      requestBy: studentId,
      status: "pending"
    });

    return res.status(200).json({
      success: true,
      data: {
        project: selectedProject || null,
        showRequestMentorButton: !!selectedProject && !existingRequest,
        isProfileComplete: !!student.isProfileComplete
      },
      message: "Dashboard data fetched successfully"
    });

  } catch (error) {
    console.error("Error in getStudentDashboard:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};



// student check status of their request
// export const getRequestStatus = async (req, res) => {
//   try {
//     const studentId = req.user._id;

//     // Find the latest request made by the student (if any)
//     const latestRequest = await Request.findOne({ requestBy: studentId })
//       .sort({ createdAt: -1 }) // get latest
//       .populate("forProfessor", "profile.name profile.department")
//       .populate("forProject", "title");

//     if (!latestRequest) {
//       return res.status(200).json({
//         status: "not_requested",
//         message: "No mentorship request sent yet",
//         success: true,
//       });
//     }

//     return res.status(200).json({
//       status: latestRequest.status,
//       professor: latestRequest.forProfessor,
//       project: latestRequest.forProject,
//       message: `Request status is: ${latestRequest.status}`,
//       success: true,
//     });

//   } catch (error) {
//     console.error("Error fetching request status:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };
  
export const getRequestStatus = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Fetch ALL requests made by the student
    const allRequests = await Request.find({ requestBy: studentId })
      .sort({ createdAt: -1 }) // latest first
      .populate("forProfessor", "profile.name profile.department")
      .populate("forProject", "title");

    if (!allRequests || allRequests.length === 0) {
      return res.status(200).json({
        success: true,
        requests: [],
        message: "No mentorship requests found",
      });
    }

    return res.status(200).json({
      success: true,
      requests: allRequests, // 👈 return full array
    });

  } catch (error) {
    console.error("Error fetching request status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};




// withdraw pending mentorship request 
// export const withdrawMentorshipRequest = async (req, res) => {
//   const studentId = req.user._id;

//   try {
//     const request = await Request.findOne({
//       requestBy: studentId,
//       status: "pending"
//     });

//     if (!request) {
//       return res.status(400).json({
//         success: false,
//         message: "No pending mentorship request found to withdraw.",
//       });
//     }

//     await request.deleteOne();

//     return res.status(200).json({
//       success: true,
//       message: "Mentorship request withdrawn successfully.",
//     });

//   } catch (error) {
//     console.error("Error withdrawing mentorship request:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };
// import Professor from '../models/professorModel.js'; // make sure this is imported if not already

export const withdrawMentorshipRequest = async (req, res) => {
  const studentId = req.user._id;

  try {
    // Find only pending requests
    const request = await Request.findOne({
      requestBy: studentId,
      status: "pending",
    });

    if (!request) {
      return res.status(400).json({
        success: false,
        message: "No pending mentorship request found to withdraw.",
      });
    }

    // Update status to "withdrawn"
    request.status = "withdrawn";
    await request.save();

    // Remove studentId from professor's receivedRequests
    await Professor.findByIdAndUpdate(request.forProfessor, {
      $pull: { receivedRequests: studentId }
    });

    return res.status(200).json({
      success: true,
      message: "Mentorship request withdrawn successfully.",
    });

  } catch (error) {
    console.error("Error withdrawing mentorship request:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

