
import React from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import SearchBar from './SearchBar';
import Navigation from './Navigation';

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onToggle }) => {
  return (
    <>
      <Button variant="ghost" size="icon" onClick={onToggle} className="md:hidden">
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      
      <div 
        className={cn(
          "fixed inset-0 bg-white z-40 md:hidden transition-all duration-300 ease-out-expo pt-20",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="container mx-auto px-4 flex flex-col items-center space-y-6 pt-4">
          <SearchBar isMobile />
          <Navigation isMobile />

          <Button className="bg-primary hover:bg-primary/90 hover:shadow-md transition-gpu w-full max-w-xs mt-4">
            Sign In
          </Button>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
