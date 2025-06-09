import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Student } from "../models/student.model.js";
import { Project } from "../models/project.model.js";
import { Professor } from "../models/professor.model.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";


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

// student get available projects //
export const getAvailableProjects = async (req, res) => {
  try {
    const projects = await Project.find({ isAvailable: true })
      .populate({
        path: "mentorBy",
        select: "profile.name profile.department email"
      });

    return res.status(200).json({
      success: true,
      projects
    });

  } catch (error) {
    console.error("Error fetching available projects:", error);
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
    const student = await Student.findById(studentId)
    if (!student || !student.selectedProject) {
      return res.status(400).json({
        message: " project not selected ",
        success: false
      })
    }
    // avoid multiple request
    const alreadyRequested = await Professor.exists({ mentorshipRequest: studentId })

    if (alreadyRequested) {
      return res.status(400).json({
        message: "Mentor already requested",
        success: false
      })
    }
    // Check professor availability 
    const professor = await Professor.findById(professorId);
    if (!professor || !professor.isAvailableToMentor) {
      return res.status(400).json({
        success: false,
        message: "Professor not available to mentor",
      });
    }
    // dont send req to the same prof again
    const isRejectedByThisProfessor = professor.rejectedRequest.includes(studentId);

    if (isRejectedByThisProfessor) {
      return res.status(400).json({
        success: false,
        message: `Your request was already rejected by ${professor.profile.name}`,
      });
    }



    // Add mentorship request to professor (if not already requested)
    await Professor.findByIdAndUpdate(professorId, {
      $addToSet: { mentorshipRequest: studentId },
    });

    return res.status(200).json({
      success: true,
      message: "Mentorship request sent successfully",
    });
  } catch (error) {
    console.error("Error sending mentorship request:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// get prof by dept
export const getProfessorsByDepartment = async (req, res) => {

  const department = req.query.department;

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
    }).select("profile.name email");

    return res.status(200).json({
      success: true,
      professors,
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
      profile: student.profile
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
    const student = await Student.findById(studentId).populate("selectedProject")
    if (!student) {
      return res.status(401).json({
        message: "student doesn't exist",
        success: false
      })
    }
    const selectedProject = student.selectedProject
    const isMentorRequested = await Professor.findOne({ mentorshipRequest: studentId })


    return res.status(200).json({
      success: true,
      data: {
        project: selectedProject || null,
        isMentorRequested: !!isMentorRequested,
        isProfileComplete: !!student.isProfileComplete

      },
      message: "Dashboard data fetched successfully"

    })




  } catch (error) {

    return res.status(500).json({
      message: "internal server errror",
      success: false
    })
  }

}
// student check status of their request

export const getRequestStatus = async (req, res) => {
  try {
    const studentId = req.user._id;

    const result = await Professor.aggregate([
      {
        $facet: {
          accepted: [
            { $match: { acceptedRequest: studentId } },
            { $project: { _id: 1 } }
          ],
          rejected: [
            { $match: { rejectedRequest: studentId } },
            { $project: { _id: 1 } }
          ],
          pending: [
            { $match: { mentorshipRequest: studentId } },
            { $project: { _id: 1 } }
          ]
        }
      }
    ]);

    const { accepted, rejected, pending } = result[0];

    if (accepted.length > 0) {
      return res.status(200).json({
        message: "Mentorship request accepted",
        status: "accepted",
        success: true,
      });
    }

    if (rejected.length > 0) {
      return res.status(200).json({
        message: "Mentorship request rejected",
        status: "rejected",
        success: true,
      });
    }

    if (pending.length > 0) {
      return res.status(200).json({
        message: "Mentorship request pending",
        status: "pending",
        success: true,
      });
    }

    return res.status(200).json({
      message: "No mentorship request sent yet",
      status: "not_requested",
      success: true,
    });

  } catch (error) {
    console.error("Error in getRequestStatus (aggregated):", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
