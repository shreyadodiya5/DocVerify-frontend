import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FileCheck, LogOut, LayoutDashboard, Menu } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <FileCheck className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl text-slate-800 tracking-tight">DocVerify</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-slate-600 hover:text-primary transition-colors">Home</Link>
            <Link to="/about" className="text-slate-600 hover:text-primary transition-colors">About</Link>
            <Link to="/faq" className="text-slate-600 hover:text-primary transition-colors">FAQ</Link>
            <Link to="/contact" className="text-slate-600 hover:text-primary transition-colors">Contact</Link>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-200">
                <span className="text-sm font-medium text-slate-700">Hello, {user?.name?.split(' ')[0]}</span>
                <Link to="/dashboard" className="btn btn-primary text-sm py-1.5 px-3">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="text-slate-500 hover:text-error transition-colors" title="Logout">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <Link to="/login" className="text-primary font-medium hover:text-blue-800">Login</Link>
                <Link to="/signup" className="btn btn-primary text-sm">Get Started Free</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-500 hover:text-slate-700">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white shadow-lg absolute w-full z-50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-primary hover:bg-slate-50 rounded-md">Home</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-primary hover:bg-slate-50 rounded-md">About</Link>
            <Link to="/faq" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-primary hover:bg-slate-50 rounded-md">FAQ</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-primary hover:bg-slate-50 rounded-md">Dashboard</Link>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-base font-medium text-error hover:bg-red-50 rounded-md">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-primary hover:bg-slate-50 rounded-md">Login</Link>
                <Link to="/signup" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-primary hover:bg-blue-50 rounded-md">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
