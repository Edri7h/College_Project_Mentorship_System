import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { USER_API_END_POINT } from '@/utils/constants';
import { toast } from 'sonner';
import { GraduationCap, UserCircle, AlertTriangle, BookOpen } from 'lucide-react';

const InfoCard = ({ icon: Icon, title, children }) => (
  <Card className="hover:shadow-md transition">
    <CardHeader className="flex items-center gap-2">
      {Icon && <Icon className="text-muted-foreground h-6 w-6" />}
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent className="text-sm text-gray-700">{children}</CardContent>
  </Card>
);

const StudentInfo = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [showRequestMentorButton, setShowRequestMentorButton] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${USER_API_END_POINT}/get-dashboard`, {
        withCredentials: true
      });

      if (res.data.success) {
        const { project, showRequestMentorButton, isProfileComplete } = res.data.data;
        setProject(project);
        setShowRequestMentorButton(showRequestMentorButton);
        setIsProfileComplete(isProfileComplete);
      } else {
        toast.error(res.data.message || 'Failed to load dashboard');
      }
    } catch (error) {
      toast.error(error.message || 'Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>
    );
  }

  if (!isProfileComplete) {
    return (
      <div className="max-w-xl mx-auto mt-24 px-4">
        <Alert variant="destructive">
          <AlertTitle className="flex items-center gap-2 text-lg font-semibold">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Profile Incomplete
          </AlertTitle>
          <AlertDescription className="text-sm mt-1">
            Please complete your profile before accessing your dashboard.
          </AlertDescription>
          <Button className="mt-4" onClick={() => navigate('/student/profile')}>
            Complete Profile
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Welcome Banner */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black flex items-center gap-2">
            <UserCircle className="w-8 h-8 text-primary" />
            Welcome to your Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Here's an overview of your project and mentorship status.
          </p>
        </div>

        {/* Project Info */}
        <InfoCard icon={BookOpen} title={project ? 'Your Selected Project' : 'No Project Selected'}>
          {project ? (
            <>
              <h2 className="text-lg font-semibold mb-1">{project.title}</h2>
              <p>{project.description}</p>
              <p className="text-muted-foreground mt-2 text-sm">
                Department: <span className="font-medium">{project.department}</span>
              </p>
            </>
          ) : (
            <div className="flex flex-col items-start">
              <p className="text-gray-600 mb-4">You haven't selected a project yet.</p>
              <Button size="sm" onClick={() => navigate('/student/get-projects')}>
                View Available Projects
              </Button>
            </div>
          )}
        </InfoCard>

        {/* Mentor Status */}
        {project && showRequestMentorButton && (
          <InfoCard icon={GraduationCap} title="Choose Your Mentor">
            <p className="mb-4">
              You're ready to request mentorship for your selected project.
            </p>
            <Button
              onClick={() =>
                navigate('/student/available-professors', {
                  state: { department: project.department }
                })
              }
            >
              Request Mentor
            </Button>
          </InfoCard>
        )}

        {project && !showRequestMentorButton && (
          <InfoCard icon={GraduationCap} title="Mentorship Request Status">
            <p>
              You've already sent a mentorship request. Please wait for the professor's response.
            </p>
          </InfoCard>
        )}
      </div>
    </div>
  );
};

export default StudentInfo;
