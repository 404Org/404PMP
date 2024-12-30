import React from 'react';
import ProjectForm from './ProjectForm';
import Navbar from '../Navbar';
import AuthErrorModal from '../AuthErrorModal';

const NewProject = () => {
  // // Assuming admin's information is stored in local storage
  const user = JSON.parse(localStorage.getItem('user'));
  const admin  = {
    user_id: user._id, // Replace with actual key
    name: user.name ,// Replace with actual key
    email: user.email // Replace with actual key
  };

  const handleSubmit = async (formData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/projects`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    if (response.status === 401 || !token) {
      <AuthErrorModal />
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create project');
    }

    return response.json();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Project</h1>
            <ProjectForm onSubmit={handleSubmit} isEditing={false} initialData={{ project_manager: admin, team_members: [admin] }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProject; 