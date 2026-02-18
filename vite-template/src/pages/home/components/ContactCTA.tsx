import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../../../contexts/ContentContext';

export default function ContactCTA() {
  const { content } = useContent();
  const contactCTA = content.homePage.contactCTA;
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }

    setStatus('loading');

    // Simulate API call with proper error handling
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus('success');
      setEmail('');
      // Reset to idle after a short period
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error('Submission failed:', err);
      setStatus('error');
    }
  };

  return (
    <section className="py-24 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>

          {/* Content */}
          <div className="relative z-10 px-12 py-16 text-center text-white">
            <h2 className="text-5xl font-bold mb-6">{contactCTA.heading}</h2>
            <p className="text-xl mb-8 opacity-90">{contactCTA.description}</p>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-6">
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                  disabled={status === 'loading'}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
                >
                  {status === 'loading' ? (
                    <i className="ri-loader-4-line animate-spin"></i>
                  ) : (
                    'Send'
                  )}
                </button>
              </div>

              {/* Status Messages */}
              {status === 'success' && (
                <p className="mt-4 text-white font-medium">
                  ✓ Thanks! I'll get back to you soon.
                </p>
              )}
              {status === 'error' && (
                <p className="mt-4 text-white font-medium">
                  ✗ Please enter a valid email address.
                </p>
              )}
            </form>

            {/* CTA Button */}
            <Link
              to={contactCTA.ctaButton.url}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              {contactCTA.ctaButton.label}
              <i className="ri-arrow-right-line"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
