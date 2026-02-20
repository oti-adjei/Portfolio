
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ProjectHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="px-6 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 flex items-center justify-center">
              <img 
                src="https://public.readdy.ai/ai/img_res/e8c3057f-5e04-4bb4-912d-e72de69e97ee.png" 
                alt="Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/#works"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Works
            </Link>
            <Link
              to="/#about"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
            >
              About
            </Link>
            <Link
              to="/#contact"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Contact
            </Link>
          </div>

          <Link
            to="/#contact"
            className="hidden md:block px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            Get in Touch
          </Link>

          <button className="md:hidden text-gray-700 cursor-pointer">
            <i className="ri-menu-line text-2xl"></i>
          </button>
        </div>
      </nav>
    </header>
  );
}
