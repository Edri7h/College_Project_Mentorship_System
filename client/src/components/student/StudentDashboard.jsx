// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { LayoutDashboard, FolderKanban } from 'lucide-react'; // sidebar icons
// import ProfileCard from './Profilecard';
// import StudentInfo from './StudentInfo';

// const StudentDashboard = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen flex bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col justify-between py-6 px-4">
//         <div>
//           <h2 className="text-lg font-semibold text-gray-800 mb-6">Student Panel</h2>

//           <nav className="space-y-2">
//             <button
//               onClick={() => navigate('/student/get-projects')}
//               className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm rounded-md bg-black text-white hover:bg-gray-900 transition"
//             >
//               <FolderKanban className="w-5 h-5" />
//               Available Projects
//             </button>

//             <button onClick={()=>{navigate("/student/get-status")}}
//               className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm rounded-md bg-black text-white hover:bg-gray-900 transition"
//             >
//               <LayoutDashboard className="w-5 h-5" />
//               Check status
//             </button>
//             <button
//               className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm rounded-md bg-black text-white hover:bg-gray-900 transition"
//             >
//               <LayoutDashboard className="w-5 h-5" />
//               My Project
//             </button>
//           </nav>
//         </div>

//         {/* Profile at bottom */}
//         <div className=" border-t ">
//           <ProfileCard />
//         </div>
//       </aside>

//       {/* Main content */}
//       <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
//         <StudentInfo />
//       </main>
//     </div>
//   );
// };

// export default StudentDashboard;



import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban } from 'lucide-react';
import ProfileCard from './Profilecard';
import StudentInfo from './StudentInfo';

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 shadow-sm px-4 py-4 md:py-6 flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Student Panel</h2>

          <nav className="space-y-2">
            <button
              onClick={() => navigate('/student/get-projects')}
              className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm rounded-md bg-black text-white hover:bg-gray-900 transition"
            >
              <FolderKanban className="w-5 h-5" />
              Available Projects
            </button>

            <button
              onClick={() => navigate('/student/get-status')}
              className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm rounded-md bg-black text-white hover:bg-gray-900 transition"
            >
              <LayoutDashboard className="w-5 h-5" />
              Check Status
            </button>

            <button
              className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm rounded-md bg-black text-white hover:bg-gray-900 transition"
            >
              <LayoutDashboard className="w-5 h-5" />
              My Project
            </button>
          </nav>
        </div>

        {/* Profile (aligned at bottom only on large screens) */}
        <div className=" border-t pt-4">
          <ProfileCard />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 bg-gray-50 overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
        <StudentInfo />
      </main>
    </div>
  );
};

export default StudentDashboard;

