import React, { useState } from 'react';
import { PlusCircle, X, Edit } from 'lucide-react';
 
const KnowledgeBaseManager = () => {
  const [resources, setResources] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentResource, setCurrentResource] = useState({ title: '', url: '', index: null });
 
  const handleAddResource = () => {
    if (currentResource.title && currentResource.url) {
      setResources([...resources, {
        title: currentResource.title,
        url: currentResource.url
      }]);
      setCurrentResource({ title: '', url: '' });
      setIsAddModalOpen(false);
    }
  };
 
  const handleEditResource = () => {
    if (currentResource.title && currentResource.url && currentResource.index !== null) {
      const updatedResources = [...resources];
      updatedResources[currentResource.index] = {
        title: currentResource.title,
        url: currentResource.url
      };
      setResources(updatedResources);
      setCurrentResource({ title: '', url: '', index: null });
      setIsEditModalOpen(false);
    }
  };
 
  const removeResource = (indexToRemove) => {
    setResources(resources.filter((_, index) => index !== indexToRemove));
  };
 
  const openEditModal = (resource, index) => {
    setCurrentResource({ ...resource, index });
    setIsEditModalOpen(true);
  };
 
  return (
    <section className="max-w-3xl mx-auto p-3 bg-white">
      {/* Header */}
      <div className="flex items-center mb-6">
        <h2 className="text-xl semi-bold text-gray-800">
          Knowledge Base
        </h2>
        <button
          onClick={() => {
            setCurrentResource({ title: '', url: '' });
            setIsAddModalOpen(true);
          }}
          className="ml-auto hover:bg-gray-100 rounded-full p-2 transition"
        >
          <PlusCircle className="w-6 h-6 text-gray-500 hover:text-blue-600" />
        </button>
      </div>
 
      {/* Resource List */}
      <div className="space-y-4">
        {resources.map((resource, index) => (
          <div
            key={index}
            className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition group flex items-center justify-between"
          >
            <div className="flex items-center">
              <div>
                <a
                  href={resource.url}
                  className="text-blue-600 hover:underline font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {resource.title}
                </a>
                {/* <p className="text-xs text-gray-500 mt-1">{resource.url}</p> */}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => openEditModal(resource, index)}
                className="text-gray-500 hover:bg-gray-200 rounded-full p-2 transition"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => removeResource(index)}
                className="text-red-500 hover:bg-red-50 rounded-full p-2 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
 
      {/* Add Resource Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Add New Resource</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
 
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Resource Title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={currentResource.title}
                onChange={(e) => setCurrentResource(prev => ({ ...prev, title: e.target.value }))}
              />
              <input
                type="text"
                placeholder="Resource URL"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={currentResource.url}
                onChange={(e) => setCurrentResource(prev => ({ ...prev, url: e.target.value }))}
              />
              <button
                onClick={handleAddResource}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Add Resource
              </button>
            </div>
          </div>
        </div>
      )}
 
      {/* Edit Resource Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Edit Resource</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
 
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Resource Title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={currentResource.title}
                onChange={(e) => setCurrentResource(prev => ({ ...prev, title: e.target.value }))}
              />
              <input
                type="text"
                placeholder="Resource URL"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={currentResource.url}
                onChange={(e) => setCurrentResource(prev => ({ ...prev, url: e.target.value }))}
              />
              <button
                onClick={handleEditResource}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Update Resource
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
 
export default KnowledgeBaseManager;