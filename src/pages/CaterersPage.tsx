import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchX, MapPin, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCatererSearch } from '@/hooks/useCatererSearch';
import { caterers } from '@/data/mockData';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CatererCard from '@/components/caterers/CatererCard';
import CatererFilters from '@/components/caterers/CatererFilters';
import CuisineCategories from '@/components/caterers/CuisineCategories';

const CaterersPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  
  // Extract unique cuisine options from caterers
  const allCuisines = Array.from(
    new Set(caterers.flatMap(caterer => caterer.cuisine))
  ).sort();
  
  // Use the custom hook for filtering caterers
  const { 
    filters, 
    updateFilters, 
    resetFilters, 
    filteredCaterers 
  } = useCatererSearch(caterers);
  
  // Calculate how many active filters we have
  const activeFilterCount = [
    filters.query,
    filters.cuisine,
    filters.deliveryOnly
  ].filter(Boolean).length;
  
  // Update the search query when URL params change
  useEffect(() => {
    const queryParam = searchParams.get('q');
    if (queryParam !== null && queryParam !== searchQuery) {
      setSearchQuery(queryParam);
    }
  }, [searchParams]);
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ query: searchQuery });
  };
  
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  // Item animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <section className="mb-8">
            <h1 className="text-3xl font-semibold mb-2">Find Caterers</h1>
            <p className="text-gray-600">
              Discover the best caterers for your next event
            </p>
            
            {/* Search form - for mobile only */}
            <form 
              onSubmit={handleSearch}
              className="mt-4 mb-6 flex items-center gap-2 md:hidden"
            >
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search caterers or dishes"
                  className="pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SearchX className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <button 
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white px-4 py-3 rounded-lg"
              >
                Search
              </button>
            </form>
          </section>
          
          {/* Cuisine category selector */}
          <CuisineCategories 
            selectedCuisine={filters.cuisine}
            onSelectCuisine={(cuisine) => updateFilters({ cuisine })}
          />
          
          {/* Filters section */}
          <CatererFilters
            filters={filters}
            updateFilters={updateFilters}
            resetFilters={resetFilters}
            cuisineOptions={allCuisines as string[]}
            activeFilterCount={activeFilterCount}
          />
          
          {/* Results section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {filteredCaterers.length} {filteredCaterers.length === 1 ? 'Result' : 'Results'}
              </h2>
            </div>
            
            {filteredCaterers.length > 0 ? (
              <motion.div 
                className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                initial="hidden"
                animate="visible"
              >
                {filteredCaterers.map((caterer) => (
                  <motion.div key={caterer.id}>
                    <CatererCard caterer={caterer} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="py-16 text-center">
                <SearchX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No caterers found</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  We couldn't find any caterers matching your search. Try adjusting your filters or search for something else.
                </p>
                <button 
                  onClick={resetFilters}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CaterersPage;
