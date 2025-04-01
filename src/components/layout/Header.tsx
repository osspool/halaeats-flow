
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { mockCartItems } from '@/pages/CartPage';
import CartDropdown from '@/components/cart/CartDropdown';
import { useMap } from '@/components/map/MapContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const cuisineOptions = [
  "All cuisines",
  "Indian",
  "Middle Eastern",
  "Italian",
  "Mexican",
  "Chinese",
  "Japanese",
  "Thai",
  "Mediterranean",
  "Lebanese",
  "Turkish"
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState(cuisineOptions[0]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { currentLocation } = useMap();
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // Extract location name for display
  const locationDisplay = currentLocation?.name || 'Select location';

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
    setIsCartOpen(false);
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeCart = () => setIsCartOpen(false);

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Build search params
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCuisine !== cuisineOptions[0]) params.set('cuisine', selectedCuisine);
    if (currentLocation?.name) params.set('location', currentLocation.name);
    
    // Navigate to caterers page with search params
    navigate(`/caterers?${params.toString()}`);
  };

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

        {/* Desktop Search and Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <form 
            onSubmit={handleSearch} 
            className={cn(
              "flex items-center bg-white rounded-full border transition-all duration-200",
              isSearchFocused 
                ? "ring-2 ring-primary/20 border-primary" 
                : "border-halaeats-200 hover:border-halaeats-300"
            )}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center h-10 rounded-l-full border-r border-halaeats-100 px-4"
                >
                  <MapPin className="h-4 w-4 mr-1 text-primary" />
                  <span className="truncate max-w-28 text-halaeats-700">{locationDisplay}</span>
                  <ChevronDown className="h-3 w-3 ml-1 text-halaeats-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2">
                {currentLocation && (
                  <DropdownMenuItem className="flex items-start rounded-md">
                    <MapPin className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{currentLocation.name}</div>
                      {currentLocation.address && (
                        <div className="text-xs text-muted-foreground">{currentLocation.address}</div>
                      )}
                    </div>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => navigate('/caterers')} className="rounded-md mt-1">
                  Change location
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="flex items-center px-2">
              <Input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search dishes or caterers..." 
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-10 w-40 lg:w-56"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center h-8 rounded-md px-3 text-sm text-halaeats-700"
                  >
                    <span className="truncate max-w-28">{selectedCuisine}</span>
                    <ChevronDown className="h-3 w-3 ml-1 text-halaeats-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 p-2">
                  {cuisineOptions.map((cuisine) => (
                    <DropdownMenuItem 
                      key={cuisine} 
                      onClick={() => setSelectedCuisine(cuisine)}
                      className={cn(
                        "cursor-pointer rounded-md",
                        selectedCuisine === cuisine && "font-medium text-primary bg-primary/5"
                      )}
                    >
                      {cuisine}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button type="submit" variant="ghost" size="icon" className="text-halaeats-500 hover:text-primary">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </form>
          
          <Popover open={isCartOpen} onOpenChange={setIsCartOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                  {mockCartItems.length}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 border-none shadow-none bg-transparent w-auto" align="end">
              <CartDropdown items={mockCartItems} onClose={closeCart} />
            </PopoverContent>
          </Popover>
          
          <Button className="bg-primary hover:bg-primary/90 hover:shadow-md transition-gpu" size="sm">
            Sign In
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-3 md:hidden">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                  {mockCartItems.length}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 border-none shadow-none bg-transparent w-auto" align="end">
              <CartDropdown items={mockCartItems} onClose={() => {}} />
            </PopoverContent>
          </Popover>
          
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
          <form onSubmit={handleSearch} className="flex flex-col w-full space-y-3">
            <div className="bg-halaeats-50 rounded-xl p-3 border border-halaeats-100">
              <div className="flex items-center bg-white rounded-lg border border-halaeats-200 mb-3">
                <Search className="h-4 w-4 ml-3 text-halaeats-400" />
                <input 
                  type="text" 
                  placeholder="Search for dishes or caterers..." 
                  className="pl-2 pr-4 py-3 rounded-r-lg border-0 focus:outline-none text-sm w-full" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full flex justify-between items-center bg-white">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        <span className="truncate text-sm">{locationDisplay}</span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-halaeats-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {currentLocation && (
                      <DropdownMenuItem className="flex items-start">
                        <MapPin className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <div className="font-medium">{currentLocation.name}</div>
                          {currentLocation.address && (
                            <div className="text-xs text-muted-foreground">{currentLocation.address}</div>
                          )}
                        </div>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => navigate('/caterers')}>
                      Change location
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full flex justify-between items-center bg-white">
                      <span className="truncate text-sm">{selectedCuisine}</span>
                      <ChevronDown className="h-4 w-4 text-halaeats-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {cuisineOptions.map((cuisine) => (
                      <DropdownMenuItem 
                        key={cuisine} 
                        onClick={() => setSelectedCuisine(cuisine)}
                        className={cn(
                          "cursor-pointer",
                          selectedCuisine === cuisine && "font-medium text-primary bg-primary/5"
                        )}
                      >
                        {cuisine}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <Button type="submit" variant="default" className="w-full mt-3 bg-primary hover:bg-primary/90">
                Search
              </Button>
            </div>
          </form>
          
          <nav className="flex flex-col items-center space-y-6 w-full mt-4">
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
            <Button className="bg-primary hover:bg-primary/90 hover:shadow-md transition-gpu w-full max-w-xs mt-4">
              Sign In
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
