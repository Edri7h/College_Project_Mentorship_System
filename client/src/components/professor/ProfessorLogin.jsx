
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from "react-redux"
import { PROFESSOR_API_END_POINT } from '../../utils/constants';
import { Loader2, Mail, Lock, User } from "lucide-react"
// import { setLogStudent } from '../../redux/studentSlice';
import { toast } from 'sonner';
import axios from 'axios';
import { setLogProfessor } from '@/redux/ProfessorSlice';

const ProfessorLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false)
  const [ProfessorData, setProfessorData] = useState({
    email: "",
    password: "",
  })

  const changeHandler = (e) => {
    setProfessorData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    // console.log(ProfessorData);
    setloading(true)

    try {
      const res = await axios.post(`${PROFESSOR_API_END_POINT}/login`, ProfessorData, {
        headers: {
          "content-type": "application/json",
        },
        withCredentials: true
      })
      // console.log(res.data.student);
      if (res.data.success) {
        dispatch(setLogProfessor(res.data.professor))
        toast(res.data.message);
        navigate("/professor")
      } else {
        toast(res.data.message);
      }
    } catch (error) {
      toast(error.response?.data?.message);
    } finally {
      setloading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-100 flex justify-center items-center p-4'>
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900">Professor Login</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={submitHandler} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                onChange={changeHandler}
                value={ProfessorData.email} 
                name='email'
                type="email" 
                placeholder="Email address"
                className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black transition-colors bg-white text-sm'
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                onChange={changeHandler}
                value={ProfessorData.password} 
                name='password'
                type="password" 
                placeholder="Password"
                className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black transition-colors bg-white text-sm'
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className='w-full bg-black hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-md transition-colors focus:ring-1 focus:ring-black focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed text-sm'
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className='animate-spin h-4 w-4' />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="text-center">
              <Link 
                to={"/student/login"} 
                className='text-sm text-gray-600 hover:text-black transition-colors'
              >
                Login as Student?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfessorLogin