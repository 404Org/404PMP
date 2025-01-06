import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import AuthErrorModal from '../components/AuthErrorModal';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showActions, setShowActions] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchProjects();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowActions(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      if (response.status === 401 || !token) {
        <AuthErrorModal />
      }

      const data = await response.json();
      setProjects(data.projects);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      if (response.status === 401 || !token) {
        <AuthErrorModal />
      }

      fetchProjects();
    } catch (err) {
      console.error(err);
      alert('Failed to delete project');
    }
  };

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 relative flex flex-col h-64" // Fixed height
              >
                {/* Top Section - Header */}
                <div
                  className="p-6 cursor-pointer flex flex-col flex-grow"
                  onClick={() => navigate(`/projects/${project._id}`)}
                >


                  {/* Title and Status */}
                  <div className="flex justify-start items-start mb-3">
                    <h2 className="text-xl font-semibold">{project.title}</h2>
                    <span className={`px-3 py-1 ml-auto rounded-full text-sm ${project.status === 'completed' ? 'bg-green-100 text-green-800' :
                      project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                      {project.status.replace('_', ' ')}
                    </span>

                    {/* Admin Actions */}
                    {user?.role === 'admin' && project.project_manager.user_id === user._id && (
                      <div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowActions(showActions === project._id ? null : project._id)
                          }}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                        {showActions === project._id && (
                          <div 
                            ref={dropdownRef}
                            className="absolute right-0 mt-2 w-38 bg-white rounded-lg shadow-lg border border-gray-200">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/projects/${project._id}/edit`);
                              }}
                              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Project
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(project._id);
                              }}
                              className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Project
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Description with fixed height */}
                  <div className="mb-4 flex-grow">
                    <p className="text-gray-600 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Section - Team Members */}
                <div className="px-6 py-4 border-t border-gray-100 mt-auto">
                  <div className="flex -space-x-2">
                    {project.team_members.length > 2 ? (
                      <>
                        {project.team_members.slice(0, 2).map((member) => (
                          <div
                            key={member.name}
                            className="w-10 h-10 font-semibold bg-blue-400 text-white rounded-full flex items-center justify-center border-2 border-white"
                            title={`${member.name}`}
                          >
                            {member.name.charAt(0).toUpperCase()}{member.name.charAt(1).toUpperCase()}
                          </div>
                        ))}
                        <div
                          className="w-10 h-10 font-semibold bg-blue-400 text-white rounded-full flex items-center justify-center border-2 border-white"
                          title={project.team_members.slice(2).map(member => member.name).join(', ')}>
                          +{project.team_members.length - 2}
                        </div>
                      </>
                    ) : (
                      project.team_members.map((member) => (
                        <div
                          key={member.name}
                          className="w-10 h-10 font-semibold bg-blue-400 text-white rounded-full flex items-center justify-center border-2 border-white"
                          title={`${member.name}`}
                        >
                          {member.name.charAt(0).toUpperCase()}{member.name.charAt(1).toUpperCase()}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectList; 