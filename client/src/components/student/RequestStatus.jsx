import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constants';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const RequestStatus = () => {
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState([]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${USER_API_END_POINT}/get-request-status`, {
                withCredentials: true,
            });

            if (data.success && Array.isArray(data.requests)) {
                setRequests(data.requests);
            } else {
                toast.error(data.message || 'Could not fetch request status');
            }
        } catch (err) {
            toast.error('Failed to fetch request status');
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async (id) => {
        try {
           const res= await axios.patch(`${USER_API_END_POINT}/withdraw-request`, {}, {
                withCredentials: true,
            });


            if (res.data.success) {
                toast.success(res.data.message || 'Request withdrawn successfully');
                fetchRequests();
            } else {
                toast.error(data.message || 'Withdrawal failed');
            }
        } catch (err) {
            toast.error('Error withdrawing request');
        }
    };

    const getStatusClasses = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'withdrawn':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-50 text-gray-600';
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (!requests.length) {
        return (
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle>No Mentorship Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600">You haven&apos;t sent any mentorship requests yet.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="max-w-6xl mx-auto overflow-x-auto">
            <CardHeader>
                <CardTitle>Mentorship Request History</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="w-full overflow-x-auto">
                    <table className="min-w-full text-sm text-left border">
                        <thead className="bg-gray-100 text-xs uppercase text-gray-600 border-b">
                            <tr>
                                <th className="px-4 py-3">Professor</th>
                                <th className="px-4 py-3">Department</th>
                                <th className="px-4 py-3">Project</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => {
                                const isWithdrawable = req.status === 'pending';
                                const statusClass = getStatusClasses(req.status);

                                return (
                                    <tr key={req._id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-2">
                                            {req.forProfessor?.profile?.name || 'Unknown'}
                                        </td>
                                        <td className="px-4 py-2">
                                            {req.forProfessor?.profile?.department || 'N/A'}
                                        </td>
                                        <td className="px-4 py-2">
                                            {req.forProject?.title || 'N/A'}
                                        </td>
                                        <td className="px-4 py-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                                                {req.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-2">
                                            {isWithdrawable ? (
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleWithdraw(req._id)}
                                                    className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                >
                                                    Withdraw
                                                </Button>
                                            ) : (
                                                <span className="text-gray-400 text-xs">N/A</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

export default RequestStatus;
