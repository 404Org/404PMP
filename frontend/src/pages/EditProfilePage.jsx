import React, { useState } from 'react';
import {
    User,
    Mail,
    Briefcase,
    FileText,
    Star,
    Camera,
    Trash2
} from 'lucide-react';
import Navbar from '../components/Navbar';

const UserProfileEdit = () => {
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        role: '',
        bio: '',
        experience: '',
        skills: '',
        avatar: null,
    });

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setProfileData((prevState) => ({
            ...prevState,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Profile Updated:', profileData);
    };

    const handleDeleteAccount = () => {
        const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
        if (confirmDelete) {
            console.log('Account Deleted');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <div className="fixed top-0 left-0 w-full z-50">
                <Navbar />
            </div>

            {/* Main Content */}
            <div className="pt-20 flex justify-center items-center">
                <div className="bg-white shadow-md rounded-lg w-full max-w-2xl p-8">
                    <h2 className="text-3xl font-bold text-center mb-6">Edit Profile</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Avatar Upload */}
                        <div className="flex justify-center mb-6">
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    name="avatar"
                                    accept="image/*"
                                    onChange={handleInputChange}
                                    className="hidden"
                                />
                                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center relative">
                                    {profileData.avatar ? (
                                        <img
                                            src={URL.createObjectURL(profileData.avatar)}
                                            alt="Profile"
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    ) : (
                                        <User className="text-gray-500" size={48} />
                                    )}
                                    <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2">
                                        <Camera size={20} />
                                    </div>
                                </div>
                            </label>
                        </div>

                        {/* Form Inputs */}
                        <div className="relative">
                            <label className="block text-gray-700 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="name"
                                    value={profileData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter your full name"
                                    className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Additional Inputs */}
                        {/* Email */}
                        <div className="relative">
                            <label className="block text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    value={profileData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
                                    className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Role */}
                        <div className="relative">
                            <label className="block text-gray-700 mb-2">Professional Role</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="role"
                                    value={profileData.role}
                                    onChange={handleInputChange}
                                    placeholder="Your job title or role"
                                    className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        {/* Experience Input */}
                        <div className="relative">
                            <label className="block text-gray-700 mb-2">Professional Experience</label>
                            <div className="relative">
                                <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="experience"
                                    value={profileData.experience}
                                    onChange={handleInputChange}
                                    placeholder="Years of professional experience"
                                    className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Skills Input */}
                        <div className="relative">
                            <label className="block text-gray-700 mb-2">Professional Skills</label>
                            <div className="relative">
                                <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="skills"
                                    value={profileData.skills}
                                    onChange={handleInputChange}
                                    placeholder="List your skills (comma-separated)"
                                    className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Bio Input */}
                        <div className="relative">
                            <label className="block text-gray-700 mb-2">Professional Bio</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-4 transform text-gray-400" size={20} />
                                <textarea
                                    name="bio"
                                    value={profileData.bio}
                                    onChange={handleInputChange}
                                    placeholder="Write a short professional bio"
                                    rows={4}
                                    className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        {/* Action Buttons */}
                        <div className="flex justify-between items-center">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteAccount}
                                className="flex items-center text-red-600 hover:text-red-700 transition duration-300"
                            >
                                <Trash2 className="mr-2" size={20} />
                                Delete Account
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfileEdit;
