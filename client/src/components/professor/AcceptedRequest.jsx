import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PROFESSOR_API_END_POINT } from '@/utils/constants';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const AcceptedRequests = () => {
  const [loading, setLoading] = useState(true);
  const [accepted, setAccepted] = useState([]);

  const fetchAccepted = async () => {
    try {
      const res = await axios.get(`${PROFESSOR_API_END_POINT}/get-accepted-requests`, {
        withCredentials: true,
      });
      setAccepted(res.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch accepted requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccepted();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-600">
        <Loader2 className="animate-spin w-5 h-5 mr-2" />
        Loading accepted requests...
      </div>
    );
  }

  if (accepted.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No accepted mentorship requests yet.
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Accepted Mentorship Requests</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {accepted.map((req) => {
          const student = req.requestBy?.profile || {};
          const project = req.forProject || {};

          return (
            <div
              key={req._id}
              className="border rounded-lg shadow-sm p-5 bg-white space-y-2 hover:shadow-md transition"
            >
              <div>
                <p className="text-sm text-gray-500">Student Name</p>
                <p className="text-base font-medium">{student.name || "N/A"} ({student.rollNo || "N/A"})</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-base">{req.requestBy?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Project</p>
                <p className="text-base font-medium">{project.title || "Untitled"} <span className="text-sm text-gray-400">[{project.category || "General"}]</span></p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AcceptedRequests;
