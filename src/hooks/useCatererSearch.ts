
import { useState, useEffect } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { searchCaterers, SearchParams } from '@/services/catererSearchService';

export interface CatererFilters {
  query: string;
  cuisine: string;
  deliveryOnly: boolean;
  sortBy: string;
}

export const useCatererSearch = (initialCaterers: any[]) => {
  const { selectedLocation, searchQuery, selectedCuisine } = useLocation();
  
  const [filters, setFilters] = useState<CatererFilters>({
    query: searchQuery,
    cuisine: selectedCuisine !== 'All cuisines' ? selectedCuisine : '',
    deliveryOnly: false,
    sortBy: 'relevance'
  });
  
  const [filteredCaterers, setFilteredCaterers] = useState(initialCaterers);
  
  useEffect(() => {
    // Update search results when filters or location changes
    const searchParams: SearchParams = {
      query: filters.query,
      cuisine: filters.cuisine,
      deliveryOnly: filters.deliveryOnly
    };
    
    // Add location parameters if available
    if (selectedLocation) {
      searchParams.location = selectedLocation.coordinates;
      searchParams.radius = selectedLocation.radius;
    }
    
    const results = searchCaterers(searchParams);
    
    // Apply sorting
    let sortedResults = [...results];
    if (filters.sortBy === 'rating') {
      sortedResults.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'price-low') {
      sortedResults.sort((a, b) => a.priceLevel - b.priceLevel);
    } else if (filters.sortBy === 'price-high') {
      sortedResults.sort((a, b) => b.priceLevel - a.priceLevel);
    }
    // Default 'relevance' sorting is already handled by the search function
    
    setFilteredCaterers(sortedResults);
  }, [filters, selectedLocation, initialCaterers]);

  // Function to update filters
  const updateFilters = (newFilters: Partial<CatererFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  // Function to reset all filters
  const resetFilters = () => {
    setFilters({
      query: '',
      cuisine: '',
      deliveryOnly: false,
      sortBy: 'relevance'
    });
  };

  return {
    filters,
    updateFilters,
    resetFilters,
    filteredCaterers
  };
};
