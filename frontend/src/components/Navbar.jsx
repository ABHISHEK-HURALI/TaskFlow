import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, Menu, X, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-indigo-600 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2">
              <CheckSquare className="h-8 w-8" />
              <span className="font-bold text-xl tracking-tight">TaskFlow</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 text-indigo-100 bg-indigo-700/50 px-3 py-1.5 rounded-full">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user?.username}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 hover:bg-indigo-700 px-4 py-2 rounded-md transition-colors text-sm font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:bg-indigo-700 px-4 py-2 rounded-md transition-colors text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-md transition-colors text-sm font-medium shadow-sm"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
          
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:bg-indigo-700 p-2 rounded-md transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-indigo-700 px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 px-3 py-2 text-indigo-100">
                <User className="h-5 w-5" />
                <span className="font-medium">{user?.username}</span>
              </div>
              <button
                onClick={() => { logout(); setIsMenuOpen(false); }}
                className="w-full flex items-center gap-2 hover:bg-indigo-600 px-3 py-2 rounded-md transition-colors text-base font-medium text-left"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block hover:bg-indigo-600 px-3 py-2 rounded-md transition-colors text-base font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="block bg-white text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-md transition-colors text-base font-medium mt-2"
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
