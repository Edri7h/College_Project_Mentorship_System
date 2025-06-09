import express from "express"
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors"
// import connectToDb from "./utils/db";
import connectToDb from "./utils/db.js";
import { Admin } from "./models/Admin.model.js";
import router from "./routes/index.js";


dotenv.config({})
const app = express();
app.use(cookieParser())
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const corsOptions={
    origin:"http://localhost:5173",
    credentials:true
}
app.use(cors(corsOptions))



const port = process.env.PORT || 3000 ;


// initilize admin --- hence , register not needed 
const initAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ email: "admin@skit.ac.in" });
    if (!adminExists) {
      await Admin.create({ 
        email: "admin@skit.ac.in", 
        password: "TempPassword123" 
      });
      console.log(" Default admin created");
    } else {
      console.log(" Admin already exists");
    }
  } catch (error) {
    console.error("Error during admin initialization:", error.message);
  }
};





//api's
app.use(router);




connectToDb().then(()=>{
  initAdmin()
   app.listen(port,()=>{
    console.log(`server listening at port ${port}`)
   })
}).catch((error)=>{
    console.log(error)
})