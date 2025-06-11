import adminRoutes from "./adminRoutes.js"
import studentRoutes from "./studentRoutes.js"
import express from "express"

const router = express.Router()

router.use("/api/v1/admin",adminRoutes)

router.use("api/v1/student",studentRoutes)

export default router

