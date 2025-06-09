import { Admin } from "../models/Admin.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Student } from "../models/student.model.js";
import { Professor } from "../models/professor.model.js";
import { Project } from "../models/project.model.js";



// admin login
export const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    if ([email, password].some(field => field.trim() === '')) {
        return res.status(400).json({
            message: "invalid input",
            success: false
        })
    }
    try {

        const admin = await Admin.findOne({
            email
        })
        if (!admin) {
            return res.status(401).json({
                message: "inavalid credentials",
                success: false,
            })

        }
        const isPasswordMatch = await bcrypt.compare(password, admin.password)
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "inavalid credentials",
                success: false,
            })
        }
        const token = jwt.sign({ _id: admin._id, role: "admin" }, process.env.JWT_SECRET_KEY, {
            expiresIn: '7d'
        })
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production'
        })



        return res.status(200).json({
            message: "Login Success",
            admin: {
                _id: admin._id,
                email: admin.email,
                profile: admin.profile
            }, 
            token, // can be used later
            success: true
        })

    } catch (error) {
        console.log("login error :", error)
        return res.status(500).json({
            message: " internal server error",
            success: false
        })
    }

}

// admin logout 
export const adminLogout = async (req, res) => {
    return res
        .status(200)
        .clearCookie("token", {
            httpOnly: true,
            sameSite: "strict",
            secure: false

        })
        .json({
            message: "Logout successful",
            success: true
        })

}

// create a student
export const registerStudent = async (req, res) => {
    const { email, password } = req.body
// console.log(email,password)
    if (!email?.trim() || !password?.trim()) {
        return res.status(400).json({
            message: "invalid credentialsi",
            success: false
        })
    }
    try {
        const student = await Student.findOne({
            email
        })
        if (student) {
            return res.status(409).json({
                message: "Student already registered",
                success: false
            })
        }
        const newStudent = await Student.create({
            email,
            password

        })
        return res.status(201).json({
            success: true,
            message: "Student registered success",
            student: {
                _id: newStudent._id,
                email: newStudent.email
            }
        })



    } catch (error) {
        console.error("Register student error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });

    }
}

//register a professor
export const registerProfessor = async (req, res) => {
    const { name, email, password, department } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim() || !department?.trim()) {
        return res.status(400).json({
            message: "Invalid input",
            success: false,
        });
    }

    try {
        const existingProfessor = await Professor.findOne({ email });

        if (existingProfessor) {
            return res.status(409).json({
                success: false,
                message: "Professor already registered",
            });
        }

        const newProfessor = await Professor.create({

            email,
            password, //  will be hashed in a pre-save hook
            profile: {
                name,
                department
            }
        });

        return res.status(201).json({
            success: true,
            message: "Professor registered successfully",
            professor: {
                _id: newProfessor._id,
                name: newProfessor.profile.name,
                email: newProfessor.email,
            }
        });
    } catch (error) {
        console.error("Professor registration error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// create <-=-> projects
export const createProject = async (req, res) => {
    const { title, description, category } = req.body;

    if ([title, description, category].some(field => field.trim() === '')) {
        return res.status(400).json({
            message: "all fields are compulsory",
            success: false
        })
    }

    try {

        const project = await Project.create({
            title,
            description,
            category
        })

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: {
                project,
            },
        });


    } catch (error) {


        console.error("Create project error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });

    }


}

// make a professor hod 
export const promoteToHod = async (req, res) => {
    const { professorId } = req.params;

    if (!professorId) {
        return res.status(400).json({
            message: "Professor ID is required",
            success: false,
        });
    }

    try {
        const professor = await Professor.findById(professorId);

        if (!professor) {
            return res.status(404).json({
                message: "Professor does not exist",
                success: false,
            });
        }

        const department = professor?.profile?.department;

        if (!department) {
            return res.status(400).json({
                message: "Department not assigned to professor",
                success: false,
            });
        }

        const existingHod = await Professor.findOne({
            role: "hod",
            "profile.department": department,
        });

        if (existingHod) {
            return res.status(409).json({
                message: `HOD already exists for the ${department} department`,
                success: false,
            });
        }

        professor.role = "hod";
        await professor.save();

        return res.status(200).json({
            message: `${professor.profile.name} was promoted to HOD`,
            success: true,
            professor: {
                _id: professor._id,
                email: professor.email,
                role: professor.role,
                department,
            },
        });
    } catch (error) {
        console.error("Promote to HOD error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


//  get profs by department
export const professorByDepartment = async (req, res) => {

    const { department } = req.query;
    if (!department?.trim()) {
        return res.status(400).json({
            message: " invalid request",
            success: false
        })
    };

    try {
        const professors = await Professor.find({
            "profile.department": department
        }).select("-password");

       
        return res.status(200).json({
            success: true,
            message: `Professors from ${department} department retrieved successfully`,
            professors,
        });


    } catch (error) {
        console.log("error in retreiving professors :",error)
        return res.status(500).json({
            success:false,
            message:"internal server error"
        })
    }
}