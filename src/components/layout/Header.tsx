
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
import { useLocation } from '@/contexts/LocationContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const routerLocation = useRouterLocation();
  const { openLocationModal } = useLocation();

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
  }, [routerLocation]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out-expo',
        isScrolled 
          ? 'py-3 bg-white/90 backdrop-blur-md shadow-sm' 
          : 'py-5 bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <Navigation />

        {/* Desktop Search and Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <SearchBar />
          
          <CartButton />
          
          <Button 
            className="bg-primary hover:bg-primary/90 hover:shadow-md transition-gpu" 
            size="sm"
            onClick={openLocationModal}
          >
            Sign In
          </Button>
        </div>

        {/* Mobile Menu Button and Cart */}
        <div className="flex items-center space-x-3 md:hidden">
          <CartButton />
          <MobileMenu isOpen={isMenuOpen} onToggle={toggleMenu} />
        </div>
      </div>

      {/* Location Selection Modal */}
      <LocationModal />
    </header>
  );
};

export default Header;
