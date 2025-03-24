
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { caterers } from '@/data/mockData';
import { AvailableDate, MenuItem, TimeSlot } from '@/types';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CatererProfile from '@/components/caterer/CatererProfile';
import MenuDatePicker from '@/components/caterer/MenuDatePicker';
import DishCard from '@/components/caterer/DishCard';

const CatererPage = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Find the caterer data
  const caterer = caterers.find(c => c.id === id);
  
  useEffect(() => {
    if (caterer && caterer.availableDates.length > 0) {
      // Set the initial selected date to the first available date
      setSelectedDate(caterer.availableDates[0].date);
      
      // Get all menu items across all dates
      const allItems = caterer.availableDates.flatMap(date => date.menu);
      
      // Remove duplicates by id
      const uniqueItems = Array.from(
        new Map(allItems.map(item => [item.id, item])).values()
      );
      
      // Get unique categories
      const uniqueCategories = ['All', ...new Set(uniqueItems.map(item => item.category))];
      
      setCategories(uniqueCategories);
      
      // Filter by category if needed
      let filteredItems = uniqueItems;
      if (selectedCategory !== 'All') {
        filteredItems = filteredItems.filter(item => item.category === selectedCategory);
      }
      
      setMenuItems(filteredItems);
    }
  }, [caterer, selectedCategory]);
  
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };
  
  const handleViewDetails = (item: MenuItem) => {
    // In a real app, we would show detailed view of the item
    console.log('View details for:', item.name);
  };
  
  if (!caterer) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow mt-16 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-medium mb-2">Caterer Not Found</h2>
            <p className="text-halaeats-600">The caterer you're looking for doesn't exist or has been removed.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow mt-16">
        <CatererProfile caterer={caterer} />
        
        <div className="container mx-auto px-4 py-8">
          <MenuDatePicker 
            availableDates={caterer.availableDates}
            selectedDate={selectedDate}
            onSelectDate={handleDateSelect}
          />
          
          {/* Category Filter */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Menu Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`px-4 py-2 rounded-full border transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-halaeats-700 border-halaeats-200 hover:border-primary/50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Menu Items */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Available Dishes</h3>
            
            {menuItems.length === 0 ? (
              <div className="bg-halaeats-50 rounded-lg p-8 text-center">
                <p className="text-halaeats-600">
                  {selectedCategory !== 'All'
                    ? `No ${selectedCategory} dishes available.`
                    : 'No dishes available.'}
                </p>
                <p className="text-sm text-halaeats-500 mt-2">
                  Try selecting a different category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map(item => (
                  <DishCard 
                    key={item.id}
                    dish={item}
                    selectedDate={selectedDate}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CatererPage;
