// src/components/common/Notification/Notification.js
import React, { useState, useEffect } from 'react';
import './Notification.css';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Notification = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'info':
        return <Info size={20} />;
      default:
        return <CheckCircle size={20} />;
    }
  };

  return (
    <div className={`notification notification-${type} ${isVisible ? 'slide-in' : 'slide-out'}`}>
      <div className="notification-icon">
        {getIcon()}
      </div>
      <div className="notification-content">
        <p>{message}</p>
      </div>
      <button className="notification-close" onClick={() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }}>
        <X size={16} />
      </button>
    </div>
  );
};

export const NotificationContainer = ({ notifications, removeNotification }) => {
  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, duration }]);
    
    // Auto remove after duration
    setTimeout(() => {
      removeNotification(id);
    }, duration + 300);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return {
    notifications,
    showNotification,
    removeNotification
  };
};