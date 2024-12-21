import React, { useState, useEffect } from "react";
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  // Fetch all projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/projects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setProjects(data.projects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  
    if (value.trim() === '') {
      setShowResults(false);
      return;
    }
  
    const filtered = projects.filter(project => {
      const searchValue = value.toLowerCase();
      return (
        // Search by project title
        project.title.toLowerCase().includes(searchValue) ||
        // Search by tech stack
        project.tech_stack.some(tech =>
          tech.toLowerCase().includes(searchValue)
        ) ||
        // Search by team members
        project.team_members.some(member =>
          member.name.toLowerCase().includes(searchValue)
        )
      );
    });
  
    setFilteredProjects(filtered);
    setShowResults(true);
  };
  

  // Handle project selection
  const handleProjectClick = (projectId) => {
    setShowResults(false);
    setSearchTerm("");
    navigate(`/projects/${projectId}`);
  };

  // Handle click outside search results
  useEffect(() => {
    const handleClickOutside = () => setShowResults(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col items-center pt-2 w-full relative" onClick={e => e.stopPropagation()}>
      {/* Illustration Section */}
      <div className="flex flex-wrap items-center justify-center gap-4 max-w-6xl">
        <div className="flex flex-col items-center gap-2">
          <div className="bg-gray-300 w-8 h-8 rounded-full"></div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="bg-yellow-300 w-8 h-8 rounded-full"></div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="bg-blue-300 w-8 h-8 rounded-full"></div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="bg-pink-300 w-8 h-8 rounded-full"></div>
        </div>
      </div>

      {/* Search Section */}
      <div className="mt-8 w-full flex flex-col items-center">
        <div className="relative w-full max-w-2xl">
          <div className="flex items-center justify-center border border-gray-300 rounded-full shadow-md p-1 min-h-16 w-full">
            <input
              type="text"
              className="flex-1 outline-none text-gray-700 bg-gray-100 rounded-l-full pl-4"
              placeholder="Search projects, technologies, or team members..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="outline-none text-gray-500 bg-gray-100 rounded-r-full pr-4">
              <Search size={20} />
            </button>
          </div>

          {/* Search Results Dropdown */}
          {showResults && filteredProjects.length > 0 && (
            <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
              {filteredProjects.map((project) => (
                <div
                  key={project._id}
                  className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  onClick={() => handleProjectClick(project._id)}
                >
                  <div className="font-semibold text-gray-800">{project.title}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {project.tech_stack.join(", ")}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Team: {project.team_members.map((member, index) => {
                      if (typeof member.name === 'string') {
                        return (
                          <span>{member.name}, </span>
                        );
                      } else {
                        console.error('Expected a string but got:', member);
                        return null;
                      }
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {showResults && filteredProjects.length === 0 && searchTerm && (
            <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg p-4 text-center text-gray-500">
              No projects found matching your search.
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Search through projects by name, technology stack, or team members
        </p>
      </div>
    </div>
  );
};

export default SearchBar;