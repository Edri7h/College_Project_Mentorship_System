import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';
import { USER_API_END_POINT } from '@/utils/constants';
import { GraduationCap, Loader2 } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';

const AvailableProfessors = () => {
  const location = useLocation();
  const department = location.state?.department || 'IT';

  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState(null);
  const [studentId, setStudentId] = useState(null); // ✅ student ID from backend

  useEffect(() => {
    fetchProfessors();
  }, []);

  const fetchProfessors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${USER_API_END_POINT}/get-professor-by-dept?department=${department}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setProfessors(res.data.professors || []);
        setStudentId(res.data.studentId); // ✅ store student ID
      } else {
        toast.error(res.data.message || 'Failed to load professors');
      }
    } catch (err) {
      toast.error(err.message || 'Error fetching professors');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestMentor = async (professorId) => {
    setRequestingId(professorId);
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/request-mentor`,
        { professorId },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success('Mentorship request sent successfully');
        fetchProfessors(); // ✅ re-fetch to get updated receivedRequests
      } else {
        toast.error(res.data.message || 'Failed to send request');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error sending request');
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-full mb-4">
            <GraduationCap className="h-8 w-8 text-gray-900" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Available Professors in <span className="font-medium">{department}</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select a mentor for your academic projects
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="h-10 w-10 text-gray-400 animate-spin" />
            <p className="text-gray-600">Loading professors...</p>
          </div>
        ) : professors.length === 0 ? (
          <div className="text-center py-32 bg-gray-50 rounded-xl max-w-2xl mx-auto border border-gray-200">
            <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">No Professors Available</h2>
            <p className="text-gray-600 mb-6">
              Currently there are no professors registered in this department.
            </p>
            <button 
              onClick={fetchProfessors}
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Refresh List
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {professors.map((prof) => {
              const isRequested = prof.receivedRequests?.includes(studentId);
              const isRequesting = requestingId === prof._id;

              return (
                <div
                  key={prof._id}
                  className="bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-300 overflow-hidden shadow-sm"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-16 w-16 border border-gray-200">
                        <AvatarImage
                          src={prof.profile.profileImage || undefined}
                          alt={prof.profile.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gray-100 text-gray-800 font-medium">
                          {prof.profile.name?.[0] || 'P'}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{prof.profile.name}</h3>
                        <p className="text-sm text-gray-600">{prof.email}</p>
                        <p className="text-xs text-gray-500 mt-1">{prof.department}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          {prof.currentMenteesCount || 0} current mentees
                        </div>
                        <button
                          onClick={() => handleRequestMentor(prof._id)}
                          disabled={isRequesting || isRequested}
                          className={`px-4 py-2 text-sm rounded-md font-medium transition-all duration-200 ${
                            isRequested
                              ? 'bg-green-100 text-green-600 cursor-not-allowed'
                              : isRequesting
                              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                              : 'bg-gray-900 text-white hover:bg-gray-800'
                          }`}
                        >
                          {isRequested
                            ? 'Request Sent'
                            : isRequesting
                            ? (
                                <span className="flex items-center gap-2">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Sending...
                                </span>
                              )
                            : 'Request Mentor'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableProfessors;
