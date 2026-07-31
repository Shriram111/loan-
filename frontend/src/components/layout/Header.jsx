import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Menu, Bell, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '../../utils/helpers';

export default function Header({ onMenuToggle }) {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-xl hover:bg-gray-100">
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden md:block">
          <p className="text-xs text-gray-500">Welcome back,</p>
          <p className="text-sm font-semibold text-gray-800">{user?.fullName}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-gradient text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-xs text-primary-pink hover:underline">Mark all read</button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500 text-center">No notifications</p>
                  ) : (
                    notifications.slice(0, 10).map((notif) => (
                      <div key={notif._id} className={`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${!notif.isRead ? 'bg-primary-light/30' : ''}`} onClick={() => markAsRead(notif._id)}>
                        <div className="flex items-start gap-2">
                          {!notif.isRead && <div className="w-2 h-2 rounded-full bg-primary-pink mt-1.5 flex-shrink-0" />}
                          <div>
                            <p className="text-sm font-medium text-gray-800">{notif.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                            <p className="text-[10px] text-gray-400 mt-1">{formatDate(notif.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary-gradient flex items-center justify-center text-white text-sm font-semibold">
              {user?.fullName?.charAt(0)}
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500 hidden md:block" />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <p className="font-semibold text-gray-800">{user?.fullName}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-primary-light text-primary-dark capitalize font-medium">{user?.role?.replace('_', ' ')}</span>
                </div>
                <div className="p-2">
                  <a href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Profile</a>
                  <a href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Settings</a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
