
import React from 'react';
import { MapPin } from 'lucide-react';
import { MapLocation } from './MapContext';

interface LocationSearchResultsProps {
  isOpen: boolean;
  results: Array<MapLocation>;
  onLocationClick: (location: MapLocation) => void;
}

const LocationSearchResults: React.FC<LocationSearchResultsProps> = ({ 
  isOpen, 
  results, 
  onLocationClick 
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="absolute z-50 mt-1 w-full bg-white border border-halaeats-200 rounded-md shadow-lg max-h-60 overflow-auto">
      {results.length === 0 ? (
        <div className="p-3 text-center text-halaeats-500">No results found</div>
      ) : (
        results.map((item, index) => (
          <div
            key={index}
            className="p-2 hover:bg-halaeats-50 cursor-pointer flex items-start"
            onClick={() => onLocationClick(item)}
          >
            <MapPin className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <div className="font-medium">{item.name}</div>
              {item.address && item.address !== item.name && (
                <div className="text-sm text-halaeats-600">{item.address}</div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default LocationSearchResults;
