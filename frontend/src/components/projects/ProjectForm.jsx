import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthErrorModal from '../AuthErrorModal';

const ProjectForm = ({ initialData, onSubmit, isEditing }) => {
  // Transform initial team members data if needed
  const transformInitialTeamMembers = () => {
    if (!initialData?.team_members) return [];
    return initialData.team_members.map(member => {
      // If member is already in the correct format, return as is
      if (member.user_id && member.name && member.email) {
        return member;
      }
      // If member is in old format or different format, try to transform it
      return {
        user_id: member._id || member.user_id || member,
        name: member.name || '',
        email: member.email || ''
      };
    });
  };

  // Transform initial project manager data if needed
  const transformInitialProjectManager = () => {
    if (!initialData?.project_manager) return null;
    const pm = initialData.project_manager;
    // If PM is already in the correct format, return as is
    if (pm.user_id && pm.name && pm.email) {
      return pm;
    }
    // If PM is in old format or different format, try to transform it
    return {
      user_id: pm._id || pm.user_id || pm,
      name: pm.name || '',
      email: pm.email || ''
    };
  };

  const [formData, setFormData] = React.useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'upcoming',
    start_date: initialData?.start_date ? new Date(initialData.start_date).toISOString().split('T')[0] : '',
    end_date: initialData?.end_date ? new Date(initialData.end_date).toISOString().split('T')[0] : '',
    tech_stack: initialData?.tech_stack?.join(', ') || '',
    team_members: transformInitialTeamMembers(),
    project_manager: transformInitialProjectManager()
  });

  const [userSuggestions, setUserSuggestions] = useState([]);
  const [pmSuggestions, setPmSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pmSearchTerm, setPmSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showPmSuggestions, setShowPmSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();
  const [errors, setErrors] = React.useState({}); // State for error messages
  const [techStackInput, setTechStackInput] = useState('');
  const [showTechSuggestions, setShowTechSuggestions] = useState(false);

  // Add this predefined tech stack list
  const suggestedTechStack = {
    "Programming Languages": [
            "JavaScript",
            "Python",
            "Java",
            "C++",
            "C#",
            "Ruby",
            "PHP",
            "Swift",
            "TypeScript",
            "Go",
            "Kotlin",
            "R",
            "MATLAB",
            "Scala",
            "Rust"
        ],
        "Web Technologies": [
            "HTML5",
            "CSS3",
            "ReactJs",
            "Angular",
            "VueJs",
            "NodeJs",
            "ExpressJs",
            "Django",
            "Spring Framework",
            "ASP.NET",
            "Ruby on Rails",
            "Laravel",
            "jQuery",
            "Bootstrap",
            "Tailwind CSS",
            "webpack",
            "REST APIs",
            "GraphQL"
        ],
        "Databases": [
            "SQL",
            "MySQL",
            "PostgreSQL",
            "MongoDB",
            "Oracle Database",
            "Microsoft SQL Server",
            "Redis",
            "Elasticsearch",
            "Cassandra",
            "Firebase"
        ],
        "Cloud Platforms": [
            "Amazon Web Services (AWS)",
            "Microsoft Azure",
            "Google Cloud Platform",
            "Heroku",
            "DigitalOcean",
            "Cloudflare"
        ],
        "DevOps & Tools": [
            "Git",
            "Docker",
            "Kubernetes",
            "Jenkins",
            "Linux",
            "JIRA",
            "Confluence",
            "Maven",
            "Gradle",
            "npm",
            "Terraform",
            "Ansible"
        ],
        "Testing": [
            "Unit Testing",
            "Jest",
            "Selenium",
            "JUnit",
            "TestNG",
            "Cypress",
            "Mocha",
            "PHPUnit"
        ],
        "AI/ML & Data": [
            "Machine Learning",
            "TensorFlow",
            "PyTorch",
            "scikit-learn",
            "Pandas",
            "NumPy",
            "Apache Spark",
            "Power BI",
            "Tableau",
            "SAS"
        ],
        "Mobile Development": [
            "iOS Development",
            "Android Development",
            "React Native",
            "Flutter",
            "Xamarin",
            "SwiftUI",
            "Kotlin Android"
        ],
        "Project Management": [
            "Agile Methodologies",
            "Scrum",
            "Kanban",
            "Waterfall",
            "Project Planning",
            "Team Leadership"
        ],
        "Design Tools": [
            "Figma",
            "Adobe XD",
            "Sketch",
            "Adobe Photoshop",
            "Adobe Illustrator",
            "InVision"
        ]
  };

  // Fetch users for suggestions
  useEffect(() => {
    if (searchTerm.length >= 2) {
      fetchUsers(searchTerm, setUserSuggestions);
    } else {
      setUserSuggestions([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (pmSearchTerm.length >= 2) {
      fetchUsers(pmSearchTerm, setPmSuggestions);
    } else {
      setPmSuggestions([]);
    }
  }, [pmSearchTerm]);

  const fetchUsers = async (term, setSuggestions) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401 || !token) {
        <AuthErrorModal />
      }

      if (!response.ok) throw new Error('Failed to fetch users');

      const users = await response.json();
      const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase())
      );
      setSuggestions(filteredUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'team_members') {
      setSearchTerm(value);
    } else if (name === 'project_manager_search') {
      setPmSearchTerm(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addTeamMember = (user) => {
    if (!formData.team_members.some(member => member.user_id === user._id)) {
      setFormData(prev => ({
        ...prev,
        team_members: [...prev.team_members, {
          user_id: user._id,
          name: user.name,
          email: user.email
        }]
      }));
    }
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const removeTeamMember = (userId) => {
    if (formData.project_manager?.user_id === userId) {
      setFormData(prev => ({
        ...prev,
        team_members: prev.team_members.filter(member => member.user_id !== userId),
        project_manager: null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        team_members: prev.team_members.filter(member => member.user_id !== userId)
      }));
    }
  };

  const setProjectManager = (user) => {
    if (!formData.team_members.some(member => member.user_id === user._id)) {
      setFormData(prev => ({
        ...prev,
        team_members: [...prev.team_members, {
          user_id: user._id,
          name: user.name,
          email: user.email
        }],
        project_manager: {
          user_id: user._id,
          name: user.name,
          email: user.email
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        project_manager: {
          user_id: user._id,
          name: user.name,
          email: user.email
        }
      }));
    }
    setPmSearchTerm('');
    setShowPmSuggestions(false);
  };

  const validateDates = () => {
    const newErrors = {};
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);

    // Check if end date is provided and is after the start date
    if (!formData.end_date) {
      newErrors.end_date = 'End date is required.';
    } else if (endDate <= startDate) {
      newErrors.end_date = 'End date must be after the start date.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!validateDates()) {
      setIsSubmitting(false);
      return; // Stop submission if validation fails
    }

    try {
      // Transform data for API
      const transformedData = {
        ...formData,
        tech_stack: formData.tech_stack.split(',').map(item => item.trim()),
        team_members: formData.team_members.map(member => member.user_id),
        project_manager: formData.project_manager?.user_id,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString()
      };

      await onSubmit(transformedData);
      navigate(-1);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTech = (tech) => {
    const currentTechs = formData.tech_stack ? formData.tech_stack.split(',').map(t => t.trim()) : [];
    if (tech && !currentTechs.includes(tech)) {
      const newTechStack = [...currentTechs, tech].join(', ');
      setFormData(prev => ({
        ...prev,
        tech_stack: newTechStack
      }));
    }
    setTechStackInput('');
    setShowTechSuggestions(false);
  };

  const handleTechInputChange = (e) => {
    setTechStackInput(e.target.value);
    setShowTechSuggestions(true);
  };

  const handleTechKeyDown = (e) => {
    if (e.key === 'Enter' && techStackInput.trim()) {
      e.preventDefault();
      handleAddTech(techStackInput.trim());
    }
  };

  // Replace the existing tech stack input with this new version
  const techStackSection = (
    <div>
      <label className="block text-sm font-medium text-gray-700">Tech Stack</label>
      <div className="relative">
        <div className="mt-1 p-2 w-full rounded-md border-gray-300 shadow-sm focus-within:border-2 focus-within:border-black focus-within:ring-0 focus-within:ring-black flex flex-wrap items-center gap-2">
          {formData.tech_stack.split(',').map((tech, index) => (
            tech.trim() && (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-sm flex items-center gap-1"
              >
                {tech.trim()}
                <button
                  type="button"
                  onClick={() => {
                    const newTechStack = formData.tech_stack
                      .split(',')
                      .filter((t, i) => i !== index)
                      .join(', ');
                    setFormData(prev => ({ ...prev, tech_stack: newTechStack }));
                  }}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )
          ))}
          <input
            type="text"
            value={techStackInput}
            onChange={handleTechInputChange}
            onKeyDown={handleTechKeyDown}
            onFocus={() => setShowTechSuggestions(true)}
            placeholder={formData.tech_stack ? "" : "Add technologies..."}
            className="flex-1 min-w-[120px] outline-none text-gray-900 placeholder-gray-500"
          />
        </div>

        {/* Tech suggestions dropdown */}
        {showTechSuggestions && techStackInput && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border max-h-40 overflow-y-auto">
            {Object.entries(suggestedTechStack).map(([category, technologies]) => {
              const filteredTechs = technologies.filter(tech =>
                tech.toLowerCase().includes(techStackInput.toLowerCase()) &&
                !formData.tech_stack.includes(tech)
              );

              if (filteredTechs.length === 0) return null;

              return (
                <div key={category}>
                  <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700">
                    {category}
                  </div>
                  {filteredTechs.map((tech) => (
                    <div
                      key={tech}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleAddTech(tech)}
                    >
                      {tech}
                    </div>
                  ))}
                </div>
              );
            })}
            {techStackInput && !Object.values(suggestedTechStack).flat().includes(techStackInput) && (
              <div className="px-4 py-2 text-gray-500 text-sm">
                Press Enter to add "{techStackInput}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="upcoming">Upcoming</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="on_hold">On Hold</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            required
            className={`mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.end_date ? 'border-red-500' : ''}`}
          />
          {errors.end_date && <p className="text-red-600 text-sm">{errors.end_date}</p>}
        </div>
      </div>

      {techStackSection}

      <div className="relative">
        <label className="block text-sm font-medium text-gray-700">Team Members</label>
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          onFocus={() => setShowSuggestions(true)}
          name="team_members"
          placeholder="Search users..."
          className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />

        {/* User suggestions dropdown */}
        {showSuggestions && userSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
            {userSuggestions.map(user => (
              <div
                key={user._id}
                onClick={() => addTeamMember(user)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="w-9 h-9 bg-blue-400 font-semibold rounded-full flex items-center justify-center text-white mr-2">
                    {user.name?.charAt(0)?.toUpperCase() || '?'}{user.name?.charAt(1)?.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium">{user.name || 'Unknown'}</div>
                    <div className="text-sm text-gray-500">{user.email || ''}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected team members */}
        <div className="mt-2 space-y-2">
          {formData.team_members.map(member => (
            <div key={member.user_id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
              <div className="flex items-center">
                <div className="w-9 h-9 bg-blue-400 font-semibold rounded-full flex items-center justify-center text-white mr-2">
                  {member.name?.charAt(0)?.toUpperCase() || '?'}{member.name?.charAt(1)?.toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{member.name || 'Unknown'}</div>
                  <div className="text-sm text-gray-500">{member.email || ''}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeTeamMember(member.user_id)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-gray-700">Project Manager</label>
        <input
          type="text"
          value={pmSearchTerm}
          onChange={handleChange}
          onFocus={() => setShowPmSuggestions(true)}
          name="project_manager_search"
          placeholder="Search for project manager..."
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />

        {/* Project Manager suggestions */}
        {showPmSuggestions && pmSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
            {pmSuggestions.map(user => (
              <div
                key={user._id}
                onClick={() => setProjectManager(user)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <div className="flex items-center">
                  <div className="w-9 h-9 bg-blue-400 font-semibold rounded-full flex items-center justify-center text-white mr-2">
                    {user.name?.charAt(0)?.toUpperCase() || '?'}{user.name?.charAt(1)?.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium">{user.name || 'Unknown'}</div>
                    <div className="text-sm text-gray-500">{user.email || ''}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Project Manager */}
        {formData.project_manager && (
          <div className="mt-2">
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
              <div className="flex items-center">
                <div className="w-9 h-9 bg-blue-400 font-semibold rounded-full flex items-center justify-center text-white mr-2">
                  {formData.project_manager.name?.charAt(0)?.toUpperCase() || '?'}{formData.project_manager.name?.charAt(1)?.toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{formData.project_manager.name || 'Unknown'}</div>
                  <div className="text-sm text-gray-500">{formData.project_manager.email || ''}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, project_manager: null }))}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm; 