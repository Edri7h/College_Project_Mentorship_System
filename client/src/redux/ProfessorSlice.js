import { createSlice } from "@reduxjs/toolkit";



const professorSlice = createSlice({
    name:"professor",
    initialState:{
        logProfessor:null
    },
    reducers:{
        setLogProfessor:(state,action)=>{
            state.logProfessor=action.payload
        }
    }
}) 


export const {setLogProfessor}=professorSlice.actions;
export default professorSlice.reducer;
