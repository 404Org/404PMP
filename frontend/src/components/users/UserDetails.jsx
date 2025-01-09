import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import AuthErrorModal from '../AuthErrorModal';

const UserDetails = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects(userData);
  }, [userData]);

  const fetchProjects = async (userData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401 || !token) {
        <AuthErrorModal />
      }

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }


      const data = await response.json();
      // Filter projects based on whether the user is part of the team members
      const filteredProjects = data.projects.filter(project =>
        project.team_members.some(member => member.user_id === userData._id)
      );
      setProjects(filteredProjects);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.status === 401 || !token) {
          <AuthErrorModal />
        }
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          setError('Failed to fetch user data');
        }

      } catch (error) {
        setError('An error occurred while fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-lg shadow-sm max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <h1 className="text-2xl font-semibold text-gray-800">{userData.name}</h1>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Back
            </button>
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
                {error}
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="text-gray-800">{userData.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Designation</label>
                <p className="text-gray-800">{userData.designation}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Experience</label>
                <p className="text-gray-800">{userData.experience}</p>
              </div>
            </div>
            <div className="col-span-full mt-4">
              <label className="text-sm text-gray-500">Bio</label>
              <p className="text-gray-800 mt-1 whitespace-pre-line">{userData.bio}</p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-6">
            <label className="text-sm text-gray-500 block mb-2">Tech Stack</label>
            <div className="flex flex-wrap gap-2">
              {userData.skills ? (
                typeof userData.skills === 'string' ?
                  userData.skills.split(',').map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                    >
                      {skill.trim()}
                    </span>
                  ))
                  : Array.isArray(userData.skills) ?
                    userData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                      >
                        {skill.trim()}
                      </span>
                    ))
                    : <span className="text-gray-500">No skills listed</span>
              ) : (
                <span className="text-gray-500">No skills listed</span>
              )}
            </div>
          </div>

          {/* Projects */}
          <div>
            <label className="text-sm text-gray-500 block mb-2">Projects</label>
            <div className="space-y-2">
              {projects.length > 0 ? (
                projects.map((project, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 bg-gray-50 rounded-md text-gray-700"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{project.title}</h3>
                      </div>
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
                  </div>
                ))
              ) : (
                <div className="text-red-500 px-4 py-2 rounded-full mb-2 flex flex-col items-center justify-center">
                  No Projects Yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails; 