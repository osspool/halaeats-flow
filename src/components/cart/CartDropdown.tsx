
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, CreditCard, X } from 'lucide-react';
import { CartItem, OrderSummary } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface CartDropdownProps {
  items: CartItem[];
  onClose: () => void;
}

type CatererCart = {
  catererId: string;
  catererName: string;
  items: CartItem[];
  subtotal: number;
};

const CartDropdown = ({ items, onClose }: CartDropdownProps) => {
  const [catererCarts, setCatererCarts] = useState<CatererCart[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Group items by caterer
    const groupedItems: Record<string, CatererCart> = {};
    
    items.forEach(item => {
      const catererId = item.caterer.id;
      
      if (!groupedItems[catererId]) {
        groupedItems[catererId] = {
          catererId,
          catererName: item.caterer.name,
          items: [],
          subtotal: 0
        };
      }
      
      groupedItems[catererId].items.push(item);
      groupedItems[catererId].subtotal += item.subtotal;
    });
    
    setCatererCarts(Object.values(groupedItems));
  }, [items]);
  
  const handleCheckout = (catererId: string) => {
    // In a real app, this would store the selected caterer in state or context
    // For now, we'll just navigate to checkout and handle the filtering there
    localStorage.setItem('selectedCatererId', catererId);
    navigate('/checkout');
    onClose();
  };
  
  return (
    <div className="bg-white rounded-xl shadow-elevation-double border border-halaeats-100 w-[350px] max-h-[80vh] overflow-hidden flex flex-col">
      <div className="p-4 border-b border-halaeats-100 flex justify-between items-center sticky top-0 bg-white z-10">
        <h3 className="text-lg font-medium flex items-center">
          <ShoppingBag className="h-5 w-5 text-primary mr-2" />
          Your Cart
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="overflow-y-auto flex-grow">
        {catererCarts.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 mx-auto bg-halaeats-50 rounded-full flex items-center justify-center mb-3">
              <ShoppingBag className="h-8 w-8 text-halaeats-400" />
            </div>
            <p className="text-halaeats-600 mb-4">Your cart is empty</p>
            <Link to="/" onClick={onClose}>
              <Button variant="outline" size="sm">
                Browse Caterers
              </Button>
            </Link>
          </div>
        ) : (
          <div>
            {catererCarts.map(cart => (
              <div key={cart.catererId} className="p-4 border-b border-halaeats-100">
                <div className="font-medium text-halaeats-800 mb-2">{cart.catererName}</div>
                
                <div className="space-y-2 mb-3">
                  {cart.items.map(item => (
                    <div key={item.id} className="flex justify-between items-start text-sm">
                      <div className="flex-1">
                        <p className="font-medium text-halaeats-700">{item.menuItem.name} × {item.quantity}</p>
                      </div>
                      <span className="text-halaeats-800">${item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-2 mb-3">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold text-primary">${cart.subtotal.toFixed(2)}</span>
                </div>
                
                <Button 
                  className="w-full bg-primary hover:bg-cuisine-600"
                  onClick={() => handleCheckout(cart.catererId)}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Checkout this order
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDropdown;
