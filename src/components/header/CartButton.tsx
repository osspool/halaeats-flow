
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CartDropdown from '@/components/cart/CartDropdown';
import { mockCartItems } from '@/pages/CartPage';

interface CartButtonProps {
  className?: string;
}

const CartButton: React.FC<CartButtonProps> = ({ className }) => {
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  
  const closeCart = () => setIsCartOpen(false);

  return (
    <Popover open={isCartOpen} onOpenChange={setIsCartOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className={`relative ${className || ''}`}>
          <ShoppingCart className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
            {mockCartItems.length}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 border-none shadow-none bg-transparent w-auto" align="end">
        <CartDropdown items={mockCartItems} onClose={closeCart} />
      </PopoverContent>
    </Popover>
  );
};

export default CartButton;
