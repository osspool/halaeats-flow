import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Plus, 
  Minus, 
  ShoppingCart,
  Calendar, 
  Clock, 
  Home,
  Check,
  Info,
  AlertCircle
} from 'lucide-react';
import { parseISO, format } from 'date-fns';
import { toast } from 'sonner';
import type { MenuItem, CustomizationOption as CustomizationOptionType, MenuItemCustomization, TimeSlot } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface DishDetailProps {
  dish: MenuItem;
  catererName: string;
  catererId: string;
  availableDates: { date: string; timeSlots: TimeSlot[] }[];
  onAddToCart: (quantity: number, selectedDate: string, selectedTimeSlot: TimeSlot, customizations: any[]) => void;
}

const DishDetail = ({ 
  dish, 
  catererName, 
  catererId,
  availableDates,
  onAddToCart 
}: DishDetailProps) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [selectedCustomizations, setSelectedCustomizations] = useState<Record<string, string[]>>({});
  const [availabilityDays, setAvailabilityDays] = useState<string[]>([]);

  // Initialize selected customizations
  useEffect(() => {
    if (dish.customizations) {
      const initialCustomizations: Record<string, string[]> = {};
      
      dish.customizations.forEach(customization => {
        // For required single-select options, preselect the first option
        if (customization.required && !customization.multiple && customization.options.length > 0) {
          initialCustomizations[customization.id] = [customization.options[0].id];
        } else {
          initialCustomizations[customization.id] = [];
        }
      });
      
      setSelectedCustomizations(initialCustomizations);
    }

    // Extract days of week from available dates
    if (dish.availableDates && dish.availableDates.length > 0) {
      const days = dish.availableDates.map(date => 
        format(parseISO(date), 'EEEE') // e.g., "Monday", "Tuesday", etc.
      );
      // Remove duplicates
      setAvailabilityDays([...new Set(days)]);
    }
  }, [dish]);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleOptionSelect = (customizationId: string, optionId: string, multiple: boolean) => {
    setSelectedCustomizations(prev => {
      const updatedCustomizations = { ...prev };
      
      if (multiple) {
        // For multi-select, toggle the selection
        if (updatedCustomizations[customizationId].includes(optionId)) {
          updatedCustomizations[customizationId] = updatedCustomizations[customizationId].filter(
            id => id !== optionId
          );
        } else {
          updatedCustomizations[customizationId] = [...updatedCustomizations[customizationId], optionId];
        }
      } else {
        // For single-select, replace the selection
        updatedCustomizations[customizationId] = [optionId];
      }
      
      return updatedCustomizations;
    });
  };

  const calculateTotalPrice = () => {
    let total = dish.price * quantity;
    
    // Add price of selected customizations
    if (dish.customizations) {
      dish.customizations.forEach(customization => {
        const selectedOptions = selectedCustomizations[customization.id] || [];
        selectedOptions.forEach(optionId => {
          const option = customization.options.find(opt => opt.id === optionId);
          if (option) {
            total += option.price * quantity;
          }
        });
      });
    }
    
    return total;
  };

  const formattedCustomizations = Object.entries(selectedCustomizations).map(([customizationId, optionIds]) => {
    return {
      customizationId,
      optionIds
    };
  });

  const handleAddToCart = () => {
    // Show a message that this dish will be added to cart and delivery details will be selected during checkout
    toast.success('Item added to cart!', {
      description: `${dish.name} has been added to your cart. You'll select delivery details during checkout.`,
      action: {
        label: 'View Cart',
        onClick: () => navigate('/cart')
      }
    });
    
    // Pick the first available date and time slot for now
    if (availableDates.length > 0 && availableDates[0].timeSlots.length > 0) {
      const defaultDate = availableDates[0].date;
      const defaultTimeSlot = availableDates[0].timeSlots.find(slot => slot.available) || availableDates[0].timeSlots[0];
      
      onAddToCart(quantity, defaultDate, defaultTimeSlot, formattedCustomizations);
    }
  };

  // Check if all required customizations are selected
  const hasRequiredCustomizations = () => {
    if (!dish.customizations) return true;
    
    return dish.customizations.every(customization => {
      if (customization.required) {
        return (selectedCustomizations[customization.id]?.length ?? 0) > 0;
      }
      return true;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          to={`/caterer/${catererId}`} 
          className="inline-flex items-center text-halaeats-600 hover:text-primary transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to {catererName}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image */}
        <div className="rounded-xl overflow-hidden bg-white shadow-elevation-soft">
          <div className="relative aspect-[4/3]">
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
                "w-full h-full object-cover",
                isImageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setIsImageLoaded(true)}
            />
          </div>
          
          <div className="p-5 border-t border-halaeats-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Home className="h-4 w-4 text-primary mr-2" />
                <span className="text-halaeats-700 text-sm font-medium">From {catererName}</span>
              </div>
              
              <div className="flex flex-wrap gap-1 justify-end">
                {dish.dietary.map(diet => (
                  <span 
                    key={diet}
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-halaeats-100 text-halaeats-700"
                  >
                    {diet}
                  </span>
                ))}
              </div>
            </div>
            
            <h2 className="text-2xl font-serif font-bold mb-2">{dish.name}</h2>
            <p className="text-halaeats-600">{dish.description}</p>
          </div>
        </div>

        {/* Right Column - Details and Order Form */}
        <div className="bg-white rounded-xl shadow-elevation-soft p-6">
          <h3 className="text-lg font-medium mb-4">Order Details</h3>
          
          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-halaeats-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center">
              <button 
                onClick={decrementQuantity}
                className="p-2 rounded-l-md border border-r-0 border-halaeats-200 text-halaeats-500 hover:bg-halaeats-50"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="px-4 py-2 border-t border-b border-halaeats-200 text-center min-w-[3rem]">
                {quantity}
              </div>
              <button 
                onClick={incrementQuantity}
                className="p-2 rounded-r-md border border-l-0 border-halaeats-200 text-halaeats-500 hover:bg-halaeats-50"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Availability Information */}
          <div className="mb-6">
            <div className="flex items-start mb-3">
              <Calendar className="h-5 w-5 text-primary mr-2 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-halaeats-700">Serving Days</h4>
                <p className="text-sm text-halaeats-500 mt-1">
                  This dish is available on: {availabilityDays.join(', ')}
                </p>
                <p className="text-sm text-halaeats-500 mt-1">
                  <Info className="h-4 w-4 inline mr-1" />
                  You'll select delivery date and time during checkout
                </p>
              </div>
            </div>
          </div>
          
          {/* Customizations */}
          {dish.customizations && dish.customizations.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-halaeats-700 mb-3">Customizations</h4>
              
              {dish.customizations.map(customization => (
                <div key={customization.id} className="mb-5">
                  <div className="flex items-center mb-2">
                    <p className="text-halaeats-800 font-medium">{customization.name}</p>
                    {customization.required && (
                      <span className="ml-2 text-xs bg-halaeats-100 text-halaeats-800 px-1.5 py-0.5 rounded">
                        Required
                      </span>
                    )}
                    {customization.multiple && (
                      <span className="ml-2 text-xs bg-halaeats-100 text-halaeats-800 px-1.5 py-0.5 rounded">
                        Select Multiple
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2 ml-1">
                    {customization.options.map(option => (
                      <CustomizationOption
                        key={option.id}
                        option={option}
                        customization={customization}
                        isSelected={(selectedCustomizations[customization.id] || []).includes(option.id)}
                        onSelect={() => handleOptionSelect(customization.id, option.id, customization.multiple)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Total and Add to Cart */}
          <div className="mt-8 pt-4 border-t border-halaeats-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-halaeats-700">Price:</span>
              <span className="font-medium">${dish.price.toFixed(2)} x {quantity}</span>
            </div>
            
            {Object.entries(selectedCustomizations).map(([customizationId, optionIds]) => {
              if (optionIds.length === 0) return null;
              
              const customization = dish.customizations?.find(c => c.id === customizationId);
              if (!customization) return null;
              
              return optionIds.map(optionId => {
                const option = customization.options.find(o => o.id === optionId);
                if (!option || option.price === 0) return null;
                
                return (
                  <div key={`${customizationId}-${optionId}`} className="flex items-center justify-between mb-4">
                    <span className="text-halaeats-700">{option.name}:</span>
                    <span className="font-medium">${option.price.toFixed(2)} x {quantity}</span>
                  </div>
                );
              });
            })}
            
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-medium">Total:</span>
              <span className="text-lg font-bold text-primary">${calculateTotalPrice().toFixed(2)}</span>
            </div>
            
            <Button 
              onClick={handleAddToCart}
              disabled={!hasRequiredCustomizations()}
              className="w-full bg-primary hover:bg-cuisine-600 transition-gpu h-12 text-base"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            
            {!hasRequiredCustomizations() && (
              <p className="mt-2 text-sm text-red-500 text-center">
                Please select all required customization options
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface CustomizationOptionProps {
  option: CustomizationOptionType;
  customization: MenuItemCustomization;
  isSelected: boolean;
  onSelect: () => void;
}

const CustomizationOption = ({ option, customization, isSelected, onSelect }: CustomizationOptionProps) => (
  <div 
    className={cn(
      "flex items-center justify-between py-2 px-3 rounded-md border transition-colors cursor-pointer",
      isSelected 
        ? "bg-primary/5 border-primary" 
        : "bg-white border-halaeats-200 hover:border-primary/50"
    )}
    onClick={onSelect}
  >
    <div className="flex items-center">
      <div 
        className={cn(
          "w-5 h-5 rounded-full border flex items-center justify-center mr-3",
          isSelected 
            ? "border-primary bg-primary text-white" 
            : "border-halaeats-300"
        )}
      >
        {isSelected && <Check className="h-3 w-3" />}
      </div>
      <span className="font-medium text-halaeats-800">{option.name}</span>
    </div>
    
    {option.price > 0 && (
      <span className="text-primary font-medium">+${option.price.toFixed(2)}</span>
    )}
  </div>
);

export default DishDetail;
