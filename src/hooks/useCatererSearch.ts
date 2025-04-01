
import { useState, useEffect } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { searchCaterers, SearchParams } from '@/services/catererSearchService';

export interface CatererFilters {
  query: string;
  cuisine: string;
  deliveryOnly: boolean;
  sortBy: string;
  location?: string;
}

export const useCatererSearch = (initialCaterers: any[]) => {
  const { selectedLocation, searchQuery, selectedCuisine } = useLocation();
  
  const [filters, setFilters] = useState<CatererFilters>({
    query: searchQuery,
    cuisine: selectedCuisine !== 'All cuisines' ? selectedCuisine : '',
    deliveryOnly: false,
    sortBy: 'relevance',
    location: selectedLocation?.name
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
      // Use deliveryFee for sorting if priceLevel is not available
      sortedResults.sort((a, b) => (a.deliveryFee || 0) - (b.deliveryFee || 0));
    } else if (filters.sortBy === 'price-high') {
      // Use deliveryFee for sorting if priceLevel is not available
      sortedResults.sort((a, b) => (b.deliveryFee || 0) - (a.deliveryFee || 0));
    }
    // Default 'relevance' sorting is already handled by the search function
    
    setFilteredCaterers(sortedResults);
  }, [filters, selectedLocation, initialCaterers]);

  // Update filters when location changes
  useEffect(() => {
    if (selectedLocation) {
      setFilters(prev => ({
        ...prev,
        location: selectedLocation.name
      }));
    }
  }, [selectedLocation]);

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
      sortBy: 'relevance',
      location: selectedLocation?.name
    });
  };

  return {
    filters,
    updateFilters,
    resetFilters,
    filteredCaterers
  };
};
