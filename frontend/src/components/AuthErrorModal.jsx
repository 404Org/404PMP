import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthErrorModal = ({ isOpen = true }) => {
  const navigate = useNavigate();

  const handleReturnToLogin = () => {
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl w-full max-w-md">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Session Expired
                </h3>
              </div>
              <button
                onClick={handleReturnToLogin}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Your session has expired or is invalid. Please sign in again to continue.
            </p>
          </div>

          {/* Content */}
          <div className="py-3">
            <p className="text-sm text-gray-600">
              For your security, you've been logged out due to inactivity. 
              Any unsaved changes may be lost.
            </p>
          </div>

          {/* Footer */}
          <div className="mt-5 flex justify-center">
            <button
              onClick={handleReturnToLogin}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium text-sm transition-colors"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthErrorModal;