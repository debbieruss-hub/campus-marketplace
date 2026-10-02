import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, PlusCircle, User, LogOut, ShoppingBag } from 'lucide-react';

export default function Navbar({ onSearch, onOpenPostModal, onOpenAuthModal }) {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) onSearch(value);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white shadow-md shadow-brand-primary/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900 hidden sm:inline">
            ALCHE <span className="text-brand-primary">CampusCart</span>
          </span>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md mx-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search gadgets, books, dorm items..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Auth / Action Navigation */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <button
                onClick={onOpenPostModal}
                className="flex items-center gap-1.5 bg-brand-primary hover:bg-brand-dark text-white px-4 py-2 rounded-full font-medium text-sm transition-colors shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Post Item</span>
              </button>

              <div className="flex items-center gap-2 border-l border-gray-200 pl-3 ml-1">
                <span className="text-sm font-medium text-gray-700 hidden md:inline">
                  {user.name || user.email}
                </span>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-gray-500 hover:text-brand-accent hover:bg-rose-50 rounded-full transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuthModal('login')}
                className="text-sm font-medium text-gray-600 hover:text-brand-primary px-3 py-2 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuthModal('register')}
                className="bg-brand-primary hover:bg-brand-dark text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
              >
                Register
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}