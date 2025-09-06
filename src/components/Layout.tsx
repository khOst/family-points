import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Users, CheckSquare, Heart, Bell, User, LogOut } from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuthStore } from '../stores/authStore';

export function Layout() {
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { logout, user } = useAuthStore();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Groups', href: '/groups', icon: Users },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Wishlist', href: '/wishlist', icon: Heart },
    { name: 'Notifications', href: '/notifications', icon: Bell },
  ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <div className="min-h-screen bg-gray-25">
      <nav className="glass-effect sticky top-0 z-40 border-b border-gray-150/50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-12">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-900 tracking-tight">
                Family Points
              </Link>
            </div>
            
            <div className="hidden sm:flex sm:space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'inline-flex items-center px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-primary-500 text-white shadow-apple'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                    )}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 px-3 py-2 rounded-2xl text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 transition-all duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white/90 backdrop-blur-xl rounded-2xl shadow-apple-lg border border-gray-100 py-2 z-10">
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl mx-2 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Profile
                  </Link>
                  <hr className="my-2 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl mx-2 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-12 pb-24 sm:pb-12">
        <Outlet />
      </main>

      {/* Mobile navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 glass-effect border-t border-gray-150/50 safe-area-inset-bottom">
        <div className="flex justify-around px-4 py-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex flex-col items-center py-3 px-2 rounded-2xl text-xs font-medium transition-all duration-200 min-w-0 flex-1',
                  isActive
                    ? 'bg-primary-500 text-white shadow-apple'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                )}
              >
                <Icon className="h-5 w-5 mb-1 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}