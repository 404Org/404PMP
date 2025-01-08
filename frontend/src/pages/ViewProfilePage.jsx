import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Briefcase,
    FileText,
    Star,
    Edit,
    Layers,
    FileChartColumnIncreasing
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../hooks/UserContext';
import AuthErrorModal from '../components/AuthErrorModal';

const ViewProfilePage = () => {

    const navigate = useNavigate();
    const [error, setError] = useState('');
    const { userData, setUserData } = useUserContext();
    const userId = localStorage.getItem('_id');
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        fetchProjects(user);
    }, []);

    const fetchProjects = async (user) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/projects`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401 || !token) {
                <AuthErrorModal />
            }

            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }


            const data = await response.json();
            // Filter projects based on whether the user is part of the team members
            const filteredProjects = data.projects.filter(project =>
                project.team_members.some(member => member.user_id === user._id)
            );
            setProjects(filteredProjects);
        } catch (err) {
            setError('Failed to fetch projects');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                } else if (response.status === 401 || !token) {
                    <AuthErrorModal />
                } else {
                    setError('Failed to fetch user data');
                }
            } catch (error) {
                setError('An error occurred while fetching user data');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId, setUserData]);

    const handleEditProfile = () => {
        navigate('/editprofile');
    };
    // const userData = {
    //     name: 'Jane Doe',
    //     email: 'jane.doe@example.com',
    //     role: 'Senior Software Engineer',
    //     bio: 'Passionate software developer with over 8 years of experience in creating scalable web applications. Specialized in React and Node.js with a focus on building user-centric solutions.',
    //     experience: '8 Years',
    //     skills: 'React, Node.js, TypeScript, GraphQL, Docker, Kubernetes',
    //     avatar: null,
    // };

    const avatar = null;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <div className="fixed top-0 left-0 w-full z-50">
                <Navbar />
            </div>

            {/* Main Content */}
            <div className="pt-24 mt-5 flex justify-center items-center pb-8">
                {loading ? (
                    <div className="text-center">
                        <p>Loading...</p>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500">
                        <p>{error}</p>
                    </div>
                ) : userData ? (
                    <div className="bg-white shadow-md rounded-lg w-full max-w-3xl p-8 sm:mx-12">
                        <h2 className="text-3xl font-bold text-center mb-6">Profile Overview</h2>

                        <div className="space-y-8">
                            {/* Avatar Display */}
                            <div className="flex justify-center mb-6">
                                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                                    {avatar ? (
                                        <img
                                            src={avatar}
                                            alt="Profile"
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    ) : (
                                        <User className="text-gray-500" size={48} />
                                    )}
                                </div>
                            </div>

                            {/* Profile Information Sections */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Name Section */}
                                <div className="bg-gray-50 p-4 rounded-md">
                                    <div className="flex items-center mb-2">
                                        <User className="mr-3 text-gray-400" size={20} />
                                        <h3 className="text-lg font-semibold">Full Name</h3>
                                    </div>
                                    <p className="pl-7 text-gray-700">{userData.name}</p>
                                </div>

                                {/* Email Section */}
                                <div className="bg-gray-50 p-4 rounded-md">
                                    <div className="flex items-center mb-2">
                                        <Mail className="mr-3 text-gray-400" size={20} />
                                        <h3 className="text-lg font-semibold">Email Address</h3>
                                    </div>
                                    <p className="pl-7 text-gray-700">{userData.email}</p>
                                </div>

                                {/* Role Section */}
                                <div className="bg-gray-50 p-4 rounded-md">
                                    <div className="flex items-center mb-2">
                                        <Briefcase className="mr-3 text-gray-400" size={20} />
                                        <h3 className="text-lg font-semibold">Professional Role</h3>
                                    </div>
                                    <p className="pl-7 text-gray-700">{userData.designation}</p>
                                </div>

                                {/* Experience Section */}
                                <div className="bg-gray-50 p-4 rounded-md">
                                    <div className="flex items-center mb-2">
                                        <Star className="mr-3 text-gray-400" size={20} />
                                        <h3 className="text-lg font-semibold">Professional Experience</h3>
                                    </div>
                                    <p className="pl-7 text-gray-700">{userData.experience}</p>
                                </div>
                            </div>

                            {/* Skills Section */}
                            <div className="bg-gray-50 p-4 rounded-md">
                                <div className="flex items-center mb-2">
                                    <Layers className="mr-3 text-gray-400" size={20} />
                                    <h3 className="text-lg font-semibold">Professional Skills</h3>
                                </div>
                                <div className="pl-7 flex flex-wrap gap-2">
                                    {userData.skills ? (
                                        typeof userData.skills === 'string' ?
                                            userData.skills.split(',').map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                                >
                                                    {skill.trim()}
                                                </span>
                                            ))
                                            : Array.isArray(userData.skills) ?
                                                userData.skills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                                    >
                                                        {skill.trim()}
                                                    </span>
                                                ))
                                                : <span className="text-gray-500">No skills listed</span>
                                    ) : (
                                        <span className="text-gray-500">No skills listed</span>
                                    )}
                                </div>
                            </div>

                            {/* Bio Section */}
                            <div className="bg-gray-50 p-4 rounded-md">
                                <div className="flex items-center mb-2">
                                    <FileText className="mr-3 text-gray-400" size={20} />
                                    <h3 className="text-lg font-semibold">Professional Bio</h3>
                                </div>
                                <p className="pl-7 text-gray-700">{userData.bio}</p>
                            </div>

                            {/* Projects Section */}
                            <div className="bg-gray-50 p-4 rounded-md">
                                <div className="flex items-center mb-2">
                                    < FileChartColumnIncreasing className="mr-3 text-gray-400" size={20} />
                                    <h3 className="text-lg font-semibold">Projects</h3>
                                </div>
                                <div className="grid gap-4">
                                    {projects.length > 0 ? (
                                        projects.map((project, index) => (
                                            <div
                                                key={index}
                                                className="bg-white ml-8 p-4 rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                                                onClick={() => navigate(`/projects/${project._id}`)}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">{project.title}</h3>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-sm ${project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {project.status.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className=" text-red-500 px-4 py-2 rounded-full mb-2 flex flex-col items-center justify-center">
                                            No Projects Yet
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Edit Profile Button */}
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={handleEditProfile}
                                    className="flex items-center bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                                >
                                    <Edit className="mr-2" size={20} />
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <p>No user data found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewProfilePage;