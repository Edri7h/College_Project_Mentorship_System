
// import express from "express"
// import { adminLogin, adminLogout, createProject, professorByDepartment, promoteToHod, registerProfessor, registerStudent } from "../controllers/admin.controller.js"




// const router = express.Router()

// router.route("/login").post(adminLogin)
// router.route("/logout").get(adminLogout)
// router.route("/register/student").post(registerStudent)
// router.route("/register/professor").post(registerProfessor)
// router.route("/create-project").post(createProject)
// router.route("/makeHod/:professorId").post(promoteToHod)
// router.route("/get-professor-department").get(professorByDepartment)



import express from 'express';
import {
  adminLogin,
  adminLogout,
  registerStudent,
  registerProfessor,
  createProject,
  promoteToHod,
  professorByDepartment
} from '../controllers/admin.controller.js';

import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

// Public
router.post('/login', adminLogin);

//  only admin can visit
router.post('/logout',isAdmin, adminLogout);
router.post('/register-student', isAdmin, registerStudent);
router.post('/register-professor', isAdmin, registerProfessor);
router.post('/create-project', isAdmin, createProject);
router.patch('/promote-hod/:professorId', isAdmin, promoteToHod);
router.get('/professors-by-department', isAdmin, professorByDepartment);

export default router;
