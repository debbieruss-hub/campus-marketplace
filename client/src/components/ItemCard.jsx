import { Tag, MapPin, User, ArrowRight } from 'lucide-react';

export default function ItemCard({ item, onClick }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-MU', {
      style: 'currency',
      currency: 'MUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      onClick={() => onClick && onClick(item)}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all cursor-pointer flex flex-col"
    >
      {/* Image / Placeholder */}
      <div className="relative aspect-4/3 w-full bg-gray-100 overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-brand-surface/50">
            <Tag className="w-8 h-8 text-brand-primary/40" />
          </div>
        )}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-brand-dark shadow-xs">
          {item.category || 'General'}
        </span>
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 group-hover:text-brand-primary transition-colors line-clamp-1">
              {item.title}
            </h3>
            <span className="font-bold text-brand-primary whitespace-nowrap">
              {formatPrice(item.price)}
            </span>
          </div>

          <p className="text-xs text-gray-500 line-clamp-2">
            {item.description || 'No description provided.'}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            <span>{item.seller_name || 'ALC Student'}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{item.location || 'Campus'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}