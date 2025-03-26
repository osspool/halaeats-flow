
import { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderType } from '@/types';
import { Truck, Store } from 'lucide-react';

interface OrderTypeSelectorProps {
  selectedType: OrderType;
  onOrderTypeChange: (type: OrderType) => void;
  deliveryContent: ReactNode;
  pickupContent: ReactNode;
}

const OrderTypeSelector = ({
  selectedType,
  onOrderTypeChange,
  deliveryContent,
  pickupContent
}: OrderTypeSelectorProps) => {
  const handleValueChange = (value: string) => {
    console.log("OrderType changed to:", value);
    onOrderTypeChange(value as OrderType);
  };

  return (
    <Tabs
      value={selectedType}
      onValueChange={handleValueChange}
      className="w-full"
      defaultValue={selectedType} // Added default value to initialize properly
    >
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="delivery" className="flex items-center gap-2">
          <Truck className="h-4 w-4" />
          <span>Delivery</span>
        </TabsTrigger>
        <TabsTrigger value="pickup" className="flex items-center gap-2">
          <Store className="h-4 w-4" />
          <span>Pickup</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="delivery" className="focus-visible:outline-none focus-visible:ring-0">
        {deliveryContent}
      </TabsContent>
      
      <TabsContent value="pickup" className="focus-visible:outline-none focus-visible:ring-0">
        {pickupContent}
      </TabsContent>
    </Tabs>
  );
};

export default OrderTypeSelector;
