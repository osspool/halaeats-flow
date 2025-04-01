
import React, { useState, useEffect, useRef } from 'react';
import { useMap } from './MapContext';
import SearchInput from './SearchInput';
import LocationButton from './LocationButton';
import LocationSearchResults from './LocationSearchResults';
import { MapLocation } from './MapContext';

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
  const [results, setResults] = useState<Array<MapLocation>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Handle direct query updates
  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (newQuery.length > 2) {
      searchTimeoutRef.current = setTimeout(async () => {
        setIsLoading(true);
        try {
          const locations = await searchAddress(newQuery);
          setResults(locations);
          setIsOpen(locations.length > 0);
        } catch (error) {
          console.error('Error searching locations:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 500);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleLocationClick = (location: MapLocation) => {
    // Update the current location in the MapContext
    selectLocation(location);
    setQuery(location.address || location.name || '');
    setIsOpen(false);
    if (onSelectAddress && location.address) {
      onSelectAddress(location.address);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length > 2 && !isLoading) {
      setIsLoading(true);
      searchAddress(query)
        .then(locations => {
          setResults(locations);
          setIsOpen(locations.length > 0);
        })
        .catch(error => {
          console.error('Error searching locations:', error);
          setResults([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
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
            name: 'Current Location'
          };
          
          // Update the global current location
          setCurrentLocation(location);
          selectLocation(location);
          
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
      <form onSubmit={handleSearch} className="flex items-center">
        <SearchInput 
          query={query}
          setQuery={handleQueryChange}
          isLoading={isLoading}
          placeholder={placeholder}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          onSubmit={handleSearch}
        />
        <LocationButton 
          onClick={getCurrentLocation}
          isLoading={isLoading}
        />
      </form>
      
      {isOpen && (
        <div className="absolute w-full left-0 top-full mt-1 shadow-lg bg-white rounded-md border border-halaeats-200 z-50">
          <LocationSearchResults 
            results={results}
            onLocationClick={handleLocationClick}
          />
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
