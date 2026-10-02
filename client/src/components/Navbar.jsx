import { PlusCircle, Search, User, LogOut } from 'lucide-react';

export default function Navbar({
  user,
  onLogout,
  onSearch,
  onOpenPostModal,
  onOpenAuthModal,
}) {
  const handleSellClick = () => {
    if (user) {
      onOpenPostModal();
    } else {
      onOpenAuthModal('prompt'); // Or 'login' depending on your modal setup
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 cursor-pointer shrink-0">
          <div className="w-9 h-9 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900">
            ALCHE <span className="text-brand-primary">CampusCart</span>
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4 hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search gadgets, books, dorm items..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-full focus:bg-white focus:border-brand-primary outline-hidden transition-colors"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Sell Item Button (Intercepted for non-logged-in users) */}
          <button
            onClick={handleSellClick}
            className="flex items-center gap-1.5 bg-brand-primary hover:bg-brand-dark text-white px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Sell Item</span>
          </button>

          {/* Conditional User Auth Section */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-200">
                <div className="w-6 h-6 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-xs font-bold">
                  {user.name ? user.name[0].toUpperCase() : <User className="w-3.5 h-3.5" />}
                </div>
                <span className="text-xs font-semibold text-gray-700 hidden md:inline">
                  {user.name || user.email}
                </span>
              </div>

              <button
                onClick={onLogout}
                title="Log Out"
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => onOpenAuthModal('login')}
                className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuthModal('register')}
                className="px-3.5 py-2 text-xs sm:text-sm font-semibold bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 rounded-full transition-colors hidden sm:block cursor-pointer"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}