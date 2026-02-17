import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCheck, Inbox, AlertTriangle, Info, ExternalLink } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

interface Notification {
  _id: string;
  message: string;
  type: 'LOW_STOCK' | 'INFO' | 'WARNING' | 'SUCCESS';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications?limit=10');
      setNotifications(res.data.data);
      setUnreadCount(res.data.unreadCount);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id: string, link?: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      if (link) {
        setIsOpen(false);
        navigate(link);
      }
    } catch (err) {
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'LOW_STOCK':
      case 'WARNING':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'SUCCESS':
        return 'bg-green-50 text-green-600 border-green-100';
      default:
        return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  const getIcon = (type: string) => {
    if (type === 'LOW_STOCK' || type === 'WARNING') return <AlertTriangle size={16} />;
    return <Info size={16} />;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-colors ${
          isOpen ? 'bg-gray-100 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
        }`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden transform origin-top-right transition-all">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <CheckCheck size={14} />
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-3">
                  <Inbox size={24} />
                </div>
                <p className="text-sm text-gray-500">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    onClick={() => markAsRead(n._id, n.link)}
                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer relative group ${
                      !n.isRead ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${getTypeStyles(n.type)}`}>
                        {getIcon(n.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className={`text-xs leading-relaxed ${!n.isRead ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                          {n.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-gray-400 font-medium">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {n.link && (
                            <ExternalLink size={10} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
                          )}
                        </div>
                      </div>
                      {!n.isRead && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(n._id);
                            }}
                            className="p-1 rounded-full bg-white shadow-sm border border-gray-100 text-gray-400 hover:text-blue-600"
                            title="Mark as read"
                          >
                            <Check size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/history'); // Or a dedicated notifications page if created
              }}
              className="text-xs font-medium text-gray-500 hover:text-gray-700"
            >
              View all activity
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
