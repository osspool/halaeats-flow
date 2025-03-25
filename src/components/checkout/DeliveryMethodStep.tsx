
import { useState, useEffect } from 'react';
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
import { useBookTimeSlot, useRestaurantMenu } from '@/hooks/useRestaurantApi';
import TimeSlotSelector from './TimeSlotSelector';

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
  
  // Fetch restaurant menu data to get time slots and capacities
  const { data: menuData, isLoading: isMenuLoading } = useRestaurantMenu();
  const bookTimeSlotMutation = useBookTimeSlot();
  
  // Set initial values when component mounts
  useEffect(() => {
    // Set default address if none is selected
    if (!selected && addresses.length > 0) {
      const defaultAddress = addresses.find(a => a.isDefault)?.id || addresses[0].id;
      setSelected(defaultAddress);
      onAddressSelect(defaultAddress);
    }
  }, [addresses, selected, onAddressSelect]);

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

  const handleContinue = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Validation: Don't proceed if delivery is selected but no address is chosen
    if (selectedType === 'delivery' && !selected) return;
    
    // Validation: Don't proceed if no time slot is selected
    if (!pickupTime) return;
    
    // Attempt to book the selected time slot
    bookTimeSlotMutation.mutate(pickupTime, {
      onSuccess: (success) => {
        if (success) {
          // Time slot was successfully booked, proceed to next step
          console.log('Time slot booked successfully:', pickupTime);
          onNext();
        }
        // If booking failed, the mutation will show an error toast
      }
    });
  };

  // Fallback time slots if menu data is not available
  const fallbackTimeSlots = [
    "ASAP (15-30 min)",
    "Today, 11:30 AM",
    "Today, 12:00 PM",
    "Today, 12:30 PM",
    "Today, 1:00 PM",
    "Today, 1:30 PM",
  ];

  // Use restaurant time slots if available, fallback otherwise
  const availableTimeSlots = menuData?.availableTimeSlots || fallbackTimeSlots;
  const timeSlotCapacities = menuData?.timeSlotCapacities || {};

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
          value={selectedType}
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
            
            {/* Time Slot Selector */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Delivery Time</h3>
              <TimeSlotSelector
                timeSlots={availableTimeSlots}
                capacities={timeSlotCapacities}
                selectedTimeSlot={pickupTime}
                onSelect={handlePickupTimeChange}
              />
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
              <TimeSlotSelector
                timeSlots={availableTimeSlots}
                capacities={timeSlotCapacities}
                selectedTimeSlot={pickupTime}
                onSelect={handlePickupTimeChange}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Button 
        onClick={handleContinue}
        className="w-full bg-primary hover:bg-cuisine-600"
        disabled={(selectedType === 'delivery' && !selected) || !pickupTime || bookTimeSlotMutation.isPending}
      >
        {bookTimeSlotMutation.isPending ? "Reserving Your Slot..." : "Continue to Payment"}
      </Button>
    </div>
  );
};

export default DeliveryMethodStep;
