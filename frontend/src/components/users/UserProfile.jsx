import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import ProfileView from './ProfileView';
import ProfileEdit from './ProfileEdit';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/users/${currentUser._id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          // console.log(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar title="User Profile" />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar title="User Profile" />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {isEditing ? (
              <ProfileEdit 
                userData={userData} 
                setUserData={setUserData}
                onCancel={() => setIsEditing(false)}
                onSuccess={() => setIsEditing(false)}
              />
            ) : (
              <ProfileView 
                userData={userData}
                onEdit={() => setIsEditing(true)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 