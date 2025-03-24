
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Truck, Home } from 'lucide-react';
import { OrderType } from '@/types';

interface DeliveryMethodStepProps {
  orderType: OrderType;
  onOrderTypeChange: (type: OrderType) => void;
  onNext: () => void;
}

const DeliveryMethodStep = ({ 
  orderType, 
  onOrderTypeChange, 
  onNext 
}: DeliveryMethodStepProps) => {
  const [selectedType, setSelectedType] = useState<OrderType>(orderType);

  const handleSelect = (value: string) => {
    const type = value as OrderType;
    setSelectedType(type);
    onOrderTypeChange(type);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium mb-4">Delivery Method</h2>
        <p className="text-halaeats-600 mb-6">
          Choose how you want to receive your order
        </p>

        <Tabs 
          defaultValue={orderType} 
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
          
          <TabsContent value="delivery" className="p-4 bg-halaeats-50 rounded-lg">
            <h3 className="font-medium mb-2">Delivery Service</h3>
            <p className="text-sm text-halaeats-600">
              Get your food delivered straight to your door. Please ensure someone is available to receive the order.
            </p>
            <p className="text-xs text-halaeats-500 mt-2">
              Delivery fee applies based on distance and order size.
            </p>
          </TabsContent>
          
          <TabsContent value="pickup" className="p-4 bg-halaeats-50 rounded-lg">
            <h3 className="font-medium mb-2">Pickup Service</h3>
            <p className="text-sm text-halaeats-600">
              Pick up your order directly from the restaurant. No delivery fee and typically faster.
            </p>
            <p className="text-xs text-halaeats-500 mt-2">
              You'll receive a notification when your order is ready for pickup.
            </p>
          </TabsContent>
        </Tabs>
      </div>
      
      <Button 
        onClick={onNext}
        className="w-full bg-primary hover:bg-cuisine-600"
      >
        Continue
      </Button>
    </div>
  );
};

export default DeliveryMethodStep;
