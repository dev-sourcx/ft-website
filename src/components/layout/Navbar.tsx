import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, User, LogOut, BookOpen, Home, Users, Calendar, 
  ChevronDown 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import NotificationBell from '../common/NotificationBell';

const Navbar = () => {
  const { user, userRole, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [profileDropdownOpen]);

  // Close dropdown on route change
  useEffect(() => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileDropdownOpen(false);
  };

  const getNavItems = () => {
    if (!isAuthenticated) return [];
    
    if (userRole === 'student') {
      return [
        { path: '/student/dashboard', label: 'Dashboard', icon: Home },
        { path: '/student/teachers', label: 'Find Teachers', icon: Users },
        { path: '/student/bookings', label: 'My Bookings', icon: Calendar },
      ];
    }
    
    if (userRole === 'teacher') {
      return [
        { path: '/teacher/dashboard', label: 'Dashboard', icon: Home },
        { path: '/teacher/bookings', label: 'My Bookings', icon: Calendar },
        { path: '/teacher/slots', label: 'Manage Slots', icon: BookOpen },
      ];
    }
    
    return [];
  };

  const navItems = getNavItems();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass border-b border-white/40 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-[#7B0080] to-[#A020A0] rounded-lg flex items-center justify-center shadow-md shadow-[#7B0080]/20 group-hover:shadow-lg group-hover:shadow-[#7B0080]/30 transition-all duration-300">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-heading text-slate-900">Find Teacher</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-[#7B0080]/10 text-[#7B0080] font-semibold'
                    : 'text-slate-600 hover:text-[#7B0080] hover:bg-[#7B0080]/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <NotificationBell />
                <div className="relative">
                <button
                  ref={triggerRef}
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  data-testid="profile-dropdown-button"
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100/80 transition-all duration-200"
                >
                  <Avatar 
                    src={user?.profilePhoto} 
                    firstName={user?.firstName} 
                    lastName={user?.lastName}
                    size="sm"
                  />
                  <span className="hidden sm:block text-sm font-semibold text-slate-700">
                    {user?.firstName}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {profileDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 py-2 z-50 animate-slideDown"
                  >
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
                    </div>
                    <Link
                      to={`/${userRole}/profile`}
                      data-testid="nav-profile-link"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      data-testid="logout-button"
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth/role-select"
                  data-testid="get-started-btn"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#7B0080] to-[#A020A0] text-white rounded-lg text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#7B0080]/20 transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-[#7B0080] hover:bg-slate-100 rounded-lg transition-all"
              data-testid="mobile-menu-button"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 animate-slideDown">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.path)
                      ? 'bg-[#7B0080]/10 text-[#7B0080]'
                      : 'text-slate-600 hover:text-[#7B0080] hover:bg-[#7B0080]/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
