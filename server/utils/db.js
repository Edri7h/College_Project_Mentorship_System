import mongoose from "mongoose";


const connectToDb= async()=>{
      try {
        await  mongoose.connect(process.env.MONGODB_URI)
        console.log("database connection success!")
        
      } catch (error) {
        console.log(error)
      }

}
export default connectToDb;