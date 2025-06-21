import { createSlice } from "@reduxjs/toolkit";




const studentSlice = createSlice({
    name:"student",
    initialState:{
        logStudent:null
    },
    reducers:{
        setLogStudent:(state,action)=>{
            state.logStudent=action.payload
        }
    }
})

export const {setLogStudent} =studentSlice.actions
export default studentSlice.reducer