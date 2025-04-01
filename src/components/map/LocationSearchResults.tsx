
import React from 'react';
import { MapLocation } from './MapContext';
import { MapPin } from 'lucide-react';

interface LocationSearchResultsProps {
  results: MapLocation[];
  onLocationClick: (location: MapLocation) => void;
}

const LocationSearchResults = ({ results, onLocationClick }: LocationSearchResultsProps) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="max-h-60 overflow-y-auto py-2 z-50">
      {results.map((location, index) => (
        <div
          key={`${location.address}-${index}`}
          className="flex items-start px-3 py-2 hover:bg-halaeats-50 cursor-pointer"
          onClick={() => onLocationClick(location)}
        >
          <MapPin className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
          <div className="ml-2 text-sm">
            <div className="font-medium">{location.name}</div>
            {location.address && (
              <div className="text-halaeats-500 text-xs truncate">{location.address}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LocationSearchResults;
