import adminRoutes from "./adminRoutes.js"
import studentRoutes from "./studentRoutes.js"
import professorRoutes from "./professorRoutes.js"
import express from "express"

const router = express.Router()

router.use("/api/v1/admin",adminRoutes)

router.use("/api/v1/student",studentRoutes)

router.use("/api/v1/professor",professorRoutes)


export default router;

