import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import StudentLogin from './components/student/StudentLogin'
import ProfessorLogin from './components/professor/ProfessorLogin'
import StudentDashboard from './components/student/StudentDashboard'
import UpdateProfile from './components/student/UpdateProfile'
import AvailableProjects from './components/student/AllProjects'
// import MentorDialog from './components/student/MentorDialog'
// import ProjectMentorSelection from './components/student/AvailableProjects'
import AvailableProfessors from './components/student/AvailableProfessors'
import RequestStatus from './components/student/RequestStatus'
import AllProjects from './components/student/AllProjects'
// import ProfessorDashboard from './components/professor/ProfessorDashboard'
import DashboardLayout from './components/professor/DashboardLayout'
import PendingRequests from './components/professor/PendingRequest'
import AcceptedRequests from './components/professor/AcceptedRequest'




const appRouter = createBrowserRouter([
  {
    path: "/student/login",
    element: <StudentLogin />
  },
  
  {
    path: "/student/update/profile",
    element: <UpdateProfile />
  },
  {
    path: "/student/dashboard",
    element: <StudentDashboard />

  },
  {
    path:"/student/get-projects",
    element:<AllProjects/>
  },
  {
    path:"/student/get-status",
    element:<RequestStatus/>
  },
  
  {
    path:"/student/available-professors",
    element:<AvailableProfessors/>
  },
  //prof routes
  {
    path: "/professor/login",
    element: <ProfessorLogin />
  },
   {
    path: "/professor",
    element: <DashboardLayout />, // sidebar layout
    children: [
      { path: "pending", element: <PendingRequests /> }, // default
      { path: "accepted", element: <AcceptedRequests /> }
    ]
  }
])


function App() {


  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  )
}

export default App
