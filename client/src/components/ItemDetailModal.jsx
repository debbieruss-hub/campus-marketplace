import { X, MapPin, User, Tag, Mail, Calendar, Phone } from 'lucide-react';

export default function ItemDetailModal({ item, onClose }) {
  if (!item) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-MU', {
      style: 'currency',
      currency: 'MUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs animate-fade-in">
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white text-gray-500 hover:text-gray-900 rounded-full backdrop-blur-md transition-colors shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto flex-1">
          {/* Header Image / Placeholder */}
          <div className="relative aspect-16/9 w-full bg-gray-100">
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400 bg-brand-surface/60">
                <Tag className="w-12 h-12 text-brand-primary/40" />
                <span className="text-xs font-medium text-brand-dark/60">No Image Available</span>
              </div>
            )}
            <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-brand-dark shadow-xs">
              {item.category || 'General'}
            </span>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-gray-100 pb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{item.title}</h2>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                    {item.location || 'Campus'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                    Posted Recently
                  </span>
                </div>
              </div>
              <span className="text-2xl font-extrabold text-brand-primary">
                {formatPrice(item.price)}
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {item.description || 'No detailed description provided for this item.'}
              </p>
            </div>

            {/* Seller Info Card */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
                  {(item.seller_name || 'A')[0].toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{item.seller_name || 'ALC Student'}</h4>
                  <p className="text-xs text-gray-500">Verified Marketplace Seller</p>
                </div>
              </div>

              <a
                href={`mailto:${item.seller_email || 'student@alche.ac.mu'}?subject=Inquiry about ${encodeURIComponent(item.title)}`}
                className="flex items-center gap-2 bg-brand-primary hover:bg-brand-dark text-white px-4 py-2 rounded-full font-medium text-xs transition-colors shadow-xs"
              >
                <Mail className="w-3.5 h-3.5" />
                Contact Seller
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}