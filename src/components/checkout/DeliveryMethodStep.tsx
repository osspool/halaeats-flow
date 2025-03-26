
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { TabsContent } from '@/components/ui/tabs';
import { OrderType } from '@/types';
import { useBookTimeSlot, useRestaurantMenu } from '@/hooks/useRestaurantApi';
import { TimeSlot } from '@/components/shared/time-slots/types';
import { mockAddresses } from '@/data/checkoutMockData';
import { useDeliveryQuote } from '@/hooks/checkout/useDeliveryQuote';
import DeliveryForm from './delivery/DeliveryForm';
import PickupForm from './pickup/PickupForm';
import { 
  OrderTypeSelector, 
  TimeSlotSection,
  ContinueButton
} from './delivery-method';

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

  const handleOrderTypeChange = (type: OrderType) => {
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
      if (selectedAddressId && selectedSlot) {
        if (isQuoteValid()) {
          console.log('Delivery order is valid, proceeding to next step');
          onNext();
          return;
        } else if (!isLoadingQuote) {
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

    // For pickup orders, we just need a time slot
    if (selectedType === 'pickup') {
      console.log('Pickup button state:', !selectedSlot ? 'disabled' : 'enabled');
      return !selectedSlot;
    }

    // For delivery orders
    if (selectedType === 'delivery') {
      // We need an address, a time slot, and either a valid quote or loading quote
      const hasAddress = !!selectedAddressId;
      const hasTimeSlot = !!selectedSlot;
      const quoteValid = isQuoteValid() || isLoadingQuote;
      
      console.log('Delivery validation:', {
        addressSelected: hasAddress,
        timeSlotSelected: hasTimeSlot,
        quoteValid
      });
      
      return !hasAddress || !hasTimeSlot || !quoteValid;
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

        <OrderTypeSelector
          selectedType={selectedType}
          onOrderTypeChange={handleOrderTypeChange}
        />
        
        {/* Inject content into the tabs */}
        <TabsContent value="delivery" className="p-4 bg-halaeats-50 rounded-lg space-y-6">
          <DeliveryForm
            selectedAddressId={selectedAddressId}
            onAddressSelect={onAddressSelect}
            onDeliveryInstructionsChange={onDeliveryInstructionsChange}
          />
          
          <TimeSlotSection
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
        </TabsContent>
        
        <TabsContent value="pickup" className="p-4 bg-halaeats-50 rounded-lg space-y-6">
          <PickupForm />
          
          <TimeSlotSection
            orderType="pickup"
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            selectedSlot={selectedSlot}
            onSlotSelect={handleSelectTimeSlot}
            availableTimeSlots={availableTimeSlots}
            isLoadingTimeSlots={isLoadingTimeSlots}
          />
        </TabsContent>
      </div>
      
      <ContinueButton 
        onClick={handleContinue}
        isDisabled={isContinueButtonDisabled()}
        isLoadingPayment={bookTimeSlotMutation.isPending}
        isLoadingQuote={isLoadingQuote}
      />
    </div>
  );
};

export default DeliveryMethodStep;
