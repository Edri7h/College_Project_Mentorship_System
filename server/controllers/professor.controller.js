import { Professor } from "../models/professor.model.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { Request } from "../models/Request.model.js";
import { Project } from "../models/project.model.js";


export const login = async (req, res) => {

  const { email, password } = req.body;

  if (!email?.trim() || !password?.trim()) {
    return res.status(400).json({
      message: "Invalid email or password",
      success: false
    });
  }

  try {
    const professor = await Professor.findOne({ email });
    if (!professor) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, professor.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign({ _id: professor._id, role: "professor" }, process.env.JWT_SECRET_KEY, {
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
      professor: {
        _id: professor._id,
        profile: professor.profile,
        email: professor.email,
      }
    });

  } catch (error) {
    console.error("Error in professor login:", error);
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

    console.error("Error in professor logout:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }
};

// prof accept student mentor request
export const acceptRequest = async (req, res) => {
  const professorId = req.user._id;
  const { requestId } = req.params;

  try {
    // Find the request and validate
    const request = await Request.findById(requestId).populate("forProject");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.forProfessor.toString() !== professorId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to this request",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Request already ${request.status}`,
      });
    }

    // Accept the request
    request.status = "accepted";
    await request.save();

    // Update the project: assign mentor and make it unavailable
    const project = await Project.findById(request.forProject._id);
    project.mentorBy = professorId;
    // project.isAvailable = false;
    await project.save();

    return res.status(200).json({
      success: true,
      message: "Mentorship request accepted successfully",
    });

  } catch (error) {
    console.error("Error accepting mentorship request:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// reject a request
export const rejectRequest=async(req,res)=>{
   const professorId = req.user._id;
   const { requestId } = req.params;


   try {
    const request = await Request.findById(requestId);
     if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }
    if (request.forProfessor.toString() !== professorId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to this request",
      });
    }
    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Request already ${request.status}`,
      });
    }
    request.status = "rejected";
    await request.save();

    return res.status(200).json({
      success: true,
      message: "Mentorship request rejected successfully",
    });


   } catch (error) {
    console.error("Error rejecting mentorship request:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  

    
   }
}



// Fetch all pending mentorship requests for the logged-in professor
export const getAllPendingRequest = async (req, res) => {
  const professorId = req.user._id;

  try {
    const allRequests = await Request.find({
      forProfessor: professorId,
      status: "pending",
    })
      .populate("requestBy", "profile.name profile.rollNo email")
      .populate("forProject", "title category")
      .sort({createdAt:-1});

    return res.status(200).json({
      success: true,
      message: "Pending requests fetched successfully",
      requests: allRequests,
    });

  } catch (error) {
    console.error("Error fetching mentorship requests:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



// fetch all accepted request 
export const getAcceptedRequests = async (req, res) => {
  const professorId = req.user._id;

  try {
    const acceptedRequests = await Request.find({
      forProfessor: professorId,
      status: "accepted",
    })
      .populate("requestBy", "profile.name profile.rollNo email")
      .populate("forProject", "title category")
      .sort({ createdAt: -1 });

    if (acceptedRequests.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No accepted requests found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Accepted requests fetched successfully",
      data: acceptedRequests,
    });
  } catch (error) {
    console.error("Error fetching accepted requests:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
