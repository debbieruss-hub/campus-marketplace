import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ItemCard from './components/ItemCard';
import API from './services/api';

const MOCK_ITEMS = [
  {
    id: 1,
    title: 'Vinod Triply Stainless Steel Multipan (26cm)',
    price: 1800,
    category: 'Kitchenware',
    description: 'Heavy-bottom tri-ply pan perfect for daily cooking, uniform heat distribution.',
    location: 'Pamplemousses Campus',
    seller_name: 'Deborah',
    image_url: ''
  },
  {
    id: 2,
    title: 'Panasonic 800W Multi-Function Blender',
    price: 2500,
    category: 'Appliances',
    description: 'Includes glass jug and dual dry mills for smoothie prep and grain milling.',
    location: 'Dorm Block B',
    seller_name: 'Deborah',
    image_url: ''
  },
  {
    id: 3,
    title: 'Ergonomic Desk Chair with Mesh Back',
    price: 3200,
    category: 'Furniture',
    description: 'Adjustable height and arch support, perfect for long study sessions.',
    location: 'Pamplemousses',
    seller_name: 'Student Seller',
    image_url: ''
  }
];

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await API.get('/items');
        if (response.data && response.data.length > 0) {
          setItems(response.data);
        } else {
          setItems(MOCK_ITEMS);
        }
      } catch (err) {
        setItems(MOCK_ITEMS);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Navbar
        onSearch={(query) => setSearchQuery(query)}
        onOpenPostModal={() => alert('Post Item Modal - Coming on Day 13!')}
        onOpenAuthModal={(mode) => alert(`Auth Modal (${mode}) - Coming on Day 15!`)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Section */}
        <div className="bg-brand-surface border border-brand-primary/20 rounded-2xl p-6 sm:p-8 text-center shadow-xs">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome to <span className="text-brand-primary">ALCHE CampusCart</span>
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto text-sm">
            Buy, sell, and trade campus essentials with fellow ALC students across Beau Plan, Pamplemousses, and Grand Baie.
          </p>
        </div>

        {/* Listings Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Recent Marketplace Listings'}
            </h2>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-64 bg-gray-200/60 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onClick={(selected) => alert(`Viewing item: ${selected.title}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-500 text-sm">No items match your search term.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}