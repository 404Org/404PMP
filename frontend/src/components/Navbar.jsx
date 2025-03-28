import React, { useState, useRef, useEffect } from 'react';
import { Home, Folder, LogOut, UserRound, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Notifications from './Notifications';
import Logo from '../assets/images/Logo.png';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isProjectsMenuOpen, setIsProjectsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(() => {
    switch (location.pathname) {
      case '/myprojects': return 'my_projects';
      case '/projects': return 'all_projects';
      case '/users': return 'users';
      case '/home': return 'home';
      case '/newprojects': return 'new_projects';
      default: return null;
    }
  });
  const [value, setValue] = useState(
    location.pathname === '/myprojects' ? 'My Projects' :
      location.pathname === '/projects' ? 'All Projects' :
        location.pathname === '/newprojects' ? 'New Projects' :
          'Projects'
  );
  const projectsMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  const toggleProjectsMenu = () => {
    setIsProjectsMenuOpen(!isProjectsMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/', { replace: true });
  };

  const handleEditProfile = () => {
    navigate('/viewprofile');
  };

  const handleMyProjects = () => {
    setValue('My Projects');
    setActiveSection('my_projects');
    navigate('/myprojects');
  };

  const handleAllProjects = () => {
    setValue('All Projects');
    setActiveSection('all_projects');
    navigate('/projects');
  };

  const handleNewProjects = () => {
    setValue('New Projects');
    setActiveSection('new_projects');
    navigate('/newprojects');
  };

  const handleHomePage = () => {
    setActiveSection('home');
    setIsProfileMenuOpen(false);
    navigate('/home');
  };

  const handleViewUsers = () => {
    setActiveSection('users');
    setIsProfileMenuOpen(false);
    navigate('/users');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (projectsMenuRef.current && !projectsMenuRef.current.contains(event.target)) {
        setIsProjectsMenuOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [projectsMenuRef, profileMenuRef]);

  if (!user) return null;

  return (
    <div className="sticky top-0 z-50 bg-gray-100 flex flex-col">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-1 flex justify-between items-center">
            <Link to={'/'}>
          <div className="flex items-center">
            <img src={Logo} alt="Logo" className="h-10 mr-2" />
            <div className="text-xl font-bold text-gray-800">Project Portal</div>
          </div>
            </Link> 

          <div className="flex space-x-6">
            <button
              onClick={handleHomePage}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${activeSection === 'home' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
                }`}
            >
              <Home size={20} />
              <span>Home</span>
            </button>

            <div className="relative" ref={projectsMenuRef}>
              <button
                onClick={toggleProjectsMenu}
                className={`flex items-center space-x-2 p-2 rounded-lg ${['my_projects', 'all_projects', 'new_projects'].includes(activeSection) ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
                  }`}
              >
                <Folder size={20} />
                <span>{value}</span>
                <ChevronDown size={20} className="text-gray-500" />
              </button>

              {isProjectsMenuOpen && (
                <div className="absolute left-1/2 top-full transform -translate-x-1/2 mt-2 w-40 bg-white shadow-lg rounded-lg border z-10">
                  <div className="p-2">
                    <button
                      onClick={handleMyProjects}
                      className={`w-full text-left p-2 mb-2 rounded-md ${activeSection === 'my_projects' ? 'bg-blue-100' : 'hover:bg-gray-100'
                        }`}
                    >
                      My Projects
                    </button>
                    <button
                      onClick={handleAllProjects}
                      className={`w-full text-left p-2 rounded-md ${activeSection === 'all_projects' ? 'bg-blue-100' : 'hover:bg-gray-100'
                        }`}
                    >
                      All Projects
                    </button>

                    <button
                      onClick={handleNewProjects}
                      className={`w-full text-left mt-2 p-2 rounded-md ${activeSection === 'new_projects' ? 'bg-blue-100' : 'hover:bg-gray-100'
                        }`}
                    >
                      New Projects
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleViewUsers}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${activeSection === 'users' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
                }`}
            >
              <UserRound size={20} />
              <span>Users</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Notifications />
            </div>

            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={toggleProfileMenu}
                className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 font-semibold bg-blue-400 rounded-full flex items-center justify-center text-white">
                    {user.name?.charAt(0).toUpperCase()}{user.name?.charAt(1).toUpperCase()}
                  </div>
                </div>
                {/* <div className="pt-2">
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.role}</p>
                </div> */}
                <ChevronDown size={20} className="text-gray-500" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg border z-10 userDropdown">
                  <div className="p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="flex-shrink-0">
                        <div className="bg-blue-400 font-semibold text-2xl rounded-full flex items-center justify-center text-white w-14 h-14">
                          {user.name?.charAt(0).toUpperCase()}{user.name?.charAt(1).toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-sm text-gray-500">{user.role}</p>
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
