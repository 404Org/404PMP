import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectForm from './ProjectForm';
import Navbar from '../Navbar';

const EditProject = () => {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/projects/${id}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }

      const data = await response.json();
      setProject(data.project);
    } catch (err) {
      setError('Failed to fetch project');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/projects/${id}`, {
      method: 'PUT',
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update project');
    }

    return response.json();
  };

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-600">{error}</div>;
  if (!project) return <div className="text-center mt-8">Project not found</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar title="Edit Project" />
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Project</h1>
            <ProjectForm 
              initialData={project} 
              onSubmit={handleSubmit} 
              isEditing={true} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProject; 