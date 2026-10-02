import { useState } from 'react';
import Navbar from './components/Navbar';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Navbar 
        onSearch={(query) => setSearchQuery(query)}
        onOpenPostModal={() => alert('Post Item Modal - Coming on Day 13!')}
        onOpenAuthModal={(mode) => alert(`Auth Modal (${mode}) - Coming on Day 15!`)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-brand-surface border border-brand-primary/20 rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to <span className="text-brand-primary">ALCHE CampusCart</span>
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto text-sm">
            Buy, sell, and trade campus essentials with fellow ALC students across Beau Plan, Pamplemousses, and Grand Baie.
          </p>
          {searchQuery && (
            <p className="mt-4 text-xs font-semibold text-brand-dark bg-white inline-block px-3 py-1 rounded-full border border-brand-primary/20">
              Active Search: "{searchQuery}"
            </p>
          )}
        </div>
      </main>
    </div>
  );
}