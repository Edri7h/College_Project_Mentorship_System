import jwt from "jsonwebtoken"



export const isAdmin = (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(400).json({
            success: false,
            message: "token doesnt exist "
        })
    };

    try {

        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if (decode?.role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: "anauthorized access "
            });

        }
        req.user = decode
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });

    }
}