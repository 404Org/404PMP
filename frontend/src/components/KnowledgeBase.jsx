import React, { useState, useEffect } from 'react';
import { Plus, Link, Upload, X, FileText } from 'lucide-react';
import { useParams } from 'react-router-dom';

const KnowledgeBaseManager = () => {
    const { id: projectId } = useParams();
    const [resources, setResources] = useState([]);
    const [newLink, setNewLink] = useState('');
    const [newLinkName, setNewLinkName] = useState('');
    const [activeTab, setActiveTab] = useState('link');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingResource, setEditingResource] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        if (projectId) {  // Only fetch if projectId exists
            fetchKnowledgeBaseItems();
        }
    }, [projectId]);

    const showAlert = (message, type = 'success') => {
        setAlert({ show: true, message, type });
        setTimeout(() => {
            setAlert({ show: false, message: '', type: '' });
        }, 3000);
    };

    const fetchKnowledgeBaseItems = async () => {
        try {
            const token = localStorage.getItem('token');
            const url = `${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/projects/${projectId}/knowledge-base`;

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch knowledge base items');
            }

            const data = await response.json();

            setResources(data.items.map(item => ({
                ...item,
                icon: item.type === 'link' ? Link : getFileIcon(item.file_type),
                url: item.type === 'file' ? `${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}${item.url}` : item.url
            })));
        } catch (error) {
            console.error('Fetch error:', error);
            showAlert('Failed to load knowledge base items', 'error');
        }
    };

    const getFileIcon = (fileType) => {
        if (fileType.includes('pdf')) return FileText;
        if (fileType.includes('spreadsheet') || fileType.includes('excel')) return FileText;
        if (fileType.includes('powerpoint') || fileType.includes('presentation')) return FileText;
        return FileText;
    };

    const handleAddLink = async () => {
        if (newLink) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(
                    `${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/projects/${projectId}/knowledge-base`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            type: 'link',
                            url: newLink,
                            name: newLinkName || newLink,
                            project_id: projectId
                        }),
                    }
                );

                const responseText = await response.text();

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to add link');
                }

                const data = JSON.parse(responseText); // Parse the response text
                showAlert('Link added successfully');
                fetchKnowledgeBaseItems();
                setNewLink('');
                setNewLinkName('');
                setIsDialogOpen(false);
            } catch (error) {
                showAlert(`Failed to add link: ${error.message}`, 'error');
                console.error(error);
            }
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('file', file);
                
                const token = localStorage.getItem('token');
                const url = `${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/projects/${projectId}/knowledge-base`;

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });

                const responseText = await response.text();

                if (!response.ok) {
                    throw new Error(`Upload failed: ${responseText}`);
                }

                const data = JSON.parse(responseText);
                showAlert('File uploaded successfully');
                await fetchKnowledgeBaseItems(); // Refresh the list
                setIsDialogOpen(false);
            } catch (error) {
                console.error('Upload error:', error);
                showAlert('Failed to upload file', 'error');
            }
        }
    };

    const handleEdit = (index) => {
        setEditingResource({ ...resources[index] });
        setEditingIndex(index);
        setIsEditDialogOpen(true);
    };

    const handleUpdateResource = async () => {
        if (editingResource) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(
                    `${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/knowledge-base/${editingResource._id}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            name: editingResource.name,
                            url: editingResource.url,
                        }),
                    }
                );

                if (!response.ok) throw new Error('Failed to update resource');

                showAlert('Resource updated successfully');
                fetchKnowledgeBaseItems();
                setIsEditDialogOpen(false);
                setEditingResource(null);
            } catch (error) {
                showAlert('Failed to update resource', 'error');
                console.error(error);
            }
        }
    };

    const removeResource = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/knowledge-base/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) throw new Error('Failed to delete resource');

            showAlert('Resource deleted successfully');
            fetchKnowledgeBaseItems();
        } catch (error) {
            showAlert('Failed to delete resource', 'error');
            console.error(error);
        }
    };

    const getFileUrl = (resource) => {
        if (resource.type === 'link') {
            return resource.url;
        } else {
            return `${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/uploads/knowledge_base/${resource.url.split('/').pop()}`;
        }
    };

    return (
        <div className="w-full max-w-md bg-white rounded-lg shadow-md border border-gray-200">
            {alert.show && (
                <div className={`p-4 rounded-md mb-4 ${
                    alert.type === 'error' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-green-100 text-green-700'
                }`}>
                    {alert.message}
                </div>
            )}

            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Project Knowledge Base</h2>
                <button
                    onClick={() => setIsDialogOpen(true)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <Plus className="w-6 h-6 text-gray-600" />
                </button>
            </div>

            {isDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-96 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Add Resource to Knowledge Base</h3>
                            <button
                                onClick={() => setIsDialogOpen(false)}
                                className="p-1 rounded-full hover:bg-gray-100"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="flex mb-4 border rounded-md">
                            <button
                                className={`flex-1 p-2 text-center flex items-center justify-center ${activeTab === 'link' ? 'bg-gray-100' : ''}`}
                                onClick={() => setActiveTab('link')}
                            >
                                <Link className="mr-2 w-5 h-5" />
                                Add Link
                            </button>
                            <button
                                className={`flex-1 p-2 text-center flex items-center justify-center ${activeTab === 'upload' ? 'bg-gray-100' : ''}`}
                                onClick={() => setActiveTab('upload')}
                            >
                                <Upload className="mr-2 w-5 h-5" />
                                Upload File
                            </button>
                        </div>

                        {activeTab === 'link' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter resource name"
                                        value={newLinkName}
                                        onChange={(e) => setNewLinkName(e.target.value)}
                                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        URL
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Paste URL here"
                                        value={newLink}
                                        onChange={(e) => setNewLink(e.target.value)}
                                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <button
                                        onClick={handleAddLink}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'upload' && (
                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-12 h-12 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        PDF, PPT, DOCX, XLSX (MAX. 10MB)
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx"
                                    onChange={handleFileUpload}
                                />
                            </label>
                        )}
                    </div>
                </div>
            )}

            {isEditDialogOpen && editingResource && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-96 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Edit Resource</h3>
                            <button
                                onClick={() => {
                                    setIsEditDialogOpen(false);
                                    setEditingResource(null);
                                }}
                                className="p-1 rounded-full hover:bg-gray-100"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={editingResource.name}
                                    onChange={(e) => setEditingResource({ ...editingResource, name: e.target.value })}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    URL
                                </label>
                                <input
                                    type="text"
                                    value={editingResource.url}
                                    onChange={(e) => setEditingResource({ ...editingResource, url: e.target.value })}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                onClick={handleUpdateResource}
                                className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-4">
                {resources.length === 0 ? (
                    <p className="text-gray-500 text-center">No resources added yet</p>
                ) : (
                    <ul className="space-y-2">
                        {resources.map((resource, index) => {
                            const ResourceIcon = resource.icon;
                            const resourceUrl = getFileUrl(resource);
                            
                            return (
                                <li
                                    key={resource._id || index}
                                    className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50"
                                >
                                    <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 flex items-center justify-center">
                                            <ResourceIcon className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div className="flex flex-col">
                                            <a
                                                href={resourceUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-medium text-blue-500 hover:underline"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                            >
                                                {resource.name || resource.url}
                                            </a>
                                            {resource.created_by && (
                                                <span className="text-xs text-gray-500">
                                                    Added by {resource.created_by.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeResource(resource._id);
                                            }}
                                            className="p-1 rounded-full hover:bg-gray-100"
                                        >
                                            <X className="w-5 h-5 text-gray-600" />
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default KnowledgeBaseManager;