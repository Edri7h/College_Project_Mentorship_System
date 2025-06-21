import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constants';
import { toast } from 'sonner';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectingProjectId, setSelectingProjectId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${USER_API_END_POINT}/get-projects`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setProjects(response.data.projects || []);
      } else {
        toast.error(response.data.message || 'Failed to fetch projects');
      }
    } catch (error) {
      toast.error(error.message || 'Error fetching projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProject = async (projectId) => {
    setSelectingProjectId(projectId);
    try {
      const response = await axios.post(
        `${USER_API_END_POINT}/select-project`,
        { projectId },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Project selected successfully!');
        navigate('/student/available-professors');
      } else {
        toast.error(response.data.message || 'Failed to select project');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error selecting project');
    } finally {
      setSelectingProjectId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="border-b border-gray-200 pb-10 mb-10">
          <div className="flex items-center gap-4 mb-4">
            <BookOpen className="h-8 w-8 text-black" />
            <h1 className="text-4xl font-semibold text-black tracking-tight">All Projects</h1>
          </div>
          <p className="text-gray-600 text-base font-light">
            View available and already selected projects. You can only select one that is currently available.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-10 h-10 border-2 border-gray-300 border-t-black rounded-full animate-spin mb-6" />
            <p className="text-gray-500 text-base font-light">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-32">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-light text-gray-700 mb-3">No Projects Available</h3>
            <p className="text-gray-500 text-base font-light">Check back later for new opportunities</p>
          </div>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="border border-gray-200 rounded-xl bg-white transition-all duration-300"
              >
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <h3 className="text-2xl font-semibold text-black">{project.title}</h3>
                      {project.description && (
                        <p className="text-gray-700 text-base leading-relaxed">
                          {project.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                        {project.department && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-black">Department:</span>
                            <span>{project.department}</span>
                          </div>
                        )}
                        {project.duration && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-black">Duration:</span>
                            <span>{project.duration}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="lg:ml-8 pt-4 lg:pt-0">
                      <button
                        onClick={() => handleSelectProject(project._id)}
                        disabled={!project.isAvailable || selectingProjectId === project._id}
                        className={`rounded-md px-6 py-3 text-sm font-medium transition-all duration-200 ${
                          !project.isAvailable
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            : selectingProjectId === project._id
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-black text-white hover:bg-gray-800 hover:shadow'
                        }`}
                      >
                        {!project.isAvailable
                          ? 'Not Available'
                          : selectingProjectId === project._id
                          ? 'Selecting...'
                          : 'Select Project'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProjects;
