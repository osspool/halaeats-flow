
import React, { useState } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useLocation } from '@/contexts/LocationContext';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  className?: string;
  isMobile?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ className, isMobile = false }) => {
  const {
    searchQuery, 
    setSearchQuery, 
    selectedCuisine, 
    setSelectedCuisine,
    selectedLocation,
    openLocationModal
  } = useLocation();
  
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build search params
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCuisine !== cuisineOptions[0]) params.set('cuisine', selectedCuisine);
    if (selectedLocation?.name) params.set('location', selectedLocation.name);
    if (selectedLocation?.radius) params.set('radius', selectedLocation.radius.toString());
    
    // Navigate to caterers page with search params
    navigate(`/caterers?${params.toString()}`);
  };

  if (isMobile) {
    return (
      <form onSubmit={handleSearch} className={cn("w-full", className)}>
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
            <Button 
              variant="outline" 
              className="w-full flex justify-between items-center bg-white"
              onClick={openLocationModal}
            >
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                <span className="truncate text-sm">{selectedLocation?.name || 'Select location'}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-halaeats-400" />
            </Button>
            
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
            >
              {cuisineOptions.map((cuisine) => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>
          </div>
          
          <Button type="submit" variant="default" className="w-full mt-3 bg-primary hover:bg-primary/90">
            Search
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form 
      onSubmit={handleSearch} 
      className={cn(
        "flex items-center bg-white rounded-full border transition-all duration-200",
        isSearchFocused 
          ? "ring-2 ring-primary/20 border-primary" 
          : "border-halaeats-200 hover:border-halaeats-300",
        className
      )}
    >
      <Button 
        type="button"
        variant="ghost" 
        size="sm" 
        className="flex items-center h-10 rounded-l-full border-r border-halaeats-100 px-4"
        onClick={openLocationModal}
      >
        <MapPin className="h-4 w-4 mr-1 text-primary" />
        <span className="truncate max-w-28 text-halaeats-700">
          {selectedLocation?.name || 'Select location'}
        </span>
        <ChevronDown className="h-3 w-3 ml-1 text-halaeats-400" />
      </Button>
      
      <div className="flex items-center px-2">
        <Input 
          type="text" 
          placeholder="Search dishes or caterers..." 
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-10 w-40 lg:w-56"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
        
        <select
          className="h-8 rounded-md border-0 bg-transparent px-3 text-sm focus:outline-none"
          value={selectedCuisine}
          onChange={(e) => setSelectedCuisine(e.target.value)}
        >
          {cuisineOptions.map((cuisine) => (
            <option key={cuisine} value={cuisine}>{cuisine}</option>
          ))}
        </select>
        
        <Button type="submit" variant="ghost" size="icon" className="text-halaeats-500 hover:text-primary">
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
