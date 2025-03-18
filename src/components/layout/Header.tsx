
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

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
        isScrolled 
          ? 'py-3 bg-white/80 backdrop-blur-md shadow-sm' 
          : 'py-5 bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-serif font-bold text-primary">
            Hala<span className="text-halaeats-800">Eats</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={cn(
              "text-halaeats-700 hover:text-primary transition-gpu text-sm font-medium",
              location.pathname === "/" && "text-primary font-semibold"
            )}
          >
            Home
          </Link>
          <Link 
            to="/caterers" 
            className={cn(
              "text-halaeats-700 hover:text-primary transition-gpu text-sm font-medium",
              location.pathname.includes("/caterers") && "text-primary font-semibold"
            )}
          >
            Caterers
          </Link>
          <Link 
            to="/how-it-works" 
            className={cn(
              "text-halaeats-700 hover:text-primary transition-gpu text-sm font-medium",
              location.pathname === "/how-it-works" && "text-primary font-semibold"
            )}
          >
            How It Works
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-halaeats-400" />
            <input 
              type="text" 
              placeholder="Search for dishes or caterers..." 
              className="pl-10 pr-4 py-2 rounded-full bg-halaeats-50 border border-halaeats-100 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-gpu w-56" 
            />
          </div>
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">3</span>
            </Button>
          </Link>
          <Button className="bg-gradient-to-r from-primary to-cuisine-600 hover:shadow-md transition-gpu" size="sm">
            Sign In
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-3 md:hidden">
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">3</span>
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed inset-0 bg-white z-40 md:hidden transition-all duration-300 ease-out-expo pt-20",
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="container mx-auto px-4 flex flex-col items-center space-y-6 pt-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-halaeats-400" />
            <input 
              type="text" 
              placeholder="Search for dishes or caterers..." 
              className="pl-10 pr-4 py-3 rounded-full bg-halaeats-50 border border-halaeats-100 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-gpu w-full" 
            />
          </div>
          
          <nav className="flex flex-col items-center space-y-6 w-full">
            <Link 
              to="/" 
              className={cn(
                "text-halaeats-700 text-lg font-medium w-full text-center py-3 border-b border-halaeats-100",
                location.pathname === "/" && "text-primary font-semibold"
              )}
            >
              Home
            </Link>
            <Link 
              to="/caterers" 
              className={cn(
                "text-halaeats-700 text-lg font-medium w-full text-center py-3 border-b border-halaeats-100",
                location.pathname.includes("/caterers") && "text-primary font-semibold"
              )}
            >
              Caterers
            </Link>
            <Link 
              to="/how-it-works" 
              className={cn(
                "text-halaeats-700 text-lg font-medium w-full text-center py-3 border-b border-halaeats-100",
                location.pathname === "/how-it-works" && "text-primary font-semibold"
              )}
            >
              How It Works
            </Link>
            <Button className="bg-gradient-to-r from-primary to-cuisine-600 hover:shadow-md transition-gpu w-full max-w-xs mt-4">
              Sign In
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
