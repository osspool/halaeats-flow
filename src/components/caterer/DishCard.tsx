
import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { PlusCircle, Info, Calendar } from 'lucide-react';
import { MenuItem } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface DishCardProps {
  dish: MenuItem;
  selectedDate: string;
  onViewDetails: (dish: MenuItem) => void;
  onAddToCart?: (dish: MenuItem) => void; // Make this prop optional
}

const DishCard = ({ dish, selectedDate, onViewDetails, onAddToCart }: DishCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [availabilityDates, setAvailabilityDates] = useState<string[]>([]);
  
  useEffect(() => {
    // Format the availability dates for display
    const formattedDates = dish.availableDates.map(date => 
      format(parseISO(date), 'EEE, MMM d')
    );
    setAvailabilityDates(formattedDates);
  }, [dish]);
  
  const handleViewDetail = () => {
    onViewDetails(dish);
  };
  
  const handleAddToCart = () => {
    // If onAddToCart is provided, use it, otherwise fall back to onViewDetails
    if (onAddToCart) {
      onAddToCart(dish);
    } else {
      onViewDetails(dish);
    }
  };
  
  return (
    <div 
      className={cn(
        "flex flex-col rounded-xl overflow-hidden border transition-all group",
        "border-halaeats-200 hover:border-primary/50 hover:shadow-elevation-soft"
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
            "group-hover:scale-105",
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
            )}
          </div>
        </div>
        
        <p className="mt-2 text-sm text-halaeats-600 line-clamp-2 flex-grow">
          {dish.description}
        </p>
        
        {/* Availability Dates */}
        <div className="mt-3 flex items-center text-xs text-halaeats-500">
          <Calendar className="h-3 w-3 mr-1" />
          <span>Available on: </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="ml-1 text-primary hover:underline">
                {availabilityDates.length > 1 
                  ? `${availabilityDates.length} dates` 
                  : availabilityDates[0] || 'No dates'}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="max-h-28 overflow-y-auto">
                <p className="text-xs font-medium mb-1">Available on:</p>
                <ul className="text-xs space-y-1">
                  {availabilityDates.map((date, index) => (
                    <li key={index}>{date}</li>
                  ))}
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <div className="mt-4 pt-4 border-t border-halaeats-100 flex justify-between items-center">
          <button 
            onClick={handleViewDetail}
            className="text-primary hover:text-cuisine-600 text-sm font-medium"
          >
            View Details
          </button>
          
          <Button 
            onClick={handleAddToCart} 
            variant="outline"
            size="sm"
            className="border-primary text-primary hover:bg-primary hover:text-white text-sm"
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
