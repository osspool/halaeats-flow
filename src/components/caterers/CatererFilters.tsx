
import React, { useState } from 'react';
import { Filter, X, Truck, Check, ChevronDown } from 'lucide-react';
import { CatererFilters as CatererFiltersType } from '@/hooks/useCatererSearch';

interface CatererFiltersProps {
  filters: CatererFiltersType;
  updateFilters: (filters: Partial<CatererFiltersType>) => void;
  resetFilters: () => void;
  cuisineOptions: string[];
  activeFilterCount: number;
}

const CatererFilters: React.FC<CatererFiltersProps> = ({
  filters,
  updateFilters,
  resetFilters,
  cuisineOptions,
  activeFilterCount
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  const handleDeliveryToggle = () => {
    updateFilters({ deliveryOnly: !filters.deliveryOnly });
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ sortBy: e.target.value as CatererFiltersType['sortBy'] });
  };
  
  const handleCuisineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ cuisine: e.target.value || null });
  };
  
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={toggleFilter}
          className="flex items-center gap-2 py-2 px-4 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-primary text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
        
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={handleDeliveryToggle}
            className={`flex items-center gap-2 py-2 px-4 rounded-lg border ${
              filters.deliveryOnly 
              ? 'border-primary text-primary bg-primary/5' 
              : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Truck className="h-4 w-4" />
            <span>Delivery Only</span>
            {filters.deliveryOnly && <Check className="h-4 w-4" />}
          </button>
          
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="rating">Sort by: Rating</option>
              <option value="deliveryFee">Sort by: Delivery Fee</option>
              <option value="preparationTime">Sort by: Preparation Time</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Expanded filter panel */}
      {isFilterOpen && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Cuisine Type</label>
            <div className="relative">
              <select
                value={filters.cuisine || ''}
                onChange={handleCuisineChange}
                className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">All Cuisines</option>
                {cuisineOptions.map((cuisine) => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Sort By</label>
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={handleSortChange}
                className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="rating">Rating</option>
                <option value="deliveryFee">Delivery Fee</option>
                <option value="preparationTime">Preparation Time</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Delivery Options</label>
            <button
              onClick={handleDeliveryToggle}
              className={`w-full flex items-center justify-between py-2 px-4 rounded-lg border ${
                filters.deliveryOnly 
                ? 'border-primary text-primary bg-primary/5' 
                : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>Delivery Only</span>
              </span>
              {filters.deliveryOnly && <Check className="h-4 w-4" />}
            </button>
          </div>
          
          <div className="md:col-span-3 flex justify-between mt-2">
            {activeFilterCount > 0 && (
              <button 
                onClick={resetFilters}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4 mr-1" />
                Clear all filters
              </button>
            )}
            <button 
              onClick={toggleFilter}
              className="ml-auto text-primary hover:text-primary/80"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default CatererFilters;
