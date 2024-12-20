import React, { useState } from 'react';
import { Home, Folder, LogOut, UserRound, ChevronDown, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Notifications from './Notifications';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  //const avatar = null;

  const getActiveSection = () => {
    switch (location.pathname) {
      case '/myprojects': return 'my_projects';
      case '/projects': return 'all_projects';
      case '/users': return 'users';
      case '/home': return 'home';
      default: return 'null';
    }
  };

  const activeSection = getActiveSection();

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/');
  };

  const handleEditProfile = () => {
    navigate('/viewprofile');
  };

  const handleMyProjects = () => {
    setIsProfileMenuOpen(false);
    navigate('/myprojects');
  };

  const handleAllProjects = () => {
    setIsProfileMenuOpen(false);
    navigate('/projects');
  }

  const handleHomePage = () => {
    setIsProfileMenuOpen(false);
    navigate('/home')
  }

  const handleViewUsers = () => {
    setIsProfileMenuOpen(false);
    navigate('/users');
  }

  // useEffect(() => {
  //   // Check if user is logged in
  //   const token = localStorage.getItem('token');
  //   const userData = localStorage.getItem('user');

  //   if (!token || !userData) {
  //     navigate('/', { replace: true });
  //     return;
  //   }

  //   try {
  //     setUser(JSON.parse(userData));
  //   } catch (error) {
  //     console.error('Error parsing user data:', error);
  //     localStorage.removeItem('token');
  //     localStorage.removeItem('user');
  //     navigate('/', { replace: true });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [navigate]);



  if (!user) return null;

  return (
    <div className="bg-gray-100 flex flex-col">
      {/* Horizontal Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo or Brand */}
          <div className="text-xl font-bold text-gray-800">Project Portal</div>

          {/* Main Navigation */}
          <div className="flex space-x-6">
            <button
              onClick={handleHomePage}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${activeSection === 'home' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <Home size={20} />
              <span>Home</span>
            </button>

            <button
              onClick={handleMyProjects}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${activeSection === 'my_projects' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <Folder size={20} />
              <span>My Projects</span>
            </button>

            <button
              onClick={handleAllProjects}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${activeSection === 'all_projects' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <Folder size={20} />
              <span>All Projects</span>
            </button>

            <button
              onClick={handleViewUsers}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${activeSection === 'users' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <UserRound size={20} />
              <span>Users</span>
            </button>            
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Notifications />
            </div>

            {/* Profile Section */}
            <div className="relative">
              <button
                onClick={toggleProfileMenu}
                className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg"
              >
                {/* <img 
              src="/api/placeholder/40/40" 
              alt="Profile" 
              className="w-10 h-10 rounded-full"
            /> */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="pt-2">
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.role}</p>
                </div>
                <ChevronDown size={20} className="text-gray-500" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg border z-10">
                  <div className="p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      {/* <img
                      src="/api/placeholder/50/50"
                      alt="Profile"
                      className="w-12 h-12 rounded-full"
                    /> */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <button
                        onClick={handleEditProfile}
                        className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md"
                      >
                        <UserRound size={18} className="text-gray-500" />
                        <span>View Profile</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md"
                      >
                        <LogOut size={18} className="text-gray-500" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
