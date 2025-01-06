import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, AtSign, Briefcase, Star, FileText, Layers } from 'lucide-react';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    designation: '',
    experience: '',
    skills: '',
    bio: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();
  const [skillInput, setSkillInput] = useState('');
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);

  // Add suggested skills list
  const suggestedSkills = {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Clear password error when either password field changes
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const handleBlur = (e) => {
    if (e.target.name === 'email' && formData.email) {
      if (!formData.email.endsWith('@terawe.com')) {
        setEmailError('Please use a valid Terawe email address (name@terawe.com)');
      } else {
        setEmailError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the form is valid
    if (!e.target.checkValidity()) {
      e.target.reportValidity(); // This will show the required messages
      return; // Prevent submission if the form is invalid
    }

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    // Clear any previous password error
    setPasswordError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          designation: formData.designation,
          experience: formData.experience,
          skills: formData.skills.split(',').map(skill => skill.trim()),
          bio: formData.bio,
          password: formData.password,
          confirm_password: formData.confirmPassword
        }),
      });

      const data = await response.json();
      console.log('Response from server:', data);

      if (response.ok) {
        console.log('User created successfully:', data);
        navigate('/');
      } else {
        console.error('Signup error:', data);
        // Set email error if the error is about existing email
        if (data.error === 'Email already exists') {
          setEmailError(data.error);
        } else {
          setPasswordError(data.error);
        }
      }
    } catch (error) {
      console.error('Network error:', error);
      // Handle network errors
    }
  };

  // Add these new handlers
  const handleAddSkill = (skill) => {
    const currentSkills = formData.skills ? formData.skills.split(',').map(s => s.trim()) : [];
    if (skill && !currentSkills.includes(skill)) {
      const newSkills = [...currentSkills, skill].join(', ');
      setFormData(prev => ({
        ...prev,
        skills: newSkills
      }));
    }
    setSkillInput('');
    setShowSkillSuggestions(false);
  };

  const handleSkillInputChange = (e) => {
    setSkillInput(e.target.value);
    setShowSkillSuggestions(true);
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      handleAddSkill(skillInput.trim());
    }
  };

  // Replace the existing skills input with this new version
  const skillsSection = (
    <div className="relative">
      <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <div className="mt-1 pl-10 pr-3 py-2 border rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 flex flex-wrap items-center gap-2">
        {formData.skills.split(',').map((skill, index) => (
          skill.trim() && (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-sm flex items-center gap-1"
            >
              {skill.trim()}
              <button
                type="button"
                onClick={() => {
                  const newSkills = formData.skills
                    .split(',')
                    .filter((s, i) => i !== index)
                    .join(', ');
                  setFormData(prev => ({ ...prev, skills: newSkills }));
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
          value={skillInput}
          onChange={handleSkillInputChange}
          onKeyDown={handleSkillKeyDown}
          onFocus={() => setShowSkillSuggestions(true)}
          placeholder={formData.skills ? "" : "Add skills..."}
          className="flex-1 min-w-[120px] outline-none text-gray-900 placeholder-gray-400"
        />
      </div>

      {/* Skills suggestions dropdown */}
      {showSkillSuggestions && skillInput && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border max-h-40 overflow-y-auto">
          {Object.entries(suggestedSkills).map(([category, skills]) => {
            const filteredSkills = skills.filter(skill =>
              skill.toLowerCase().includes(skillInput.toLowerCase()) &&
              !formData.skills.includes(skill)
            );

            if (filteredSkills.length === 0) return null;

            return (
              <div key={category}>
                <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700">
                  {category}
                </div>
                {filteredSkills.map((skill) => (
                  <div
                    key={skill}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleAddSkill(skill)}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            );
          })}
          {skillInput && !Object.values(suggestedSkills).flat().includes(skillInput) && (
            <div className="px-4 py-2 text-gray-500 text-sm">
              Press Enter to add "{skillInput}"
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Create Your Account</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Email Address"
              required
              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${emailError
                ? 'border-red-500 focus:ring-red-500'
                : 'focus:ring-blue-500'
                }`}
            />
          </div>

          {/* Email Error Message */}
          {emailError && (
            <p className="text-red-500 text-sm">
              {emailError}
            </p>
          )}

          {/* Role Input */}
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Designation"
              required
              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Experience Input */}
          <div className="relative">
            <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Years of Experience"
              required
              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Skills Input */}
          {skillsSection}

          {/* Bio Input */}
          <div className="relative">
            <FileText className="absolute left-3 top-4 transform text-gray-400" size={20} />
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Short Bio"
              rows={3}
              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${passwordError
                ? 'border-red-500 focus:ring-red-500'
                : 'focus:ring-blue-500'
                }`}
            />
          </div>

          {/* Password Error Message */}
          {passwordError && (
            <p className="text-red-500 text-sm text-center">
              {passwordError}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Create Account
          </button>

          {/* Login Redirect */}
          <p className="text-center mt-4 text-sm text-gray-600">
            Already a user?
            <a href="/" className="text-blue-500 ml-1 hover:underline">
              Go to Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;