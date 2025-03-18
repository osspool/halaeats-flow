
import { useState } from 'react';
import { Trash2, Plus, Minus, Calendar, Clock } from 'lucide-react';
import { parseISO, format } from 'date-fns';
import { CartItem as CartItemType } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  const incrementQuantity = () => onUpdateQuantity(item.id, item.quantity + 1);
  const decrementQuantity = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };
  
  // Format the selected date
  const formattedDate = format(parseISO(item.selectedDate), 'EEE, MMM d');
  
  return (
    <div className="flex flex-col sm:flex-row border border-halaeats-100 rounded-lg overflow-hidden mb-4 bg-white transition-all hover:border-halaeats-200 hover:shadow-elevation-soft">
      {/* Image */}
      <div className="sm:w-32 h-24 sm:h-auto relative flex-shrink-0">
        <div 
          className={cn(
            "absolute inset-0 bg-halaeats-100 image-loading",
            isImageLoaded ? "opacity-0" : "opacity-100"
          )}
        />
        <img 
          src={item.menuItem.image} 
          alt={item.menuItem.name} 
          className={cn(
            "w-full h-full object-cover",
            isImageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setIsImageLoaded(true)}
        />
      </div>
      
      {/* Content */}
      <div className="flex-grow p-4">
        <div className="flex flex-col sm:flex-row justify-between">
          <div>
            <h3 className="font-medium text-halaeats-900">{item.menuItem.name}</h3>
            <p className="text-sm text-halaeats-600 mt-1">From {item.caterer.name}</p>
            
            {/* Customizations */}
            {item.customizations.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-halaeats-500">Customizations:</p>
                <ul className="text-xs text-halaeats-600 mt-1 space-y-1">
                  {item.customizations.map(customization => {
                    const customizationDef = item.menuItem.customizations?.find(
                      c => c.id === customization.customizationId
                    );
                    
                    if (!customizationDef) return null;
                    
                    const optionNames = customization.optionIds.map(optionId => {
                      const option = customizationDef.options.find(o => o.id === optionId);
                      return option ? option.name : '';
                    }).filter(Boolean);
                    
                    if (optionNames.length === 0) return null;
                    
                    return (
                      <li key={customization.customizationId}>
                        <span className="font-medium">{customizationDef.name}:</span> {optionNames.join(', ')}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
          
          <div className="mt-3 sm:mt-0">
            <span className="font-medium text-primary">${item.subtotal.toFixed(2)}</span>
          </div>
        </div>
        
        {/* Delivery Info */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs text-halaeats-600">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 text-primary mr-1" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 text-primary mr-1" />
            <span>{item.selectedTimeSlot.startTime} - {item.selectedTimeSlot.endTime}</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-halaeats-100">
          {/* Quantity Controls */}
          <div className="flex items-center">
            <button 
              onClick={decrementQuantity}
              className="p-1 rounded-md border border-halaeats-200 text-halaeats-500 hover:bg-halaeats-50"
              aria-label="Decrease quantity"
              disabled={item.quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="px-3 text-sm mx-2">{item.quantity}</div>
            <button 
              onClick={incrementQuantity}
              className="p-1 rounded-md border border-halaeats-200 text-halaeats-500 hover:bg-halaeats-50"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          {/* Remove Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onRemove(item.id)}
            className="text-halaeats-500 hover:text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
