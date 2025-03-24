
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, CreditCard, InfoIcon } from 'lucide-react';
import { CartItem, OrderSummary, OrderType } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface CartSidebarProps {
  items: CartItem[];
  orderSummary: OrderSummary;
  orderType: OrderType;
  onOrderTypeChange: (type: OrderType) => void;
}

const CartSidebar = ({ 
  items, 
  orderSummary, 
  orderType,
  onOrderTypeChange
}: CartSidebarProps) => {
  const [isEmpty, setIsEmpty] = useState(true);
  
  useEffect(() => {
    setIsEmpty(items.length === 0);
  }, [items]);
  
  return (
    <div className="bg-white rounded-xl shadow-elevation-soft overflow-hidden">
      <div className="p-6 border-b border-halaeats-100">
        <h3 className="text-lg font-medium flex items-center">
          <ShoppingBag className="h-5 w-5 text-primary mr-2" />
          Order Summary
        </h3>
        
        {isEmpty ? (
          <div className="mt-4 text-center py-6">
            <div className="w-16 h-16 mx-auto bg-halaeats-50 rounded-full flex items-center justify-center mb-3">
              <ShoppingBag className="h-8 w-8 text-halaeats-400" />
            </div>
            <p className="text-halaeats-600 mb-4">Your cart is empty</p>
            <Link to="/">
              <Button variant="outline" size="sm">
                Browse Caterers
              </Button>
            </Link>
          </div>
        ) : (
          <div className="mt-4">
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-start text-sm">
                  <div className="flex-1">
                    <p className="font-medium text-halaeats-800">{item.menuItem.name} × {item.quantity}</p>
                    <p className="text-xs text-halaeats-500">{item.caterer.name}</p>
                  </div>
                  <span className="text-halaeats-800">${item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-halaeats-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-halaeats-600">Subtotal</span>
                <span className="font-medium">${orderSummary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-halaeats-600">Delivery Fee</span>
                <span className="font-medium">${orderSummary.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <span className="text-sm text-halaeats-600">Tax</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="ml-1 text-halaeats-400">
                          <InfoIcon className="h-3 w-3" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Includes sales tax and fees</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="font-medium">${orderSummary.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-t border-halaeats-100">
                <span className="font-medium">Total</span>
                <span className="text-lg font-bold text-primary">${orderSummary.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {!isEmpty && (
        <div className="p-6">
          <Link to="/checkout">
            <Button className="w-full bg-primary hover:bg-cuisine-600 h-12">
              <CreditCard className="mr-2 h-5 w-5" />
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;
