
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Truck, Home } from 'lucide-react';
import { OrderType } from '@/types';
import { useBookTimeSlot, useRestaurantMenu } from '@/hooks/useRestaurantApi';
import { TimeSlot } from '@/components/shared/time-slots/types';
import DeliveryForm from './delivery/DeliveryForm';
import PickupForm from './pickup/PickupForm';
import DeliveryDateTimePicker from './date-time/DeliveryDateTimePicker';

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState<boolean>(false);
  
  // Fetch restaurant menu data to get time slots and capacities
  const { data: menuData, isLoading: isMenuLoading } = useRestaurantMenu();
  const bookTimeSlotMutation = useBookTimeSlot();

  const handleSelect = (value: string) => {
    const type = value as OrderType;
    setSelectedType(type);
    onOrderTypeChange(type);
  };

  const handleSelectTimeSlot = (slotId: string) => {
    setSelectedSlot(slotId);
    onPickupTimeChange(slotId);
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    // Reset selected slot when date changes
    setSelectedSlot(null);
    onPickupTimeChange('');
  };

  // When date changes, fetch available time slots for that date
  useEffect(() => {
    if (!selectedDate || !menuData) {
      setAvailableTimeSlots([]);
      return;
    }
    
    setIsLoadingTimeSlots(true);
    
    // Simulate API call to get time slots for the selected date
    // In a real application, this would be an actual API call
    setTimeout(() => {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      console.log(`Fetching time slots for date: ${formattedDate}`);
      
      // Get the time slots for this date from menu data
      const dateTimeSlots = menuData.availableTimeSlots || [];
      const capacities = menuData.timeSlotCapacities || {};
      
      // Convert to the format our TimeSlotSelector component expects
      const slots = dateTimeSlots.map(timeSlot => {
        const capacity = capacities[timeSlot]?.capacity || 5;
        const booked = capacities[timeSlot]?.booked || 0;
        
        return {
          id: timeSlot,
          time: timeSlot,
          capacity,
          booked
        };
      });
      
      setAvailableTimeSlots(slots);
      setIsLoadingTimeSlots(false);
    }, 500); // Simulate network delay
  }, [selectedDate, menuData]);

  const handleContinue = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Validation: Don't proceed if delivery is selected but no address is chosen
    if (selectedType === 'delivery' && !selectedAddressId) return;
    
    // Validation: Don't proceed if no time slot is selected
    if (!selectedSlot) return;
    
    // Attempt to book the selected time slot
    bookTimeSlotMutation.mutate(selectedSlot, {
      onSuccess: (success) => {
        if (success) {
          // Time slot was successfully booked, proceed to next step
          console.log('Time slot booked successfully:', selectedSlot);
          onNext();
        }
        // If booking failed, the mutation will show an error toast
      }
    });
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
            <DeliveryForm
              selectedAddressId={selectedAddressId}
              onAddressSelect={onAddressSelect}
              onDeliveryInstructionsChange={onDeliveryInstructionsChange}
            />
            
            {/* Date and Time Selection */}
            <div className="border-t pt-4">
              <DeliveryDateTimePicker
                orderType="delivery"
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                selectedSlot={selectedSlot}
                onSlotSelect={handleSelectTimeSlot}
                availableTimeSlots={availableTimeSlots}
                isLoadingTimeSlots={isLoadingTimeSlots}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="pickup" className="p-4 bg-halaeats-50 rounded-lg space-y-6">
            <PickupForm />
            
            {/* Date and Time Selection */}
            <div className="space-y-4">
              <DeliveryDateTimePicker
                orderType="pickup"
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                selectedSlot={selectedSlot}
                onSlotSelect={handleSelectTimeSlot}
                availableTimeSlots={availableTimeSlots}
                isLoadingTimeSlots={isLoadingTimeSlots}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Button 
        onClick={handleContinue}
        className="w-full bg-primary hover:bg-cuisine-600"
        disabled={(selectedType === 'delivery' && !selectedAddressId) || !selectedSlot || bookTimeSlotMutation.isPending}
      >
        {bookTimeSlotMutation.isPending ? "Reserving Your Slot..." : "Continue to Payment"}
      </Button>
    </div>
  );
};

export default DeliveryMethodStep;
