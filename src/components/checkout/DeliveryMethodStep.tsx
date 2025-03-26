
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { OrderType } from '@/types';
import { useBookTimeSlot, useRestaurantMenu } from '@/hooks/useRestaurantApi';
import { TimeSlot } from '@/components/shared/time-slots/types';
import { mockAddresses } from '@/data/checkoutMockData';
import { useDeliveryQuote } from '@/hooks/checkout/useDeliveryQuote';
import { useDeliveryMethodValidation } from '@/hooks/checkout/useDeliveryMethodValidation';
import { toast } from 'sonner';
import { 
  OrderTypeSelector, 
  ContinueButton,
  DeliveryTabContent,
  PickupTabContent
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

  // Validation hook for the continue button
  const { isButtonDisabled, getSelectedAddress } = useDeliveryMethodValidation({
    selectedType,
    selectedAddressId,
    selectedSlot,
    isLoadingTimeSlots,
    isLoadingQuote,
    bookTimeSlotMutation
  });

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
    console.log('Address effect running with selectedAddressId:', selectedAddressId);
    if (selectedType === 'delivery' && selectedAddressId) {
      const selectedAddress = mockAddresses.find(addr => addr.id === selectedAddressId);
      if (selectedAddress) {
        console.log('Fetching delivery quote for address:', selectedAddress);
        fetchDeliveryQuote(selectedAddress)
          .then(quote => {
            console.log('Received quote:', quote);
            if (!quote || quote.status !== 'active') {
              toast.error('Could not get a valid delivery quote. Please try again.');
            }
          })
          .catch(err => {
            console.error('Error fetching quote:', err);
            toast.error('Error getting delivery quote. Please try again.');
          });
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
    const selectedAddress = getSelectedAddress();
    if (selectedAddress) {
      toast.promise(refreshQuote(selectedAddress), {
        loading: 'Refreshing delivery quote...',
        success: 'Delivery quote updated!',
        error: 'Could not refresh quote. Please try again.'
      });
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
        const isValid = isQuoteValid();
        console.log('Delivery quote validity check result:', isValid);
        
        if (isValid) {
          console.log('Delivery order is valid, proceeding to next step');
          onNext();
          return;
        } else if (!isLoadingQuote) {
          console.log('Delivery quote is not valid, refreshing...');
          handleRefreshQuote();
          toast.error('Your delivery quote has expired. We have refreshed it for you. Please try again.');
        }
      } else {
        console.log('Missing required fields for delivery order');
        toast.error('Please select both a delivery address and a time slot to continue.');
      }
    }
  };

  // Create content components for delivery and pickup tabs
  const deliveryContent = (
    <DeliveryTabContent 
      selectedAddressId={selectedAddressId}
      onAddressSelect={onAddressSelect}
      onDeliveryInstructionsChange={onDeliveryInstructionsChange}
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
  );

  const pickupContent = (
    <PickupTabContent
      selectedDate={selectedDate}
      onDateChange={handleDateChange}
      selectedSlot={selectedSlot}
      onSlotSelect={handleSelectTimeSlot}
      availableTimeSlots={availableTimeSlots}
      isLoadingTimeSlots={isLoadingTimeSlots}
    />
  );

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
          deliveryContent={deliveryContent}
          pickupContent={pickupContent}
        />
      </div>
      
      <ContinueButton 
        onClick={handleContinue}
        isDisabled={isButtonDisabled}
        isLoadingPayment={bookTimeSlotMutation.isPending}
        isLoadingQuote={isLoadingQuote}
      />
    </div>
  );
};

export default DeliveryMethodStep;
