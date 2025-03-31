
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CuisineCategoryProps {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

const cuisineIcons = {
  'All': '🍴',
  'Indian': '🍛',
  'Middle Eastern': '🧆',
  'Italian': '🍝',
  'Mexican': '🌮',
  'Chinese': '🥢',
  'Japanese': '🍣',
  'Thai': '🥘',
  'Mediterranean': '🫒',
  'Lebanese': '🥙',
  'Turkish': '🥙'
};

const CuisineCategory: React.FC<CuisineCategoryProps> = ({ 
  id, name, icon, isActive, onClick 
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(name === 'All' ? '' : name)}
      className={cn(
        "flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition-colors",
        isActive 
          ? "bg-primary/10 border-primary text-primary font-semibold" 
          : "bg-gray-50 hover:bg-gray-100 text-gray-700"
      )}
    >
      <div className="text-2xl">{icon}</div>
      <span className="text-sm whitespace-nowrap">{name}</span>
    </motion.div>
  );
};

interface CuisineCategoriesProps {
  selectedCuisine: string | null;
  onSelectCuisine: (cuisine: string | null) => void;
}

const CuisineCategories: React.FC<CuisineCategoriesProps> = ({ 
  selectedCuisine, onSelectCuisine 
}) => {
  const categories = [
    { id: 'all', name: 'All', icon: cuisineIcons['All'] },
    { id: 'indian', name: 'Indian', icon: cuisineIcons['Indian'] },
    { id: 'middle-eastern', name: 'Middle Eastern', icon: cuisineIcons['Middle Eastern'] },
    { id: 'italian', name: 'Italian', icon: cuisineIcons['Italian'] },
    { id: 'mexican', name: 'Mexican', icon: cuisineIcons['Mexican'] },
    { id: 'chinese', name: 'Chinese', icon: cuisineIcons['Chinese'] },
    { id: 'japanese', name: 'Japanese', icon: cuisineIcons['Japanese'] },
    { id: 'thai', name: 'Thai', icon: cuisineIcons['Thai'] },
    { id: 'mediterranean', name: 'Mediterranean', icon: cuisineIcons['Mediterranean'] },
    { id: 'lebanese', name: 'Lebanese', icon: cuisineIcons['Lebanese'] },
    { id: 'turkish', name: 'Turkish', icon: cuisineIcons['Turkish'] },
  ];

  const handleClick = (cuisine: string) => {
    onSelectCuisine(cuisine || null);
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">Top Categories</h2>
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-3 overflow-x-auto pb-2">
        {categories.map((category) => (
          <CuisineCategory
            key={category.id}
            id={category.id}
            name={category.name}
            icon={category.icon}
            isActive={
              selectedCuisine === category.name || 
              (category.name === 'All' && !selectedCuisine)
            }
            onClick={handleClick}
          />
        ))}
      </div>
    </div>
  );
};

export default CuisineCategories;
