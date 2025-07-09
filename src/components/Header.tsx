import React, { useState } from 'react';
import { Menu, X, User, LogOut, Settings, PenTool, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    onNavigate('blog');
    setIsUserMenuOpen(false);
  };

  const menuItems = [
    { key: 'blog', label: 'Блог', public: true },
    { key: 'dashboard', label: 'Контролна табла', public: false, roles: ['super_admin', 'editor'] },
    { key: 'write', label: 'Пиши', public: false, roles: ['super_admin', 'editor', 'author'] },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (item.public) return true;
    if (!isAuthenticated) return false;
    if (item.roles && user) {
      return item.roles.includes(user.role);
    }
    return false;
  });

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => onNavigate('blog')}
              className="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <PenTool className="h-8 w-8 text-amber-800" />
              <span>Заплањске приче</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {filteredMenuItems.map(item => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  currentPage === item.key
                    ? 'text-amber-800 border-b-2 border-amber-800'
                    : 'text-gray-700 dark:text-gray-300 hover:text-amber-800 dark:hover:text-amber-600'
                }`}
              >
                {item.label}
              </button>
            ))}
            {!isAuthenticated && (
              <button
                onClick={() => onNavigate('register')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  currentPage === 'register'
                    ? 'text-amber-800 border-b-2 border-amber-800'
                    : 'text-gray-700 dark:text-gray-300 hover:text-amber-800 dark:hover:text-amber-600'
                }`}
              >
                Регистрација
              </button>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-amber-800 dark:hover:text-amber-600 transition-colors"
              title={isDarkMode ? 'Пребаци на светли режим' : 'Пребаци на тамни режим'}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-amber-800 dark:hover:text-amber-600 transition-colors"
                >
                  <img
                    src={user.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=1'}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="hidden sm:block text-sm font-medium">{user.name}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-amber-50 dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-amber-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        onNavigate('settings');
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span>Профил</span>
                    </button>
                    {user.role === 'super_admin' && (
                      <button
                        onClick={() => {
                          onNavigate('dashboard');
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Администрација</span>
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Одјави се</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="bg-amber-800 hover:bg-amber-900 text-amber-50 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Пријави се
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-amber-800 dark:hover:text-amber-600 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-2">
              {filteredMenuItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => {
                    onNavigate(item.key);
                    setIsMenuOpen(false);
                  }}
                  className={`px-3 py-2 text-left text-sm font-medium transition-colors ${
                    currentPage === item.key
                      ? 'text-amber-800 bg-amber-50'
                      : 'text-gray-700 dark:text-gray-300 hover:text-amber-800 dark:hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {!isAuthenticated && (
                <button
                  onClick={() => {
                    onNavigate('register');
                    setIsMenuOpen(false);
                  }}
                  className={`px-3 py-2 text-left text-sm font-medium transition-colors ${
                    currentPage === 'register'
                      ? 'text-amber-800 bg-amber-50'
                      : 'text-gray-700 dark:text-gray-300 hover:text-amber-800 dark:hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Пријави се / Региструј се
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;