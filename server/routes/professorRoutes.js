import express from "express"
import { acceptRequest, getAcceptedRequests, getAllPendingRequest, login, logout, rejectRequest } from "../controllers/professor.controller.js";
import isProfessor from "../middlewares/isProfessor.js"

const router= express.Router()





router.post("/login",login)
router.get("/logout",isProfessor,logout)
router.post("/accept-request/:requestId",isProfessor,acceptRequest)
router.post("/reject-request/:requestId",isProfessor,rejectRequest)
router.get("/get-pending-requests",isProfessor,getAllPendingRequest)
router.get("/get-accepted-requests",isProfessor,getAcceptedRequests)



export default router;