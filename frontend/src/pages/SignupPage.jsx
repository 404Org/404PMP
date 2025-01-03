import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, AtSign, Briefcase, Star, FileText } from 'lucide-react';
import TechStackCombobox from '../components/TechStackCombobox';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    designation: '',
    experience: '',
    skills: [],
    bio: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

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

  const handleSkillsChange = (selectedSkills) => {
    setFormData(prevState => ({
      ...prevState,
      skills: selectedSkills
    }));
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
          skills: formData.skills,
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
              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                emailError
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

          {/* Replace the Skills Input with TechStackCombobox */}
          <div className="mb-4">
            <TechStackCombobox
              selectedTechs={formData.skills}
              onChange={handleSkillsChange}
            />
          </div>

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
              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                passwordError
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