
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavigationProps {
  className?: string;
  isMobile?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ className, isMobile = false }) => {
  const location = useLocation();
  
  const links = [
    { to: '/', label: 'Home' },
    { to: '/caterers', label: 'Caterers' },
    { to: '/how-it-works', label: 'How It Works' }
  ];

  if (isMobile) {
    return (
      <nav className={cn("flex flex-col items-center space-y-6 w-full mt-4", className)}>
        {links.map((link) => (
          <Link 
            key={link.to}
            to={link.to} 
            className={cn(
              "text-halaeats-700 text-lg font-medium w-full text-center py-3 border-b border-halaeats-100",
              location.pathname === link.to && "text-primary font-semibold"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className={cn("hidden md:flex items-center space-x-8", className)}>
      {links.map((link) => (
        <Link 
          key={link.to}
          to={link.to} 
          className={cn(
            "text-halaeats-700 hover:text-primary transition-gpu text-sm font-medium",
            location.pathname === link.to && "text-primary font-semibold"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
