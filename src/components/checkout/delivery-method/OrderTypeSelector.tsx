
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Truck, Home } from 'lucide-react';
import { OrderType } from '@/types';

interface OrderTypeSelectorProps {
  selectedType: OrderType;
  onOrderTypeChange: (type: OrderType) => void;
}

const OrderTypeSelector = ({ selectedType, onOrderTypeChange }: OrderTypeSelectorProps) => {
  const handleSelect = (value: string) => {
    const type = value as OrderType;
    onOrderTypeChange(type);
  };

  return (
    <Tabs 
      value={selectedType} 
      className="w-full"
      onValueChange={handleSelect}
    >
      <TabsList className="grid grid-cols-2 w-full mb-6">
        <TabsTrigger value="delivery" className="flex items-center gap-2">
          <Truck className="h-4 w-4" />
          <span>Delivery</span>
        </TabsTrigger>
        <TabsTrigger value="pickup" className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          <span>Pickup</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="delivery" className="p-4 bg-halaeats-50 rounded-lg space-y-6">
        {/* Content will be injected by parent */}
      </TabsContent>
      
      <TabsContent value="pickup" className="p-4 bg-halaeats-50 rounded-lg space-y-6">
        {/* Content will be injected by parent */}
      </TabsContent>
    </Tabs>
  );
};

export default OrderTypeSelector;
