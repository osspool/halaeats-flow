
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Info } from 'lucide-react';
import { MenuItem } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface DishCardProps {
  dish: MenuItem;
  selectedDate: string;
  onAddToCart: () => void;
}

const DishCard = ({ dish, selectedDate, onAddToCart }: DishCardProps) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  useEffect(() => {
    // Check if dish is available on the selected date
    setIsAvailable(dish.availableDates.includes(selectedDate));
  }, [dish, selectedDate]);
  
  return (
    <div 
      className={cn(
        "flex flex-col rounded-xl overflow-hidden border transition-all group",
        isAvailable 
          ? "border-halaeats-200 hover:border-primary/50 hover:shadow-elevation-soft" 
          : "border-halaeats-100 opacity-70"
      )}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <div 
          className={cn(
            "absolute inset-0 bg-halaeats-100 image-loading",
            isImageLoaded ? "opacity-0" : "opacity-100"
          )}
        />
        <img 
          src={dish.image} 
          alt={dish.name} 
          className={cn(
            "w-full h-full object-cover transition-transform duration-500",
            isAvailable && "group-hover:scale-105",
            isImageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setIsImageLoaded(true)}
        />
        
        {/* Category and Dietary Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white/90 backdrop-blur-sm text-halaeats-800">
            {dish.category}
          </span>
        </div>
        
        <div className="absolute top-3 right-3 flex flex-wrap gap-1 max-w-[120px] justify-end">
          {dish.dietary.map(diet => (
            <span 
              key={diet}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-halaeats-700/70 backdrop-blur-sm text-white"
            >
              {diet}
            </span>
          ))}
        </div>
        
        {/* Availability Label */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-halaeats-800/90 text-white px-3 py-1 rounded-md text-sm font-medium">
              Not Available on Selected Date
            </span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-medium text-halaeats-900 group-hover:text-primary transition-colors">
            {dish.name}
          </h3>
          <div className="flex items-center">
            <span className="font-medium text-primary">${dish.price.toFixed(2)}</span>
            {dish.customizations && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="ml-1.5 text-halaeats-400 hover:text-halaeats-700">
                      <Info className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Customization options available</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        
        <p className="mt-2 text-sm text-halaeats-600 line-clamp-2 flex-grow">
          {dish.description}
        </p>
        
        <div className="mt-4 pt-4 border-t border-halaeats-100 flex justify-between items-center">
          <Link 
            to={`/dish/${dish.id}`} 
            className="text-primary hover:text-cuisine-600 text-sm font-medium"
          >
            View Details
          </Link>
          
          <Button 
            onClick={onAddToCart} 
            variant="outline"
            size="sm"
            className={cn(
              "text-sm",
              isAvailable 
                ? "border-primary text-primary hover:bg-primary hover:text-white" 
                : "border-halaeats-300 text-halaeats-400 cursor-not-allowed"
            )}
            disabled={!isAvailable}
          >
            <PlusCircle className="mr-1 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DishCard;
