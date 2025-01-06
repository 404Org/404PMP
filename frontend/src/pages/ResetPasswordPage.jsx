import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({
    match: false
  });
  const [submitError, setSubmitError] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/forgotpassword');
    }
  }, [token, navigate]);

  useEffect(() => {
    const doPasswordsMatch = password === confirmPassword;
    setPasswordErrors({ match: !doPasswordsMatch && confirmPassword !== '' });
    setIsPasswordValid(doPasswordsMatch && confirmPassword !== '');
  }, [password, confirmPassword]);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setSubmitError('');
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setSubmitError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/auth/reset-password/${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ new_password: password, confirm_password: confirmPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Password successfully reset');
        navigate('/');
      } else {
        setSubmitError(data.error || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      setSubmitError('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Create New Password</h2>
        <p className="text-center text-gray-600 mb-6">
          Your new password must be different from previous used passwords
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Create New Password"
              required
              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                passwordErrors.match
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'focus:ring-blue-500'
              }`}
            />
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm New Password"
              required
              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                passwordErrors.match
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'focus:ring-blue-500'
              }`}
            />
          </div>

          {/* Password Match Error */}
          {passwordErrors.match && (
            <p className="text-red-500 text-sm text-center">
              Passwords do not match
            </p>
          )}

          {/* Submit Error */}
          {submitError && (
            <p className="text-red-500 text-sm text-center">
              {submitError}
            </p>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={!isPasswordValid}
            className={`w-full text-white py-2 rounded-md transition duration-300 ${
              isPasswordValid 
                ? 'bg-blue-500 hover:bg-blue-600' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Reset Password
          </button>

          {/* Login Redirect */}
          <p className="text-center mt-4 text-sm text-gray-600">
            Remember your password? 
            <a href="/login" className="text-blue-500 ml-1 hover:underline">
              Go to Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;