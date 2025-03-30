
import React from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

const LocationButton: React.FC<LocationButtonProps> = ({ onClick, isLoading }) => {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={onClick}
      disabled={isLoading}
      className="ml-2"
      aria-label="Use current location"
    >
      <MapPin className="h-4 w-4" />
    </Button>
  );
};

export default LocationButton;
