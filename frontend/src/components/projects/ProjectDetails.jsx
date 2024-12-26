import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import Comments from '../comments/Comments';
import KnowledgeBaseManager from '../KnowledgeBase';
import AuthErrorModal from '../AuthErrorModal';

const ProjectDetails = () => {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();


  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchProject();
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

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-600">{error}</div>;
  if (!project) return <div className="text-center mt-8">Project not found</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="py-8 mx-auto">
        <div className="flex max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 gap-6 ">
          {/* Left Section: Project Details */}
          <div className="flex-[2] space-y-6">
            {/* Project Card */}
            <div className="bg-white rounded-lg shadow-md p-6 ml-60">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => navigate(`/projects/${id}/edit`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Edit Project
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h2 className="text-xl font-semibold mb-2">Description</h2>
                  <p className="text-gray-700">{project.description}</p>
                </div>

                {/* Status and Timeline */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Status</h2>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${project.status === 'completed'
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
                    <h2 className="text-xl font-semibold mb-2">Timeline</h2>
                    <p className="text-gray-700">
                      {new Date(project.start_date).toLocaleDateString()} -{' '}
                      {new Date(project.end_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-lg shadow-md p-8 ml-60">
              <Comments projectId={id} />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col gap-6 flex-[0.8] mr-60">

            {/* Team Members Card */}
            <div className="bg-white rounded-lg shadow-md p-6 w-100">
              <h1 className="text-xl font-semibold mb-4">Team Members</h1>
              <div className="border-t border-gray-200 mt-2 pt-4 space-y-4">
                {/* Separate project manager from the rest of the team members */}
                {[
                  project.project_manager, // Add project manager first
                  ...project.team_members.filter(
                    (member) => member.name !== project.project_manager.name
                  ),
                ].map((member, index) => {
                  if (typeof member.name === 'string') {
                    const firstChar = member.name.charAt(0);
                    return (
                      <div
                        key={index}
                        className="flex rounded-l-3xl p-1 items-center space-x-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => navigate(`/users/${member.user_id}`)}
                      >
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                          {firstChar.toUpperCase()}
                        </div>

                        <span className="text-gray-700 text-base">
                          {member.name === project.project_manager.name
                            ? `${member.name} (PM)`
                            : member.name}
                        </span>
                      </div>
                    );
                  } else {
                    console.error('Expected a string but got:', member);
                    return null;
                  }
                })}
              </div>
            </div>


            {/* Tech Stack */}
            <div className="bg-white rounded-lg shadow-md p-6 w-100">
              <h1 className="text-xl font-semibold mb-4">Tech Stack</h1>
              <div className="border-t border-gray-200 mt-2 pt-4 space-y-4">
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

            {/* Additional Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6 w-100">
              <KnowledgeBaseManager />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;