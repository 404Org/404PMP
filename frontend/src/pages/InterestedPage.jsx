import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserCircle, CheckCircle, XCircle, Mail } from 'lucide-react';
import Navbar from '../components/Navbar';
import AuthErrorModal from '../components/AuthErrorModal';

const InterestedPage = () => {
  const { projectId } = useParams();

  const [activeTab, setActiveTab] = useState('interested');
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const [interestedUsers, setInterestedUsers] = useState([
    {
      id: 1,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      skills: ["React", "Node.js", "Python"],
      matchingSkills: ["React", "Node.js"],
      experience: "5 years",
      status: "pending"
    },
    {
      id: 2,
      name: "John Doe",
      email: "john.doe@example.com",
      skills: ["JavaScript", "React", "MongoDB"],
      matchingSkills: ["React"],
      experience: "3 years",
      status: "pending"
    }
  ]);

  const [otherUsers, setOtherUsers] = useState([
    {
      id: 3,
      name: "Alice Johnson",
      email: "alice.j@example.com",
      skills: ["Python", "Django", "PostgreSQL"],
      matchingSkills: ["Python"],
      experience: "4 years",
      status: "pending"
    },
    {
      id: 4,
      name: "Bob Wilson",
      email: "bob.w@example.com",
      skills: ["React", "Vue.js", "TypeScript"],
      matchingSkills: ["React"],
      experience: "2 years",
      status: "pending"
    }
  ]);

  const [projectRequiredSkills] = useState([
    "React",
    "Node.js",
    "Python",
    "MongoDB"
  ]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/projects/${projectId}`, {
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

  const calculateMatchPercentage = (userSkills) => {
    const matchingSkills = userSkills.filter(skill =>
      projectRequiredSkills.includes(skill)
    );
    return Math.round((matchingSkills.length / projectRequiredSkills.length) * 100);
  };

  const handleAccept = (userId) => {
    console.log('Accepted user:', userId);
  };

  const handleReject = (userId) => {
    console.log('Rejected user:', userId);
  };

  const UsersList = ({ users }) => (
    <div className="space-y-4">
      <div className="bg-slate-100 p-3 rounded-lg">
        <h3 className="font-medium mb-2">Required Project Skills:</h3>
        <div className="flex flex-wrap gap-2">
          {project.tech_stack.map(skill => (
            <span key={skill} className="px-2 py-1 bg-slate-200 text-slate-700 text-sm rounded-full">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {users.map(user => (
        <div key={user.id} className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <UserCircle className="h-12 w-12 text-slate-400" />
              <div>
                <h3 className="font-medium text-lg">{user.name}</h3>
                <p className="text-sm text-slate-500">{user.experience} experience</p>

                <div className="mt-2">
                  <p className="text-sm font-medium mb-1">Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map(skill => (
                      <span
                        key={skill}
                        className={`px-2 py-1 text-sm rounded-full ${user.matchingSkills.includes(skill)
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-slate-200 text-slate-700'
                          }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-2">
                  <span className="text-sm font-medium">
                    Skills Match: {calculateMatchPercentage(user.skills)}%
                  </span>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${calculateMatchPercentage(user.skills)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleAccept(user.id)}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                Accept
              </button>
              <button
                onClick={() => handleReject(user.id)}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col w-full">
      <Navbar />
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="w-full">
          {/* Custom Tabs */}
          <div className="flex rounded-lg bg-slate-100 p-1 mb-4">
            <button
              onClick={() => setActiveTab('interested')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'interested'
                  ? 'bg-white shadow-sm'
                  : 'text-slate-600 hover:bg-white/50'
                }`}
            >
              Interested Users ({interestedUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('other')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'other'
                  ? 'bg-white shadow-sm'
                  : 'text-slate-600 hover:bg-white/50'
                }`}
            >
              Other Users ({otherUsers.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b px-6 py-4">
              <h2 className="text-xl font-semibold">
                {activeTab === 'interested' ? 'Interested Users' : 'Other Users'}
              </h2>
            </div>
            <div className="p-6">
              <UsersList users={activeTab === 'interested' ? interestedUsers : otherUsers} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestedPage;