// import express from "express"
// import { 
//     getAvailableProjects,
//      getProfessorsByDepartment,
//      getRequestStatus,
//      getStudentDashboard,
//      login,
//       logout,
//        requestMentor,
//         selectProject, 
//         studentUpdateProfile,
//         withdrawMentorshipRequest
//     } 
//     from "../controllers/student.controller.js";
// import { isStudent } from "../middlewares/isStudent.js";

// const router=express.Router();



// router.route("/login").post(login)
// router.route("/logout").get(isStudent,logout)
// router.route("/get-projects").get(isStudent,getAvailableProjects)
// router.route("/select-project").post(isStudent,selectProject)
// router.route("/request-mentor").post(isStudent,requestMentor)
// router.route("/get-professor-by-dept").get(isStudent,getProfessorsByDepartment)
// router.route("/update-profile").post(isStudent,studentUpdateProfile)
// router.route("/get-dashboard").get(isStudent,getStudentDashboard)
// router.route("/get-request-status").get(isStudent,getRequestStatus)
// router.route("/withdraw-request").delete(isStudent,withdrawMentorshipRequest)


import express from "express";
import {
  getAllProjects,
  getProfessorsByDepartment,
  getRequestStatus,
  getStudentDashboard,
  login,
  logout,
  requestMentor,
  selectProject,
  studentUpdateProfile,
  withdrawMentorshipRequest
} from "../controllers/student.controller.js";

import { isStudent } from "../middlewares/isStudent.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/login", login);
router.get("/logout", isStudent, logout);

router.get("/get-projects", isStudent, getAllProjects);
router.post("/select-project", isStudent, selectProject);

router.post("/request-mentor", isStudent, requestMentor);
router.get("/get-professor-by-dept", isStudent, getProfessorsByDepartment);

router.post("/update-profile", isStudent,singleUpload, studentUpdateProfile);
router.get("/get-dashboard", isStudent, getStudentDashboard);

router.get("/get-request-status", isStudent, getRequestStatus);
router.patch("/withdraw-request", isStudent, withdrawMentorshipRequest);

export default router;

