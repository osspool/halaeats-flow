
import { useState, useEffect } from 'react';
import { useLocation as useRouterLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Logo from '@/components/header/Logo';
import Navigation from '@/components/header/Navigation';
import SearchBar from '@/components/header/SearchBar';
import CartButton from '@/components/header/CartButton';
import MobileMenu from '@/components/header/MobileMenu';
import LocationModal from '@/components/location/LocationModal';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useRouterLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out-expo',
        isScrolled || !isHome
          ? 'py-3 bg-white/95 backdrop-blur-md shadow-sm' 
          : 'py-4 bg-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <Navigation className="mx-6 hidden lg:flex" />

          {/* Desktop Search and Actions */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <SearchBar className="flex-1 max-w-md" isMinimal={true} />
            
            <div className="hidden md:flex items-center gap-2">
              <CartButton />
              
              <Button className="bg-primary hover:bg-primary/90 hover:shadow-md transition-gpu" size="sm">
                Sign In
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button and Cart */}
          <div className="flex items-center space-x-3 md:hidden">
            <CartButton />
            <MobileMenu isOpen={isMenuOpen} onToggle={toggleMenu} />
          </div>
        </div>
      </div>

      {/* Location Selection Modal */}
      <LocationModal />
    </header>
  );
};

export default Header;
