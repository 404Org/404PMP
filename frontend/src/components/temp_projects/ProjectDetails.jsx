import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import Comments from '../comments/Comments';

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
      <Navbar/>
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-6">
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
              <div>
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-700">{project.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Status</h2>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    project.status === 'completed' ? 'bg-green-100 text-green-800' :
                    project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2">Timeline</h2>
                  <p className="text-gray-700">
                    {new Date(project.start_date).toLocaleDateString()} - 
                    {new Date(project.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Tech Stack</h2>
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

              <div>
                <h2 className="text-xl font-semibold mb-2">Team Members</h2>
                <div className="grid grid-cols-2 gap-4">
                  {project.team_members.map((member, index) => {
                    if (typeof member === 'string') {
                      const firstChar = member.charAt(0);
                      return (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                            {firstChar.toUpperCase()}
                          </div>
                          <span>{member}</span>
                        </div>
                      );
                    } else {
                      console.error('Expected a string but got:', member);
                      return null;
                    }
                  })}
                </div>
              </div>
            </div>
          </div>
          
          <Comments projectId={id} />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails; 