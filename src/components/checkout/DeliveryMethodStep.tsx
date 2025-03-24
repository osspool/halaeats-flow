
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Truck, Home, Plus } from 'lucide-react';
import { OrderType } from '@/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Address } from '@/types/checkout';
import { cn } from '@/lib/utils';
import { mockAddresses } from '@/data/checkoutMockData';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DeliveryMethodStepProps {
  orderType: OrderType;
  onOrderTypeChange: (type: OrderType) => void;
  selectedAddressId?: string;
  onAddressSelect: (addressId: string) => void;
  onDeliveryInstructionsChange: (instructions: string) => void;
  onPickupTimeChange: (time: string) => void;
  onNext: () => void;
}

const DeliveryMethodStep = ({ 
  orderType, 
  onOrderTypeChange, 
  selectedAddressId,
  onAddressSelect,
  onDeliveryInstructionsChange,
  onPickupTimeChange,
  onNext 
}: DeliveryMethodStepProps) => {
  const [selectedType, setSelectedType] = useState<OrderType>(orderType);
  const [addresses] = useState<Address[]>(mockAddresses);
  const [selected, setSelected] = useState<string>(selectedAddressId || addresses.find(a => a.isDefault)?.id || '');
  const [instructions, setInstructions] = useState<string>('');
  const [pickupTime, setPickupTime] = useState<string>('');

  const timeSlots = [
    "ASAP (15-30 min)",
    "Today, 11:30 AM",
    "Today, 12:00 PM",
    "Today, 12:30 PM",
    "Today, 1:00 PM",
    "Today, 1:30 PM",
  ];

  const handleSelect = (value: string) => {
    const type = value as OrderType;
    setSelectedType(type);
    onOrderTypeChange(type);
  };

  const handleAddressChange = (value: string) => {
    setSelected(value);
    onAddressSelect(value);
  };

  const handleInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInstructions(e.target.value);
    onDeliveryInstructionsChange(e.target.value);
  };

  const handlePickupTimeChange = (value: string) => {
    setPickupTime(value);
    onPickupTimeChange(value);
  };

  const handleContinue = () => {
    if (selectedType === 'delivery' && !selected) return;
    
    // Set default pickup time if not selected for pickup
    if (selectedType === 'pickup' && !pickupTime) {
      handlePickupTimeChange(timeSlots[0]);
    }
    
    // Debugging
    console.log('Continue button clicked, navigating to next step');
    
    // Call the onNext function to proceed to the next step
    onNext();
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
          
          <TabsContent value="delivery" className="p-4 bg-halaeats-50 rounded-lg space-y-6">
            <div>
              <h3 className="font-medium mb-2">Delivery Address</h3>
              <p className="text-sm text-halaeats-600 mb-4">
                Select where you'd like your order delivered
              </p>

              <RadioGroup
                value={selected}
                onValueChange={handleAddressChange}
                className="space-y-3"
              >
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={cn(
                      "flex items-start space-x-3 border rounded-lg p-4 transition-colors",
                      selected === address.id
                        ? "border-primary bg-primary/5"
                        : "border-halaeats-200"
                    )}
                  >
                    <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                    <div className="flex-1">
                      <Label
                        htmlFor={address.id}
                        className="font-medium flex items-center cursor-pointer"
                      >
                        {address.name}
                        {address.isDefault && (
                          <span className="ml-2 bg-halaeats-100 text-halaeats-700 text-xs px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </Label>
                      <p className="text-sm text-halaeats-600 mt-1">
                        {address.street}{address.apt ? `, ${address.apt}` : ''}
                      </p>
                      <p className="text-sm text-halaeats-600">
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="flex items-center w-full py-6 border-dashed"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Address
                </Button>
              </RadioGroup>
            </div>

            <div>
              <h3 className="font-medium mb-2">Delivery Instructions (Optional)</h3>
              <Textarea
                placeholder="Add any special instructions for delivery..."
                value={instructions}
                onChange={handleInstructionsChange}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="pickup" className="p-4 bg-halaeats-50 rounded-lg space-y-6">
            <div>
              <h3 className="font-medium mb-2">Pickup Location</h3>
              <div className="bg-white p-4 rounded-lg border border-halaeats-100">
                <h4 className="font-medium text-halaeats-800 mb-2">Spice Delight</h4>
                <p className="text-sm text-halaeats-600 mb-1">123 Food Street, San Francisco, CA 94105</p>
                <p className="text-sm text-halaeats-600">Open: 11:00 AM - 9:00 PM</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Pickup Time</h3>
              <Select onValueChange={handlePickupTimeChange} defaultValue={timeSlots[0]}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select pickup time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Button 
        onClick={handleContinue}
        className="w-full bg-primary hover:bg-cuisine-600"
        disabled={selectedType === 'delivery' && !selected}
      >
        Continue to Payment
      </Button>
    </div>
  );
};

export default DeliveryMethodStep;
