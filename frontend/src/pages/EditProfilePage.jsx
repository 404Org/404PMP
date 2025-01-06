import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Briefcase,
    FileText,
    Star,
    Camera,
    Loader2,
    Layers
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
//import { useLocation } from 'react-router-dom';
import { useUserContext } from '../hooks/UserContext';
import AuthErrorModal from '../components/AuthErrorModal';

const UserProfileEdit = () => {

    const navigate = useNavigate();
    //const location = useLocation();
    //const { userData, updateUserData} = location.state || {};
    // eslint-disable-next-line
    const { userData, setUserData } = useUserContext();
    // eslint-disable-next-line
    const [error, setError] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        designation: '',
        bio: '',
        experience: '',
        skills: [],
        avatar: null,
    });
    const [skillInput, setSkillInput] = useState('');

    // Predefined skills list
    const suggestedSkills = {
        "Programming Languages": [
            "JavaScript",
            "Python",
            "Java",
            "C++",
            "C#",
            "Ruby",
            "PHP",
            "Swift",
            "TypeScript",
            "Go",
            "Kotlin",
            "R",
            "MATLAB",
            "Scala",
            "Rust"
        ],
        "Web Technologies": [
            "HTML5",
            "CSS3",
            "ReactJs",
            "Angular",
            "VueJs",
            "NodeJs",
            "ExpressJs",
            "Django",
            "Spring Framework",
            "ASP.NET",
            "Ruby on Rails",
            "Laravel",
            "jQuery",
            "Bootstrap",
            "Tailwind CSS",
            "webpack",
            "REST APIs",
            "GraphQL"
        ],
        "Databases": [
            "SQL",
            "MySQL",
            "PostgreSQL",
            "MongoDB",
            "Oracle Database",
            "Microsoft SQL Server",
            "Redis",
            "Elasticsearch",
            "Cassandra",
            "Firebase"
        ],
        "Cloud Platforms": [
            "Amazon Web Services (AWS)",
            "Microsoft Azure",
            "Google Cloud Platform",
            "Heroku",
            "DigitalOcean",
            "Cloudflare"
        ],
        "DevOps & Tools": [
            "Git",
            "Docker",
            "Kubernetes",
            "Jenkins",
            "Linux",
            "JIRA",
            "Confluence",
            "Maven",
            "Gradle",
            "npm",
            "Terraform",
            "Ansible"
        ],
        "Testing": [
            "Unit Testing",
            "Jest",
            "Selenium",
            "JUnit",
            "TestNG",
            "Cypress",
            "Mocha",
            "PHPUnit"
        ],
        "AI/ML & Data": [
            "Machine Learning",
            "TensorFlow",
            "PyTorch",
            "scikit-learn",
            "Pandas",
            "NumPy",
            "Apache Spark",
            "Power BI",
            "Tableau",
            "SAS"
        ],
        "Mobile Development": [
            "iOS Development",
            "Android Development",
            "React Native",
            "Flutter",
            "Xamarin",
            "SwiftUI",
            "Kotlin Android"
        ],
        "Project Management": [
            "Agile Methodologies",
            "Scrum",
            "Kanban",
            "Waterfall",
            "Project Planning",
            "Team Leadership"
        ],
        "Design Tools": [
            "Figma",
            "Adobe XD",
            "Sketch",
            "Adobe Photoshop",
            "Adobe Illustrator",
            "InVision"
        ]
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('_id');
                const response = await fetch(`${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/users/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfileData({
                        name: data.name || '',
                        email: data.email || '',
                        designation: data.designation || '',
                        bio: data.bio || '',
                        experience: data.experience || '',
                        skills: typeof data.skills === 'string' ? data.skills.split(',').filter(Boolean) : (data.skills || []),
                        avatar: null,
                    });
                    setUserData(data);
                } else if (response.status === 401 || !token) {
                    <AuthErrorModal />
                } else {
                    const data = await response.json();
                    setError(data.error || 'Failed to fetch profile data');
                }
            } catch (error) {
                setError('An error occurred while fetching profile data');
            }
        };

        fetchUserData();
    }, [setUserData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const dataToSend = {
                ...profileData,
                skills: profileData.skills.join(',')
            };

            const response = await fetch(`${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataToSend)
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUserData(updatedUser);
                setIsSaved(true);
                setTimeout(() => {
                    setIsSaved(false);
                }, 3000);
            } else if (response.status === 401 || !token) {
                <AuthErrorModal />
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to update profile');
            }
        } catch (error) {
            setError('An error occurred while updating profile');
        } finally {
            setIsLoading(false);
        }
    };


    // const handleDeleteAccount = () => {
    //     const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    //     if (confirmDelete) {
    //         console.log('Account Deleted');
    //     }
    // };

    const handleCancelButton = () => {
        setIsSaved(false);
        navigate('/viewprofile')
    };

    const handleAddSkill = (skill) => {
        if (skill && !profileData.skills.includes(skill)) {
            setProfileData(prev => ({
                ...prev,
                skills: [...prev.skills, skill]
            }));
        }
        setSkillInput('');
    };

    const handleRemoveSkill = (skillToRemove) => {
        setProfileData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            handleAddSkill(skillInput.trim());
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <div className="fixed top-0 left-0 w-full z-50">
                <Navbar />
            </div>

            {/* Main Content */}
            <div className="pt-24 mt-5 flex justify-center items-center pb-8">
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
                                    //onChange={handleInputChange}
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
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    placeholder="Enter your full name"
                                    className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <label className="block text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    disabled
                                    className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Designation */}
                        <div className="relative">
                            <label className="block text-gray-700 mb-2">Professional Designation</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="designation"
                                    value={profileData.designation}
                                    onChange={(e) => setProfileData({ ...profileData, designation: e.target.value })}
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
                                    onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                                    placeholder="Years of professional experience"
                                    className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Skills Input */}
                        <div className="relative">
                            <label className="block text-gray-700 mb-2">Professional Skills</label>
                            <div className="relative">
                                <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <div className="w-full pl-10 pr-3 py-2 border rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 flex flex-wrap items-center gap-2">
                                    {profileData.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-sm flex items-center gap-1"
                                        >
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSkill(skill)}
                                                className="hover:text-blue-900"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={profileData.skills.length === 0 ? "Add skills..." : ""}
                                        className="flex-1 outline-none min-w-[150px]"
                                    />
                                </div>

                                {/* Dropdown for suggestions */}
                                {skillInput && (
                                    <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border max-h-40 overflow-y-auto">
                                        {Object.entries(suggestedSkills).map(([category, skills]) => (
                                            <div key={category}>
                                                {skills.filter(skill =>
                                                    skill.toLowerCase().includes(skillInput.toLowerCase()) &&
                                                    !profileData.skills.includes(skill)
                                                ).map((skill) => (
                                                    <div
                                                        key={skill}
                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                        onClick={() => handleAddSkill(skill)}
                                                    >
                                                        {skill}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                        {skillInput && !Object.values(suggestedSkills).flat().includes(skillInput) && (
                                            <div className="px-4 py-2 text-gray-500 text-sm">
                                                Press Enter to add "{skillInput}" as a new skill
                                            </div>
                                        )}
                                    </div>
                                )}
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
                                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
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

                                className={`
                                    flex items-center justify-center 
                                    w-[150px] 
                                    ${isLoading ? 'bg-blue-400' : 'bg-blue-500'} 
                                    ${isSaved ? 'bg-green-500' : ''} 
                                    text-white 
                                    px-6 py-2 
                                    rounded-md 
                                    hover:bg-blue-600 
                                    transition duration-300
                                    disabled:cursor-not-allowed
                                `}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 animate-spin" size={20} />
                                        Saving...
                                    </>
                                ) : isSaved ? 'Saved' : 'Save Changes'}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelButton}
                                disabled={isLoading}
                                className=" bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfileEdit;
