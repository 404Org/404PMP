import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ComingSoon from '../components/ComingSoon';

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

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/');
  };

  const handleProfileAction = () => {
    setShowComingSoon(true);
  };

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
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Project Portal</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

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
                  onClick={handleProfileAction}
                  className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Edit Details
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
