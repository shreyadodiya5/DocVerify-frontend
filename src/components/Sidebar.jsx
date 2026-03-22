import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, FilePlus, Bell, Settings, LogOut, FileCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { isManagerUser } from '../utils/roles';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    ...(isManagerUser(user)
      ? [{ name: 'New Request', path: '/requests/new', icon: FilePlus }]
      : []),
    { name: 'Notifications', path: '/notifications', icon: Bell },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-800/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar sidebar */}
      <aside className={`fixed top-0 left-0 z-30 h-screen w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 border-b border-slate-200 flex items-center h-16 shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <FileCheck className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg text-slate-800 tracking-tight">DocVerify</span>
          </Link>
        </div>
        
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-sm text-slate-800 truncate">{user?.name}</span>
              <span className="text-xs text-slate-500 truncate">{user?.email}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-primary/80 mt-0.5">
                {isManagerUser(user) ? 'Manager' : user?.role === 'client' ? 'Client' : 'Account'}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-primary' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-red-50 hover:text-error transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
