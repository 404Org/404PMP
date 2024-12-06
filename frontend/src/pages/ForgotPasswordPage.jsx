import React, { useState } from 'react';
import { AtSign, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Email validation regex
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset previous messages
    setError('');
    setSuccess('');

    // Validate email
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Simulated password reset logic
    try {
      const response = await fetch(`${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        console.log(data);
        setEmail('');
        // navigate('/resetpassword')
        // Navigate to reset password page with token
      if (data.reset_token) {
          navigate(`/resetpassword/${data.reset_token}`);
        }
      } else {
        setError(data.error || 'Failed to send password reset link. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
        <p className="text-center text-gray-600 mb-6">
          Enter the email address associated with your account
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="relative">
            <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
                setSuccess('');
              }}
              placeholder="Enter your email address"
              required
              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                error 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'focus:ring-blue-500'
              }`}
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          {/* Success Message */}
          {success && (
            <p className="text-green-600 text-sm text-center">
              {success}
            </p>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center"
          >
            <Send className="mr-2" size={20} />
            Send Password Reset Link
          </button>

          {/* Login Redirect */}
          <p className="text-center mt-4 text-sm text-gray-600">
            Remember your password? 
            <a href="/" className="text-blue-500 ml-1 hover:underline">
              Go to Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;