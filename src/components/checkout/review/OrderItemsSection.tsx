
import { CartItem } from '@/types';
import { ShoppingBag } from 'lucide-react';

interface OrderItemsSectionProps {
  items: CartItem[];
}

const OrderItemsSection = ({ items }: OrderItemsSectionProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-medium flex items-center mb-3">
        <ShoppingBag className="h-4 w-4 mr-2 text-primary" />
        Order Items
      </h3>
      
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="flex justify-between items-start text-sm">
            <div>
              <p className="font-medium">{item.menuItem.name} × {item.quantity}</p>
              <p className="text-xs text-gray-500">{item.caterer.name}</p>
            </div>
            <span>${item.subtotal.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItemsSection;
