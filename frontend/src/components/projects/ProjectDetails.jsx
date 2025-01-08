import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import Comments from '../comments/Comments';
import KnowledgeBaseManager from '../KnowledgeBase';
import AuthErrorModal from '../AuthErrorModal';
import { UsersRound } from 'lucide-react';

const ProjectDetails = () => {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [interestedUsersCount, setInterestedUsersCount] = useState(0);

  const handleInterestPage = () => {
    navigate(`/interested/${id}`);
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchProject();
    fetchInterestedUsers();
    // eslint-disable-next-line
  }, [id]);

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401 || !token) {
        <AuthErrorModal />
      }

      if (!response.ok) {
        throw new Error('Failed to fetch project details');
      }

      const data = await response.json();
      setProject(data.project);
    } catch (err) {
      setError('Failed to fetch project details');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInterestedUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/projects/${id}/interested`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch interested users');
      }

      const data = await response.json();
      setInterestedUsersCount(data.interested_users.length);
    } catch (err) {
      console.error('Failed to fetch interested users:', err);
    }
  };

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-600">{error}</div>;
  if (!project) return <div className="text-center mt-8">Project not found</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Left Section: Project Details */}
            <div className="flex-1 space-y-4 lg:space-y-6">
              {/* Project Card */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                  <h1 className="text-3xl sm:text-3xl font-semibold text-gray-900">{project.title}</h1>
                  {user?.role === 'admin' && project.project_manager.user_id === user._id && (
                    <div className="flex items-center w-full sm:w-auto">
                      {project.status === "upcoming" && (
                        <div className="relative group">
                          <button
                            onClick={handleInterestPage}
                            className="flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-110 text-blue-400"
                          >
                            <UsersRound className="w-6 h-6 sm:w-8 sm:h-8" />
                            {interestedUsersCount > 0 && (
                              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {interestedUsersCount}
                              </span>
                            )}
                          </button>
                          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-32 px-2 py-1 bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center">
                            View Interested Users
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => navigate(`/projects/${id}/edit`)}
                        className="px-4 py-2 ml-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 w-full sm:w-32"
                      >
                        Edit Project
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {/* Description */}
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold mb-2">Description</h2>
                    <p className="text-gray-700">{project.description}</p>
                  </div>

                  {/* Status and Timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold mb-2">Status</h2>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm ${
                          project.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : project.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold mb-2">Timeline</h2>
                      <p className="text-gray-700">
                        {new Date(project.start_date).toLocaleDateString()} -{' '}
                        {new Date(project.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments Section - Hidden on mobile */}
              <div className="hidden lg:block">
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-8">
                  <Comments projectId={id} />
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col gap-4 lg:gap-6 lg:w-96">
              {/* Team Members Card */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4">Team Members</h2>
                <div className="border-t border-gray-200 mt-2 pt-4 space-y-4">
                  {[project.project_manager, ...project.team_members.filter(
                    (member) => member.user_id !== project.project_manager.user_id
                  )].map((member, index) => {
                    if (typeof member.name === 'string') {
                      return (
                        <div
                          key={index}
                          className="flex rounded-l-3xl p-1 items-center space-x-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => navigate(`/users/${member.user_id}`)}
                        >
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-400 font-semibold rounded-full flex items-center justify-center text-white">
                            {member.name.charAt(0).toUpperCase()}{member.name.charAt(1).toUpperCase()}
                          </div>
                          <span className="text-gray-700 text-sm sm:text-base">
                            {member?.user_id === project.project_manager.user_id
                              ? `${member.name} (PM)`
                              : member.name}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4">Tech Stack</h2>
                <div className="border-t border-gray-200 mt-2 pt-4">
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Knowledge Base */}
              <div>
                <KnowledgeBaseManager />
              </div>
            </div>
          </div>

          {/* Comments Section - Only visible on mobile */}
          <div className="lg:hidden mt-4">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-8">
              <Comments projectId={id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;