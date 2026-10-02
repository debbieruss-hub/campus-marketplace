import { useState, useRef } from 'react';
import { X, Upload, AlertCircle, PlusCircle } from 'lucide-react';

const CATEGORIES = [
  'Kitchenware',
  'Appliances',
  'Furniture',
  'Electronics',
  'Textbooks & Notes',
  'Clothing & Accessories',
  'Other'
];

export default function PostItemModal({ isOpen, onClose, onItemCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: 'Kitchenware',
    location: 'Pamplemousses Campus',
    description: '',
    image_url: '',
    seller_name: 'Deborah',
    seller_email: 'deborah@alche.ac.mu',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Item title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a valid positive number';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please provide a short description';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description should be at least 10 characters long';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Campus location is required';
    }

    // Required image validation
    if (!formData.image_url) {
      newErrors.image_url = 'Item photo is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, image_url: reader.result }));
        if (errors.image_url) {
          setErrors((prev) => ({ ...prev, image_url: null }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image_url: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    setTimeout(() => {
      const newItem = {
        id: Date.now(),
        ...formData,
        price: Number(formData.price),
        created_at: new Date().toISOString(),
      };

      onItemCreated(newItem);
      setSubmitting(false);
      handleResetAndClose();
    }, 600);
  };

  const handleResetAndClose = () => {
    setFormData({
      title: '',
      price: '',
      category: 'Kitchenware',
      location: 'Pamplemousses Campus',
      description: '',
      image_url: '',
      seller_name: 'Deborah',
      seller_email: 'deborah@alche.ac.mu',
    });
    setImagePreview(null);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-brand-primary" />
            <h2 className="text-xl font-bold text-gray-900">List an Item for Sale</h2>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Item Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Vinod Triply Stainless Steel Multipan"
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-gray-50/50 focus:bg-white transition-colors outline-hidden ${
                errors.title
                  ? 'border-brand-accent focus:border-brand-accent'
                  : 'border-gray-200 focus:border-brand-primary'
              }`}
            />
            {errors.title && (
              <p className="flex items-center gap-1 text-xs text-brand-accent mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Price & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Price (MUR) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                  Rs
                </span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="1500"
                  className={`w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border bg-gray-50/50 focus:bg-white transition-colors outline-hidden ${
                    errors.price
                      ? 'border-brand-accent focus:border-brand-accent'
                      : 'border-gray-200 focus:border-brand-primary'
                  }`}
                />
              </div>
              {errors.price && (
                <p className="flex items-center gap-1 text-xs text-brand-accent mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.price}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-brand-primary transition-colors outline-hidden"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Campus Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Pamplemousses Campus, Dorm Block B"
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-gray-50/50 focus:bg-white transition-colors outline-hidden ${
                errors.location
                  ? 'border-brand-accent focus:border-brand-accent'
                  : 'border-gray-200 focus:border-brand-primary'
              }`}
            />
            {errors.location && (
              <p className="flex items-center gap-1 text-xs text-brand-accent mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.location}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe condition, size, reason for selling..."
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-gray-50/50 focus:bg-white transition-colors outline-hidden resize-none ${
                errors.description
                  ? 'border-brand-accent focus:border-brand-accent'
                  : 'border-gray-200 focus:border-brand-primary'
              }`}
            />
            {errors.description && (
              <p className="flex items-center gap-1 text-xs text-brand-accent mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Item Photo *
            </label>
            
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 group">
                <img
                  src={imagePreview}
                  alt="Upload preview"
                  className="w-full h-40 object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 bg-gray-900/70 hover:bg-gray-900 text-white rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`w-full h-28 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  errors.image_url
                    ? 'border-brand-accent bg-red-50/30 text-brand-accent'
                    : 'border-gray-200 hover:border-brand-primary/50 bg-gray-50/50 hover:bg-brand-surface/40 text-gray-500'
                }`}
              >
                <Upload className={`w-5 h-5 ${errors.image_url ? 'text-brand-accent' : 'text-gray-400'}`} />
                <span className="text-xs font-medium">Upload photo from your device</span>
                <span className="text-[10px] opacity-75">PNG, JPG, or WEBP</span>
              </button>
            )}

            {errors.image_url && (
              <p className="flex items-center gap-1 text-xs text-brand-accent mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.image_url}
              </p>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleResetAndClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-brand-primary hover:bg-brand-dark text-white px-5 py-2.5 rounded-xl font-semibold text-xs transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Publishing...' : 'Post Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}