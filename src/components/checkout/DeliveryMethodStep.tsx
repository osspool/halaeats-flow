
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Truck, Home } from 'lucide-react';
import { OrderType } from '@/types';
import { useBookTimeSlot, useRestaurantMenu } from '@/hooks/useRestaurantApi';
import { TimeSlot } from '@/components/shared/time-slots/types';
import { mockAddresses } from '@/data/checkoutMockData';
import { useDeliveryQuote } from '@/hooks/checkout/useDeliveryQuote';
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
  
  // Get delivery quote if delivery is selected and an address is chosen
  const { 
    deliveryQuote, 
    isLoadingQuote, 
    fetchDeliveryQuote, 
    isQuoteValid,
    refreshQuote
  } = useDeliveryQuote(selectedAddressId);

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

  // When address changes and delivery is selected, fetch a new delivery quote
  useEffect(() => {
    if (selectedType === 'delivery' && selectedAddressId) {
      const selectedAddress = mockAddresses.find(addr => addr.id === selectedAddressId);
      if (selectedAddress) {
        fetchDeliveryQuote(selectedAddress);
      }
    }
  }, [selectedAddressId, selectedType, fetchDeliveryQuote]);

  // When date changes, fetch available time slots for that date
  useEffect(() => {
    if (!selectedDate || !menuData) {
      setAvailableTimeSlots([]);
      return;
    }
    
    setIsLoadingTimeSlots(true);
    
    // Simulate API call to get time slots for the selected date
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

  const handleRefreshQuote = () => {
    if (selectedAddressId) {
      const selectedAddress = mockAddresses.find(addr => addr.id === selectedAddressId);
      if (selectedAddress) {
        refreshQuote(selectedAddress);
      }
    }
  };

  const handleContinue = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Continue button clicked');
    console.log('Current validation state:', {
      selectedType,
      selectedAddressId,
      selectedSlot,
      isQuoteValid: selectedType === 'delivery' ? isQuoteValid() : true
    });
    
    // For pickup orders, we need a selected slot
    if (selectedType === 'pickup' && selectedSlot) {
      console.log('Pickup order is valid, proceeding to next step');
      onNext();
      return;
    }
    
    // For delivery orders
    if (selectedType === 'delivery') {
      // Validate delivery requirements
      if (selectedAddressId && selectedSlot) {
        // Check quote validity for delivery
        if (isQuoteValid()) {
          console.log('Delivery order is valid, proceeding to next step');
          onNext();
          return;
        } else {
          console.log('Delivery quote is not valid, refreshing...');
          handleRefreshQuote();
        }
      } else {
        console.log('Missing required fields for delivery order');
      }
    }
  };

  // Function to determine if the Continue button should be disabled
  const isContinueButtonDisabled = () => {
    // If we're loading data, disable the button
    if (bookTimeSlotMutation.isPending || isLoadingTimeSlots) {
      console.log('Button disabled: Loading data');
      return true;
    }

    // For pickup orders
    if (selectedType === 'pickup') {
      console.log('Pickup button state:', !selectedSlot ? 'disabled' : 'enabled');
      return !selectedSlot;
    }

    // For delivery orders
    if (selectedType === 'delivery') {
      // For delivery, check that we have an address, a time slot, and a valid quote
      const quoteValid = isQuoteValid();
      console.log('Delivery validation:', {
        addressSelected: !!selectedAddressId,
        timeSlotSelected: !!selectedSlot,
        quoteValid
      });
      
      // Only disable if any of these are not true
      return !selectedAddressId || !selectedSlot || !quoteValid;
    }

    return true;
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
                deliveryQuote={deliveryQuote}
                isLoadingQuote={isLoadingQuote}
                onRefreshQuote={handleRefreshQuote}
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
        disabled={isContinueButtonDisabled()}
      >
        {bookTimeSlotMutation.isPending 
          ? "Reserving Your Slot..." 
          : isLoadingQuote 
            ? "Loading Delivery Quote..." 
            : "Continue to Payment"}
      </Button>
    </div>
  );
};

export default DeliveryMethodStep;
