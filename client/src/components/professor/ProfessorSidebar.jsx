import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { PROFESSOR_API_END_POINT } from '@/utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { setLogProfessor } from '@/redux/ProfessorSlice';
import { toast } from 'sonner';
import { LogOut, Inbox, CheckCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfessorSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const professor = useSelector((state) => state.professor?.logProfessor);
  const profile = professor?.profile;
  const name = profile?.name || "Professor";
  const photo = profile?.photo;

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const logout = async () => {
    try {
      await axios.get(`${PROFESSOR_API_END_POINT}/logout`, { withCredentials: true });
      dispatch(setLogProfessor(null));
      toast.success("Logged out successfully");
      navigate("/professor/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-white border-r px-6 py-8 min-h-screen shadow-md">
      <div className="mb-8 flex items-center gap-4">
        <Avatar>
          <AvatarImage src={photo || ""} alt="prof-pic" />
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm text-gray-500">Welcome,</p>
          <p className="text-lg font-bold text-black truncate">{name}</p>
        </div>
      </div>

      <nav className="flex flex-col space-y-4 text-sm">
        <Link
          to="/professor/pending"
          className={`flex items-center gap-2 px-2 py-2 rounded-md hover:bg-gray-100 ${
            isActive("/professor/pending") ? "text-black font-semibold bg-gray-100" : "text-gray-600"
          }`}
        >
          <Inbox className="w-4 h-4" />
          Pending Requests
        </Link>

        <Link
          to="/professor/accepted"
          className={`flex items-center gap-2 px-2 py-2 rounded-md hover:bg-gray-100 ${
            isActive("/professor/accepted") ? "text-black font-semibold bg-gray-100" : "text-gray-600"
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          Accepted Requests
        </Link>

        <button
          onClick={logout}
          className="flex items-center gap-2 text-red-500 text-left px-2 py-2 rounded-md hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </nav>
    </div>
  );
};

export default ProfessorSidebar;
