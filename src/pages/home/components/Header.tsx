
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContent } from '../../../contexts/ContentContext';

export default function Header() {
  const { content } = useContent();
  const navigation = content.navigation;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isMobileMenuOpen ? 'bg-white shadow-sm' : 'bg-transparent'
        }`}
      >
        <nav className="px-4 sm:px-6 lg:px-12 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to={navigation.logo.url} className="cursor-pointer">
              {navigation.logo.imageUrl ? (
                <img src={navigation.logo.imageUrl} alt={navigation.logo.text} className="h-8 w-auto" />
              ) : (
                <span className="text-xl sm:text-2xl font-bold text-gray-900">{navigation.logo.text}</span>
              )}
            </Link>

            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navigation.menuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.url}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <Link
              to={navigation.ctaButton.url}
              className="hidden md:block px-5 lg:px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors whitespace-nowrap cursor-pointer"
            >
              {navigation.ctaButton.label}
            </Link>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-700 cursor-pointer w-10 h-10 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <i className={`${isMobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-2xl`}></i>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-white transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '72px' }}
      >
        <div className="flex flex-col h-full px-6 py-8">
          <div className="flex flex-col gap-2">
            {navigation.menuItems.map((item) => (
              <Link
                key={item.id}
                to={item.url}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-gray-900 py-3 border-b border-gray-100 cursor-pointer"
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          <div className="mt-8">
            <Link
              to={navigation.ctaButton.url}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full py-4 bg-gray-900 text-white text-center font-medium rounded-full cursor-pointer whitespace-nowrap"
            >
              {navigation.ctaButton.label}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
