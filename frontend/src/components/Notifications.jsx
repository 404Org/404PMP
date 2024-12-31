import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import AuthErrorModal from './AuthErrorModal';

const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401 || !token) {
        <AuthErrorModal />
      }
      const data = await response.json();
      //console.log(data);
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
    setIsActive(!isActive);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

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

  const handleMarkAllAsReadAndDelete = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        <AuthErrorModal />
      }

      // Mark all as read
      await fetch(`${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/notifications/read-all`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Delete all notifications
      await fetch(`${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/notifications/delete-all`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchNotifications(); // Refresh notifications
    } catch (error) {
      console.error('Error marking all as read and deleting notifications:', error);
    }
  };

  const handleDismissNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        <AuthErrorModal />
      }

      // Mark the notification as read
      await fetch(`${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Delete the notification
      await fetch(`${process.env.REACT_APP_HTTP_IP_ADDRESS_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchNotifications(); // Refresh notifications
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-110 ${isOpen ? 'text-blue-500' : 'text-gray-600'}`}
      >
        <div className="relative">
          <Bell size={29} />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border z-20">
          <div className="p-2">
            <div className="flex justify-between items-center px-3 py-2 border-b">
              <h3 className="font-semibold">Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={handleMarkAllAsReadAndDelete}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Mark All as Read
                </button>
              )}
              {/* {unreadCount > 0 && (
                <span className="text-sm text-blue-600">{unreadCount} unread</span>
              )} */}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-gray-500 p-4 text-center">No notifications</p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-3 border-b cursor-pointer hover:bg-blue-50 ${!notification.is_read ? 'bg-gray-50' : ''
                      }`}
                  >
                    <p className="text-sm">{notification.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimestamp(notification.created_at)}
                    </p>
                    <button
                      onClick={() => handleDismissNotification(notification._id)}
                      className="mt-2 text-sm text-red-600 hover:underline"
                    >
                      Dismiss
                    </button>
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