import adminRoutes from "./adminRoutes.js"

import express from "express"

const router = express.Router()

router.use("/api/v1/admin",adminRoutes)



export default router

