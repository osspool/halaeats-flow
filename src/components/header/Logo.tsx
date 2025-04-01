
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <Link to="/" className={`flex items-center ${className || ''}`}>
      <span className="text-2xl font-serif font-bold text-primary">
        Hala<span className="text-halaeats-800">Eats</span>
      </span>
    </Link>
  );
};

export default Logo;
