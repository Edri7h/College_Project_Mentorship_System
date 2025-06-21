import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PROFESSOR_API_END_POINT } from '@/utils/constants';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";

const PendingRequests = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${PROFESSOR_API_END_POINT}/get-pending-requests`, {
        withCredentials: true,
      });
      setRequests(res.data.requests);
    } catch (error) {
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, action) => {
    try {
      await axios.post(
        `${PROFESSOR_API_END_POINT}/${action}-request/${requestId}`,
        {},
        { withCredentials: true }
      );
      toast.success(`Request ${action}ed`);
      fetchRequests(); // refresh
    } catch (error) {
      toast.error(error.response?.data?.message || "Error occurred");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <div>Loading pending requests...</div>;

  if (requests.length === 0) return <div>No pending requests.</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pending Mentorship Requests</h2>
      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req._id}
            className="border p-4 rounded-lg bg-white shadow-sm flex justify-between items-center"
          >
            <div>
              <p><strong>Student:</strong> {req.requestBy.profile.name} ({req.requestBy.profile.rollNo})</p>
              <p><strong>Email:</strong> {req.requestBy.email}</p>
              <p><strong>Project:</strong> {req.forProject.title} [{req.forProject.category}]</p>
            </div>
            <div className="space-x-2">
              <Button
                variant="success"
                onClick={() => handleAction(req._id, "accept")}
              >
                Accept
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleAction(req._id, "reject")}
              >
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingRequests;
