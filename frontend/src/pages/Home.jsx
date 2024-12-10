import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ComingSoon from '../components/ComingSoon';
import Navbar from '../components/Navbar';

const Home = () => {
  const [user, setUser] = useState(null);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/', { replace: true });
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/', { replace: true });
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleProfileAction = () => {
    navigate('/profile');
  };

  const handleViewUsers = () =>{
    navigate('/users');
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  if (showComingSoon) {
    return <ComingSoon />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar title="Project Portal" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Welcome, {user.name}!</h2>
          
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-2">User Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="text-gray-900 capitalize">{user.role}</p>
                </div>
              </div>
            </div>

            {/* Additional sections can be added here */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
              <div className="flex space-x-4">
                <button 
                  onClick={handleProfileAction}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  View Profile
                </button>
                <button 
                  onClick={handleViewUsers}
                  className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  View users
                </button>
                <button 
                  onClick={() => navigate('/projects')}
                  className="px-4 py-2 text-sm text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  View Projects
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
