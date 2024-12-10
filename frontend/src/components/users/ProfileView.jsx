import React from 'react';

const ProfileView = ({ userData, onEdit }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
        <button
          onClick={onEdit}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <p className="mt-1 text-sm text-gray-900">{userData.name}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="mt-1 text-sm text-gray-900">{userData.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <p className="mt-1 text-sm text-gray-900 capitalize">{userData.role}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Experience</label>
          <p className="mt-1 text-sm text-gray-900 capitalize">{userData.experience}</p>
        </div>

        {/* Add more fields as needed */}
      </div>
    </div>
  );
};

export default ProfileView; 