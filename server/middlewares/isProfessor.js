import jwt from "jsonwebtoken";

export const isProfessor = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication token is missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded || decoded.role !== "professor") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access: professor role required",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
   console.error("JWT verification failed:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
