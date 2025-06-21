// import React, { useState } from 'react'
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
// import { Loader2 } from 'lucide-react'
// import { USER_API_END_POINT } from '@/utils/constants'
// import { useNavigate } from 'react-router-dom'
// import { useDispatch } from 'react-redux'
// import { toast } from 'sonner'
// import { setLogStudent } from '@/redux/studentSlice'
// import axios from 'axios'

// const UpdateProfile = () => {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     const [loading, setLoading] = useState(false)
//     const [studentDetails, setStudentDetails] = useState({
//         name: "",
//         rollNo: "",
//         department: "",
//         file: null
//     })

//     const detailChangeHandler = (e) => {
//         setStudentDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }))
//     }

//     const fileChangeHandler = (e) => {
//         setStudentDetails((prev) => ({ ...prev, file: e.target.files?.[0] }))
//     }

//     const onSubmitHandler = async (e) => {
//         e.preventDefault();
//         if (!studentDetails.name || !studentDetails.rollNo || !studentDetails.department || !studentDetails.file) {
//             toast.error("All fields are required");
//             return;
//         }

//         setLoading(true)
//         const formData = new FormData();
//         formData.append("name", studentDetails.name);
//         formData.append("rollNo", studentDetails.rollNo);
//         formData.append("department", studentDetails.department);
//         formData.append("file", studentDetails.file);
//         console.log(formData)

//         try {
//             const res = await axios.post(`${USER_API_END_POINT}/update-profile`, formData, {
//                 headers: {
//                     "content-type": "multipart/form-data"
//                 },
//                 withCredentials: true
//             })

//             if (res.data.success) {
//                 dispatch(setLogStudent(res.data.student))
//                 toast.success(res.data.message)
//                 navigate("/student/dashboard")
//             } else {
//                 toast.error(res.data.message)
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || "Something went wrong")
//         } finally {
//             setLoading(false)
//         }
//     }

//     return (
//         <div className='w-screen h-screen flex justify-center items-center'>
//             <form onSubmit={onSubmitHandler} className="w-[320px] p-6 border-2 border-black rounded-md flex flex-col gap-4 items-center">
//                 <input
//                     className='block w-full p-2 bg-gray-200 rounded-md'
//                     placeholder="Full Name"
//                     onChange={detailChangeHandler}
//                     type="text"
//                     name="name"
//                     value={studentDetails.name}
//                 />

//                 <input
//                     className='w-full p-2 bg-gray-100 rounded-md'
//                     placeholder="Roll No"
//                     onChange={detailChangeHandler}
//                     type="text"
//                     value={studentDetails.rollNo}
//                     name="rollNo"
//                 />

//                 <Select value={studentDetails.department} onValueChange={(value) =>
//                     setStudentDetails((prev) => ({ ...prev, department: value }))
//                 }>
//                     <SelectTrigger className="w-full">
//                         <SelectValue placeholder="Select Department" />
//                     </SelectTrigger>
//                     <SelectContent>
//                         <SelectItem value="CS">CS</SelectItem>
//                         <SelectItem value="IT">IT</SelectItem>
//                         <SelectItem value="ECE">ECE</SelectItem>
//                     </SelectContent>
//                 </Select>

//                 <label htmlFor="fileUpload" className="bg-blue-500 text-white px-3 py-2 rounded-md cursor-pointer">
//                     Upload Profile Photo
//                 </label>
//                 <input
//                     id="fileUpload"
//                     accept='image/*'
//                     className='sr-only'
//                     onChange={fileChangeHandler}
//                     type="file"
//                     name="file"
//                 />

//                 <button className='bg-black rounded-md p-2 w-full text-white' type="submit">
//                     {loading ? <Loader2 className='animate-spin h-5 w-5 mx-auto' /> : "Submit"}
//                 </button>
//             </form>
//         </div>
//     )
// }

// export default UpdateProfile




import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2, Upload, User } from 'lucide-react'
import { USER_API_END_POINT } from '@/utils/constants'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { setLogStudent } from '@/redux/studentSlice'
import axios from 'axios'

const UpdateProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false)
    const [studentDetails, setStudentDetails] = useState({
        name: "",
        rollNo: "",
        department: "",
        file: null
    })

    const detailChangeHandler = (e) => {
        setStudentDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const fileChangeHandler = (e) => {
        setStudentDetails((prev) => ({ ...prev, file: e.target.files?.[0] }))
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!studentDetails.name || !studentDetails.rollNo || !studentDetails.department || !studentDetails.file) {
            toast.error("All fields are required");
            return;
        }

        setLoading(true)
        const formData = new FormData();
        formData.append("name", studentDetails.name);
        formData.append("rollNo", studentDetails.rollNo);
        formData.append("department", studentDetails.department);
        formData.append("file", studentDetails.file);
        console.log(formData)

        try {
            const res = await axios.post(`${USER_API_END_POINT}/update-profile`, formData, {
                headers: {
                    "content-type": "multipart/form-data"
                },
                withCredentials: true
            })

            if (res.data.success) {
                dispatch(setLogStudent(res.data.student))
                toast.success(res.data.message)
                navigate("/student/dashboard")
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-gray-100 flex justify-center items-center p-4'>
            <div className="w-full max-w-sm">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    {/* Compact Header */}
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <User className="w-6 h-6 text-gray-600" />
                        </div>
                        <h1 className="text-lg font-semibold text-gray-900">Update Profile</h1>
                    </div>

                    {/* Compact Form */}
                    <form onSubmit={onSubmitHandler} className="space-y-4">
                        <input
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black transition-colors bg-white text-sm'
                            placeholder="Full Name"
                            onChange={detailChangeHandler}
                            type="text"
                            name="name"
                            value={studentDetails.name}
                        />

                        <input
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black transition-colors bg-white text-sm'
                            placeholder="Roll Number"
                            onChange={detailChangeHandler}
                            type="text"
                            value={studentDetails.rollNo}
                            name="rollNo"
                        />

                        <Select value={studentDetails.department} onValueChange={(value) =>
                            setStudentDetails((prev) => ({ ...prev, department: value }))
                        }>
                            <SelectTrigger className="w-full h-10 px-3 border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black text-sm">
                                <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CS">CS</SelectItem>
                                <SelectItem value="IT">IT</SelectItem>
                                <SelectItem value="ECE">ECE</SelectItem>
                            </SelectContent>
                        </Select>

                        <label htmlFor="fileUpload" className="w-full h-10 border border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center space-x-2 text-gray-500">
                                <Upload className="w-4 h-4" />
                                <span className="text-sm">
                                    {studentDetails.file ? studentDetails.file.name : "Upload Photo"}
                                </span>
                            </div>
                        </label>
                        <input
                            id="fileUpload"
                            accept='image/*'
                            className='sr-only'
                            onChange={fileChangeHandler}
                            type="file"
                            name="file"
                        />

                        <button 
                            className='w-full bg-black hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-md transition-colors focus:ring-1 focus:ring-black focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed text-sm' 
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <Loader2 className='animate-spin h-4 w-4' />
                                    <span>Updating...</span>
                                </div>
                            ) : (
                                "Update Profile"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UpdateProfile