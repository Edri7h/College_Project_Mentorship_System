import { Professor } from "../models/professor.model";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


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

