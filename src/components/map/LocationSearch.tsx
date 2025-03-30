
import React, { useState, useEffect, useRef } from 'react';
import { useMap } from './MapContext';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationSearchProps {
  onSelectAddress?: (address: string) => void;
  placeholder?: string;
  className?: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  onSelectAddress,
  placeholder = 'Search for a location...',
  className = '',
}) => {
  const { searchAddress, selectLocation, setCurrentLocation } = useMap();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{
    coordinates: [number, number];
    address?: string;
    name?: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Detect clicks outside the component to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search query changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 2) {
        setIsLoading(true);
        try {
          const locations = await searchAddress(query);
          setResults(locations);
          setIsOpen(locations.length > 0);
        } catch (error) {
          console.error('Error searching locations:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchAddress]);

  const handleLocationClick = (location: {
    coordinates: [number, number];
    address?: string;
    name?: string;
  }) => {
    selectLocation(location);
    setQuery(location.address || location.name || '');
    setIsOpen(false);
    if (onSelectAddress && location.address) {
      onSelectAddress(location.address);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = {
            coordinates: [latitude, longitude] as [number, number],
            address: 'Current Location',
          };
          setCurrentLocation(location);
          setQuery('Current Location');
          setIsOpen(false);
          setIsLoading(false);
          if (onSelectAddress) {
            onSelectAddress('Current Location');
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
        }
      );
    }
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-halaeats-400" />
          <input
            type="text"
            placeholder={placeholder}
            className="w-full pl-9 pr-4 py-2 border border-halaeats-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setIsOpen(true)}
          />
          {isLoading && (
            <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 text-halaeats-400 animate-spin" />
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="ml-2"
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-halaeats-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {results.map((item, index) => (
            <div
              key={index}
              className="p-2 hover:bg-halaeats-50 cursor-pointer flex items-start"
              onClick={() => handleLocationClick(item)}
            >
              <MapPin className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <div className="font-medium">{item.name}</div>
                {item.address && item.address !== item.name && (
                  <div className="text-sm text-halaeats-600">{item.address}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
