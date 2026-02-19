import { useState, type FormEvent } from 'react';
import { useContent } from '../../../contexts/ContentContext';

export default function ContactCTA() {
  const { content } = useContent();
  const contactCTA = content.homePage.contactCTA;
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }

    setStatus('loading');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error('Submission failed:', err);
      setStatus('error');
    }
  };

  return (
    <section className="py-24 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-3xl overflow-hidden bg-[#8067f0]">
          <div className="px-12 py-16 text-center text-white">
            <h3 className="text-3xl font-medium mb-6">{contactCTA.heading}</h3>
            <p className="text-xl mb-8 opacity-90">{contactCTA.description}</p>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto mb-6">
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-2 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                  disabled={status === 'loading'}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-8 py-4 bg-[#f75023] hover:bg-[#e0431a] text-white rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
                >
                  {status === 'loading' ? (
                    <i className="ri-loader-4-line animate-spin"></i>
                  ) : (
                    'Send'
                  )}
                </button>
              </div>

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

            
          </div>
        </div>
      </div>
    </section>
  );
}
