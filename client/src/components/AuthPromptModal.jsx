import { useState } from 'react';
import { X, ShieldCheck, Mail } from 'lucide-react';

export default function AuthPromptModal({ isOpen, onClose, onSuccessLogin }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        onSuccessLogin(data.user);
        onClose();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Unable to connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 bg-brand-surface text-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-1">Campus Verification</h3>
        <p className="text-xs text-gray-500 mb-5">
          Enter your official <strong className="text-gray-800">@alustudent.com</strong> email to list items or contact sellers.
        </p>

        {error && (
          <div className="mb-4 p-2.5 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              placeholder="username@alustudent.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary hover:bg-brand-dark text-white py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Continue with Campus Email'}
          </button>
        </form>
      </div>
    </div>
  );
}