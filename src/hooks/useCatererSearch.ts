
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMap } from '@/components/map/MapContext';
import { Caterer } from '@/types';

export interface CatererFilters {
  query: string;
  cuisine: string | null;
  location: string | null;
  deliveryOnly: boolean;
  sortBy: 'rating' | 'deliveryFee' | 'preparationTime';
}

// Default filter values
const defaultFilters: CatererFilters = {
  query: '',
  cuisine: null,
  location: null,
  deliveryOnly: false,
  sortBy: 'rating'
};

export const useCatererSearch = (caterers: Caterer[]) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentLocation } = useMap();
  
  // Initialize filters from URL search params
  const [filters, setFilters] = useState<CatererFilters>({
    query: searchParams.get('q') || defaultFilters.query,
    cuisine: searchParams.get('cuisine') || defaultFilters.cuisine,
    location: searchParams.get('location') || defaultFilters.location,
    deliveryOnly: searchParams.get('deliveryOnly') === 'true' || defaultFilters.deliveryOnly,
    sortBy: (searchParams.get('sortBy') as CatererFilters['sortBy']) || defaultFilters.sortBy
  });
  
  // Filtered caterers state
  const [filteredCaterers, setFilteredCaterers] = useState<Caterer[]>(caterers);
  
  // Update filters function
  const updateFilters = (newFilters: Partial<CatererFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    // Update URL
    const params = new URLSearchParams();
    if (updatedFilters.query) params.set('q', updatedFilters.query);
    if (updatedFilters.cuisine) params.set('cuisine', updatedFilters.cuisine);
    if (updatedFilters.location) params.set('location', updatedFilters.location);
    if (updatedFilters.deliveryOnly) params.set('deliveryOnly', 'true');
    if (updatedFilters.sortBy !== defaultFilters.sortBy) params.set('sortBy', updatedFilters.sortBy);
    
    // Replace state in history to avoid creating new history entries on each filter change
    navigate(`/caterers?${params.toString()}`, { replace: true });
  };
  
  // Reset filters function
  const resetFilters = () => {
    setFilters(defaultFilters);
    navigate('/caterers');
  };
  
  // Apply filters whenever they change
  useEffect(() => {
    let result = [...caterers];
    
    // Filter by search query (name or description)
    if (filters.query) {
      const query = filters.query.toLowerCase();
      result = result.filter(
        caterer => 
          caterer.name.toLowerCase().includes(query) || 
          caterer.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by cuisine
    if (filters.cuisine) {
      result = result.filter(
        caterer => caterer.cuisine.some(c => 
          c.toLowerCase() === filters.cuisine?.toLowerCase()
        )
      );
    }
    
    // Filter by location (simple string match for demo)
    if (filters.location) {
      result = result.filter(
        caterer => caterer.location.toLowerCase().includes(filters.location?.toLowerCase() || '')
      );
    }
    
    // Filter by delivery availability
    if (filters.deliveryOnly) {
      result = result.filter(caterer => caterer.deliveryFee >= 0);
    }
    
    // Sort results
    switch (filters.sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'deliveryFee':
        result.sort((a, b) => a.deliveryFee - b.deliveryFee);
        break;
      case 'preparationTime':
        // Simple string comparison for preparation time
        result.sort((a, b) => {
          const timeA = parseInt(a.preparationTime.replace(/[^0-9]/g, ''));
          const timeB = parseInt(b.preparationTime.replace(/[^0-9]/g, ''));
          return timeA - timeB;
        });
        break;
    }
    
    setFilteredCaterers(result);
  }, [filters, caterers]);
  
  // Update location filter when currentLocation changes
  useEffect(() => {
    if (currentLocation && currentLocation.name && !filters.location) {
      updateFilters({ location: currentLocation.name });
    }
  }, [currentLocation]);
  
  return {
    filters,
    updateFilters,
    resetFilters,
    filteredCaterers
  };
};
