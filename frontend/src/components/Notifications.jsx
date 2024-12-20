import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';

const NotificationsDropdown = ({ isActive }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json(); 
        console.log(data);
      setNotifications(data.notifications);
      setUnreadCount(data.notifications.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/notifications/${notificationId}/read`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log(data);
        
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // Less than 24 hours
    if (diff < 86400000) {
      if (diff < 3600000) { // Less than 1 hour
        const minutes = Math.floor(diff / 60000);
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
      }
      const hours = Math.floor(diff / 3600000);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      <button 
        onClick={handleToggle}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
          isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
        }`}
      >
        <div className="relative">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
        <span>Notifications</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border z-20">
          <div className="p-2">
            <div className="flex justify-between items-center px-3 py-2 border-b">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-sm text-blue-600">{unreadCount} unread</span>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-gray-500 p-4 text-center">No notifications</p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => markAsRead(notification._id)}
                    className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                      !notification.is_read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <p className="text-sm">{notification.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimestamp(notification.created_at)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown; 