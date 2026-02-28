import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, MessageCircle, User, Home, Users, Briefcase, Calendar, LogOut, Settings as SettingsIcon, HelpCircle, Mail, Moon, Sun } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import { useDarkMode } from '../../context/DarkModeContext';
import alumniConnectLogo from '../../assets/logos/alumni_connect_logo-removebg-preview.png';
import NotificationTicker from '../ticker/NotificationTicker';

interface NavbarProps {
  isAuthenticated?: boolean;
  userRole?: 'student' | 'alumni' | 'admin';
  userName?: string;
  userAvatar?: string;
  unreadNotifications?: number;
  unreadMessages?: number;
}

const Navbar: React.FC<NavbarProps> = ({
  isAuthenticated = false,
  userRole,
  userName,
  userAvatar,
  unreadNotifications = 0,
  unreadMessages = 0,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const isAdmin = user?.role === 'admin';

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleSearch = () => setIsSearchExpanded(!isSearchExpanded);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/login');
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#0B1A30] shadow-md border-b border-white/10 transition-all duration-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left Section: Logo & Nav Links */}
            <div className="flex items-center space-x-8">
              {/* Mobile Menu Button */}
              <div className="lg:hidden relative">
                <button
                  className="p-2 text-white hover:bg-white/20 rounded-lg focus:outline-none transition-all duration-300 transform hover:scale-105"
                  onClick={toggleMobileMenu}
                  aria-label="Toggle menu"
                >
                  <Menu size={24} />
                </button>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[9998]"
                      onClick={toggleMobileMenu}
                    ></div>
                    <div className="absolute left-0 top-full mt-2 w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 z-[9999] overflow-hidden animate-fadeIn max-h-[80vh] overflow-y-auto">
                      <div className="py-2">
                        {isAuthenticated ? (
                          <>
                            <MobileNavLink to="/dashboard" icon={<Home size={20} />} onClick={toggleMobileMenu}>
                              Home
                            </MobileNavLink>
                            <MobileNavLink to="/alumni" icon={<Users size={20} />} onClick={toggleMobileMenu}>
                              Alumni Directory
                            </MobileNavLink>
                            <MobileNavLink to="/opportunities" icon={<Briefcase size={20} />} onClick={toggleMobileMenu}>
                              Opportunities
                            </MobileNavLink>
                            <MobileNavLink to="/events" icon={<Calendar size={20} />} onClick={toggleMobileMenu}>
                              Events
                            </MobileNavLink>
                            <MobileNavLink to="/messages" icon={<MessageCircle size={20} />} onClick={toggleMobileMenu}>
                              Messages
                              {unreadMessages > 0 && (
                                <span className="ml-auto w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                  {unreadMessages > 9 ? '9+' : unreadMessages}
                                </span>
                              )}
                            </MobileNavLink>
                            <MobileNavLink to="/notifications" icon={<Bell size={20} />} onClick={toggleMobileMenu}>
                              Notifications
                              {unreadNotifications > 0 && (
                                <span className="ml-auto w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                                </span>
                              )}
                            </MobileNavLink>

                            {isAdmin && (
                              <MobileNavLink to="/admin/email-campaigns" icon={<Mail size={20} />} onClick={toggleMobileMenu}>
                                Email Campaigns
                              </MobileNavLink>
                            )}

                            <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2">
                              <MobileNavLink to="/profile" icon={<User size={20} />} onClick={toggleMobileMenu}>
                                My Profile
                              </MobileNavLink>
                              <MobileNavLink to="/settings" icon={<SettingsIcon size={20} />} onClick={toggleMobileMenu}>
                                Settings
                              </MobileNavLink>
                              <MobileNavLink to="/help" icon={<HelpCircle size={20} />} onClick={toggleMobileMenu}>
                                Help & Support
                              </MobileNavLink>
                              <button
                                onClick={() => {
                                  toggleMobileMenu();
                                  handleLogout();
                                }}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-300"
                              >
                                <LogOut size={20} />
                                <span>Logout</span>
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <a
                              href="#features"
                              onClick={toggleMobileMenu}
                              className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0B1A30] dark:hover:text-blue-300 transition-all duration-300"
                            >
                              <Briefcase size={20} />
                              <span>Features</span>
                            </a>
                            <a
                              href="#about"
                              onClick={toggleMobileMenu}
                              className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0B1A30] dark:hover:text-blue-300 transition-all duration-300"
                            >
                              <Users size={20} />
                              <span>About</span>
                            </a>
                            <a
                              href="#testimonials"
                              onClick={toggleMobileMenu}
                              className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-200 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0B1A30] dark:hover:text-blue-300 transition-all duration-300"
                            >
                              <MessageCircle size={20} />
                              <span>Success Stories</span>
                            </a>
                            <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2">
                              <button
                                onClick={() => {
                                  toggleMobileMenu();
                                  navigate('/login');
                                }}
                                className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-[#0B1A30] dark:text-blue-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
                              >
                                <User size={20} />
                                <span>Login</span>
                              </button>
                              <button
                                onClick={() => {
                                  toggleMobileMenu();
                                  navigate('/signup');
                                }}
                                className="w-full flex items-center justify-center space-x-2 px-4 py-3 mt-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-300 shadow-md mx-4"
                              >
                                <span>Get Started</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Logo */}
              <Link
                to={isAuthenticated ? '/dashboard' : '/'}
                className="flex items-center space-x-3 group transition-transform duration-300 hover:scale-105 ml-2"
              >
                <img
                  src={alumniConnectLogo}
                  alt="Alumni Connect Logo"
                  className="h-10 md:h-12 lg:h-14 w-auto object-contain"
                />
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-white drop-shadow-md">Alumni Connect</h1>
                  <p className="text-xs text-blue-100 font-medium opacity-90">by ACE BIT Sindri</p>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              {isAuthenticated && (
                <div className="hidden lg:flex items-center space-x-2">
                  <NavLink to="/dashboard" icon={<Home size={18} />}>
                    Home
                  </NavLink>
                  <NavLink to="/alumni" icon={<Users size={18} />}>
                    Alumni
                  </NavLink>
                  <NavLink to="/opportunities" icon={<Briefcase size={18} />}>
                    Opportunities
                  </NavLink>
                  <NavLink to="/events" icon={<Calendar size={18} />}>
                    Events
                  </NavLink>
                </div>
              )}
            </div>

            {/* Center Section: Search Bar (Desktop) */}
            {isAuthenticated && (
              <div className="hidden md:flex flex-1 max-w-md mx-4">
                <div className="relative w-full group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 group-focus-within:text-blue-900 transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Search alumni, posts, jobs..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white/95 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-300 placeholder-slate-400 text-slate-800"
                  />
                </div>
              </div>
            )}

            {/* Right Section: Actions & Profile */}
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  {/* Search Icon (Mobile) */}
                  <button
                    className="md:hidden p-2 text-white hover:bg-white/20 rounded-lg focus:outline-none transition-all duration-300 transform hover:scale-110"
                    onClick={toggleSearch}
                    aria-label="Search"
                  >
                    <Search size={20} />
                  </button>

                  {/* Dark Mode Toggle */}
                  <button
                    className="p-2 text-white hover:bg-white/20 rounded-lg focus:outline-none transition-all duration-300 transform hover:scale-110"
                    onClick={toggleDarkMode}
                    aria-label="Toggle dark mode"
                    title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                  </button>

                  {/* Notifications */}
                  <button
                    className="relative p-2 text-white hover:bg-white/20 rounded-lg focus:outline-none transition-all duration-300 transform hover:scale-110"
                    aria-label="Notifications"
                    onClick={() => navigate('/notifications')}
                  >
                    <Bell size={20} />
                    {unreadNotifications > 0 && (
                      <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse shadow-lg">
                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                      </span>
                    )}
                  </button>

                  {/* Messages */}
                  <button
                    className="relative p-2 text-white hover:bg-white/20 rounded-lg focus:outline-none hidden sm:block transition-all duration-300 transform hover:scale-110"
                    aria-label="Messages"
                    onClick={() => navigate('/messages')}
                  >
                    <MessageCircle size={20} />
                    {unreadMessages > 0 && (
                      <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse shadow-lg">
                        {unreadMessages > 9 ? '9+' : unreadMessages}
                      </span>
                    )}
                  </button>

                  {/* Email Campaigns (Admin Only) */}
                  {isAdmin && (
                    <button
                      className="relative p-2 text-white hover:bg-white/20 rounded-lg focus:outline-none transition-all duration-300 transform hover:scale-110"
                      aria-label="Email Campaigns"
                      onClick={() => navigate('/admin/email-campaigns')}
                      title="Email Campaigns"
                    >
                      <Mail size={20} />
                    </button>
                  )}

                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button
                      className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-white/20 focus:outline-none transition-all duration-300 transform hover:scale-105"
                      onClick={toggleProfileDropdown}
                      aria-label="Profile menu"
                    >
                      {userAvatar ? (
                        <img
                          src={userAvatar}
                          alt={userName}
                          className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-md"
                        />
                      ) : (
                        <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md">
                          <User size={18} className="text-slate-600" />
                        </div>
                      )}
                      <span className="hidden md:block text-sm font-semibold text-white drop-shadow-sm">{userName}</span>
                    </button>

                    {/* Profile Dropdown Menu */}
                    {isProfileDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={toggleProfileDropdown}
                        ></div>
                        <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-20 overflow-hidden animate-fadeIn">
                          <div className="p-4 bg-slate-50 border-b border-gray-100">
                            <p className="font-bold text-gray-900">{userName}</p>
                            <p className="text-sm text-gray-600 capitalize">{userRole}</p>
                          </div>
                          <div className="py-2">
                            <DropdownItem icon={<User size={16} />} onClick={() => navigate('/profile')}>
                              View Profile
                            </DropdownItem>
                            <DropdownItem icon={<SettingsIcon size={16} />} onClick={() => navigate('/settings')}>
                              Settings
                            </DropdownItem>
                            <DropdownItem icon={<HelpCircle size={16} />} onClick={() => navigate('/help')}>
                              Help & Support
                            </DropdownItem>
                          </div>
                          <div className="border-t border-gray-100 py-2">
                            <DropdownItem icon={<LogOut size={16} />} onClick={handleLogout} className="text-red-600 hover:bg-red-50">
                              Logout
                            </DropdownItem>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                // Not Authenticated: Login Buttons
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="px-5 py-2 text-sm font-semibold text-[#0B1A30] bg-white rounded-lg hover:bg-gray-50 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search (Expanded) */}
          {isAuthenticated && isSearchExpanded && (
            <div className="md:hidden py-3 animate-slideDown">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type="text"
                  placeholder="Search alumni, posts, jobs..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/95 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-slate-400 text-slate-800"
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Notification Ticker - Below Navbar */}
      {isAuthenticated && <NotificationTicker />}
    </>
  );
};

// NavLink Component for Desktop
const NavLink: React.FC<{ to: string; icon: React.ReactNode; children: React.ReactNode }> = ({
  to,
  icon,
  children,
}) => (
  <Link
    to={to}
    className="flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold text-white/90 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-md"
  >
    {icon}
    <span>{children}</span>
  </Link>
);

// MobileNavLink Component
const MobileNavLink: React.FC<{
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
}> = ({ to, icon, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center space-x-3 px-4 py-3.5 text-gray-700 dark:text-gray-200 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0B1A30] dark:hover:text-blue-300 rounded-xl transition-all duration-300 transform hover:scale-105"
  >
    {icon}
    <span>{children}</span>
  </Link>
);

// DropdownItem Component
const DropdownItem: React.FC<{
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}> = ({ icon, children, onClick, className }) => (
  <button
    onClick={onClick}
    className={cn(
      'w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 transform hover:translate-x-1',
      className
    )}
  >
    {icon}
    <span>{children}</span>
  </button>
);

export default Navbar;
