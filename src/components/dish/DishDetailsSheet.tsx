import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Info,
  Check,
  ShoppingCart,
  Plus, 
  Minus,
  X
} from 'lucide-react';
import { parseISO, format } from 'date-fns';
import { toast } from 'sonner';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetClose
} from '@/components/ui/sheet';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose
} from "@/components/ui/drawer";
import { MenuItem, TimeSlot, MenuItemCustomization, CustomizationOption as CustomizationOptionType } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface DishDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  dish: MenuItem | null;
  catererName: string;
  catererId: string;
  availableDates: { date: string; timeSlots: TimeSlot[] }[];
  onAddToCart: (quantity: number, selectedDate: string, selectedTimeSlot: TimeSlot, customizations: any[]) => void;
}

export const DishDetailsSheet = ({
  isOpen,
  onClose,
  dish,
  catererName,
  catererId,
  availableDates,
  onAddToCart
}: DishDetailsSheetProps) => {
  const isMobile = useIsMobile();
  const [quantity, setQuantity] = useState(1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [selectedCustomizations, setSelectedCustomizations] = useState<Record<string, string[]>>({});
  const [availabilityDays, setAvailabilityDays] = useState<string[]>([]);

  useEffect(() => {
    if (dish) {
      setQuantity(1);
      setIsImageLoaded(false);
      
      if (dish.customizations) {
        const initialCustomizations: Record<string, string[]> = {};
        
        dish.customizations.forEach(customization => {
          if (customization.required && !customization.multiple && customization.options.length > 0) {
            initialCustomizations[customization.id] = [customization.options[0].id];
          } else {
            initialCustomizations[customization.id] = [];
          }
        });
        
        setSelectedCustomizations(initialCustomizations);
      }

      if (dish.availableDates && dish.availableDates.length > 0) {
        const days = dish.availableDates.map(date => 
          format(parseISO(date), 'EEEE')
        );
        setAvailabilityDays([...new Set(days)]);
      }
    }
  }, [dish]);

  if (!dish) return null;

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleOptionSelect = (customizationId: string, optionId: string, multiple: boolean) => {
    setSelectedCustomizations(prev => {
      const updatedCustomizations = { ...prev };
      
      if (multiple) {
        if (updatedCustomizations[customizationId].includes(optionId)) {
          updatedCustomizations[customizationId] = updatedCustomizations[customizationId].filter(
            id => id !== optionId
          );
        } else {
          updatedCustomizations[customizationId] = [...updatedCustomizations[customizationId], optionId];
        }
      } else {
        updatedCustomizations[customizationId] = [optionId];
      }
      
      return updatedCustomizations;
    });
  };

  const calculateTotalPrice = () => {
    let total = dish.price * quantity;
    
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
    toast.success('Item added to cart!', {
      description: `${dish.name} has been added to your cart. You'll select delivery details during checkout.`,
      action: {
        label: 'View Cart',
        onClick: () => console.log('Navigate to cart')
      }
    });
    
    if (availableDates.length > 0 && availableDates[0].timeSlots.length > 0) {
      const defaultDate = availableDates[0].date;
      const defaultTimeSlot = availableDates[0].timeSlots.find(slot => slot.available) || availableDates[0].timeSlots[0];
      
      onAddToCart(quantity, defaultDate, defaultTimeSlot, formattedCustomizations);
      onClose();
    }
  };

  const hasRequiredCustomizations = () => {
    if (!dish.customizations) return true;
    
    return dish.customizations.every(customization => {
      if (customization.required) {
        return (selectedCustomizations[customization.id]?.length ?? 0) > 0;
      }
      return true;
    });
  };

  const renderContent = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="absolute right-4 top-4 z-50">
        {isMobile ? (
          <DrawerClose className="h-7 w-7 rounded-full bg-white/90 p-1.5 text-halaeats-600 shadow-sm backdrop-blur border border-halaeats-100 hover:bg-white">
            <X className="h-full w-full" />
            <span className="sr-only">Close</span>
          </DrawerClose>
        ) : (
          <SheetClose className="h-7 w-7 rounded-full bg-white/90 p-1.5 text-halaeats-600 shadow-sm backdrop-blur border border-halaeats-100 hover:bg-white">
            <X className="h-full w-full" />
            <span className="sr-only">Close</span>
          </SheetClose>
        )}
      </div>

      <div className="relative aspect-video overflow-hidden">
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
        
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-1">
          {dish.dietary.map(diet => (
            <span 
              key={diet}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-black/60 text-white backdrop-blur-sm"
            >
              {diet}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 pt-5 pb-24">
        <div className="mb-6">
          <span className="text-sm text-primary font-medium">
            {dish.category}
          </span>
          <h2 className="text-xl font-serif font-bold mt-1">{dish.name}</h2>
          <div className="flex justify-between items-center mt-2">
            <span className="text-lg text-primary font-semibold">${dish.price.toFixed(2)}</span>
            <span className="text-sm text-halaeats-500">From {catererName}</span>
          </div>
          <p className="text-sm text-halaeats-600 mt-3 leading-relaxed">
            {dish.description}
          </p>
        </div>
        
        <div className="mb-6 pt-4 pb-4 border-t border-b border-halaeats-100">
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-halaeats-700">Serving Days</h4>
              <p className="text-sm text-halaeats-500 mt-1 flex flex-wrap gap-1">
                Available on: 
                {availabilityDays.map((day, index) => (
                  <span key={day} className="text-primary font-medium">
                    {day}{index < availabilityDays.length - 1 ? ',' : ''}
                  </span>
                ))}
              </p>
              <p className="text-xs text-halaeats-500 mt-2 flex items-center">
                <Info className="h-3.5 w-3.5 inline mr-1 text-halaeats-400" />
                You'll select delivery date and time during checkout
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-halaeats-700 mb-2">
            Quantity
          </label>
          <div className="flex items-center">
            <button 
              onClick={decrementQuantity}
              className="p-2 rounded-l-md border border-r-0 border-halaeats-200 text-halaeats-500 hover:bg-halaeats-50 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="px-4 py-2 border-t border-b border-halaeats-200 text-center min-w-[3rem]">
              {quantity}
            </div>
            <button 
              onClick={incrementQuantity}
              className="p-2 rounded-r-md border border-l-0 border-halaeats-200 text-halaeats-500 hover:bg-halaeats-50 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {dish.customizations && dish.customizations.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-halaeats-700 mb-3">Customizations</h4>
            
            {dish.customizations.map(customization => (
              <div key={customization.id} className="mb-5">
                <div className="flex items-center mb-2">
                  <p className="text-halaeats-800 font-medium">{customization.name}</p>
                  {customization.required && (
                    <span className="ml-2 text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full border border-red-100">
                      Required
                    </span>
                  )}
                  {customization.multiple && (
                    <span className="ml-2 text-xs bg-halaeats-50 text-halaeats-700 px-1.5 py-0.5 rounded-full border border-halaeats-100">
                      Multiple
                    </span>
                  )}
                </div>
                
                <div className="space-y-2">
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
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-halaeats-100 px-6 py-4 z-10 backdrop-blur-lg bg-white/90">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-sm text-halaeats-600">Total Price</span>
            <span className="text-lg font-bold text-primary">
              ${calculateTotalPrice().toFixed(2)}
            </span>
          </div>
          
          <Button 
            onClick={handleAddToCart}
            disabled={!hasRequiredCustomizations()}
            className="bg-primary hover:bg-cuisine-600 px-6 transition-gpu h-12"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
        </div>
        
        {!hasRequiredCustomizations() && (
          <p className="mt-1 text-sm text-red-500 text-center">
            Please select all required customization options
          </p>
        )}
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <Drawer open={isOpen} onOpenChange={onClose}>
          <DrawerContent className="max-h-[90vh] rounded-t-xl">
            <DrawerHeader className="mb-0 pb-0 sr-only">
              <DrawerTitle>{dish.name}</DrawerTitle>
            </DrawerHeader>
            {renderContent()}
          </DrawerContent>
        </Drawer>
      ) : (
        <Sheet open={isOpen} onOpenChange={onClose}>
          <SheetContent className="w-[450px] sm:max-w-xl p-0 overflow-hidden">
            <SheetHeader className="mb-0 pb-0 sr-only">
              <SheetTitle>{dish.name}</SheetTitle>
            </SheetHeader>
            {renderContent()}
          </SheetContent>
        </Sheet>
      )}
    </>
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
      "flex items-center justify-between py-2.5 px-3.5 rounded-md border transition-colors cursor-pointer",
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

export default DishDetailsSheet;
