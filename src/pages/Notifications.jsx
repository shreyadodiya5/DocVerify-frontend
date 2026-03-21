import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Bell, CheckCircle, Clock, CheckCheck } from 'lucide-react';

const mockNotifications = [
  { id: 1, type: 'submitted', message: 'John Doe has submitted documents for review.', date: 'Just now', read: false },
  { id: 2, type: 'approved', message: 'All documents for Jane Smith have been approved.', date: '2 hours ago', read: false },
  { id: 3, type: 'system', message: 'Welcome to DocVerify! Securely request your first document.', date: '1 day ago', read: true },
];

const Notifications = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <div className="md:hidden">
        <Navbar />
      </div>
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <main className="flex-1 lg:ml-64 p-4 md:p-8 pt-8 lg:pt-8 min-w-0">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
              <p className="text-sm text-slate-500 mt-1">You have {unreadCount} unread messages</p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-sm text-primary hover:text-blue-800 font-medium flex items-center gap-1.5"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all as read
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            <div className="flex border-b border-slate-200">
              {['all', 'unread', 'read'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${filter === f
                      ? 'border-primary text-primary bg-slate-50'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 flex gap-4 hover:bg-slate-50 transition-colors ${!notification.read ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className="shrink-0 mt-1">
                      {notification.type === 'approved' && <CheckCircle className="w-5 h-5 text-success" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${!notification.read ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
                        {notification.message}
                      </p>
                      <span className="text-xs text-slate-400 mt-1 block">{notification.date}</span>
                    </div>
                    {!notification.read && (
                      <div className="shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary block"></span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500">
                  <Bell className="w-8 h-8 mx-auto text-slate-300 mb-3" />
                  <p>No notifications found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notifications;
