import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';

const HomePage = () => {
  const [user, setUser] = useState(null);
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
      // console.log(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/', { replace: true });
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col w-full">
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto px-4 py-6 pt-6 w-full max-w-7xl">
        <div className="pt-6">
          <h1 className="text-6xl font-bold text-center mb-8">Project Portal</h1>
        </div>
        <SearchBar />
      </main>
    </div>
  );
};

export default HomePage;
