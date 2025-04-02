
import { useState, useEffect } from 'react';
import { OrderType } from '@/types';
import { useBookTimeSlot, useRestaurantMenu } from '@/hooks/useRestaurantApi';
import { mockAddresses } from '@/data/checkoutMockData';
import { useDeliveryQuote } from '@/hooks/checkout/useDeliveryQuote';
import { useTimeSlots } from '@/hooks/checkout/useTimeSlots';
import { toast } from 'sonner';
import { 
  OrderTypeSelector, 
  DeliveryTabContent,
  PickupTabContent
} from './delivery-method';
import DeliveryContinueButton from './delivery-method/DeliveryContinueButton';
import { useCheckout } from '@/hooks/useCheckout';

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
  const [currentAddressId, setCurrentAddressId] = useState<string | undefined>(selectedAddressId);
  
  // Fetch restaurant menu data to get time slots and capacities
  const { data: menuData, isLoading: isMenuLoading } = useRestaurantMenu();
  const bookTimeSlotMutation = useBookTimeSlot();
  
  // Custom hook for managing time slots
  const {
    selectedDate,
    selectedSlot,
    availableTimeSlots,
    isLoadingTimeSlots,
    handleDateChange,
    handleSelectTimeSlot,
    setSelectedSlot
  } = useTimeSlots(menuData);
  
  // Get delivery quote if delivery is selected and an address is chosen
  const { 
    deliveryQuote, 
    isLoadingQuote, 
    fetchDeliveryQuote, 
    isQuoteValid,
    refreshQuote,
    updateTimeSelection
  } = useDeliveryQuote();

  // Get the setDeliveryQuote function from the checkout context
  const { setDeliveryQuote } = useCheckout();

  // Update checkout state with the delivery quote when it changes
  useEffect(() => {
    if (deliveryQuote) {
      console.log('Updating checkout context with delivery quote:', deliveryQuote);
      setDeliveryQuote(deliveryQuote);
    }
  }, [deliveryQuote, setDeliveryQuote]);

  useEffect(() => {
    // If the address or slot changes and we're in delivery mode, try to get a new quote
    if (selectedType === 'delivery' && currentAddressId && selectedSlot) {
      const selectedAddress = mockAddresses.find(addr => addr.id === currentAddressId);
      if (selectedAddress) {
        console.log('Address or time slot changed, fetching new quote');
        
        // Only show toast if we're actually fetching (not just updating state)
        if (!isLoadingQuote) {
          toast.promise(fetchDeliveryQuote(selectedAddress, selectedSlot), {
            loading: 'Getting delivery quote...',
            success: 'Delivery quote updated!',
            error: 'Could not get delivery quote. Please try again.'
          });
        }

        // Also update the time selection in the delivery quote hook
        updateTimeSelection(selectedSlot, selectedDate || null);
      }
    }
  }, [currentAddressId, selectedSlot, selectedType, selectedDate, updateTimeSelection, fetchDeliveryQuote, isLoadingQuote]);

  const handleOrderTypeChange = (type: OrderType) => {
    console.log("Setting order type to:", type);
    setSelectedType(type);
    onOrderTypeChange(type);
  };

  const handleAddressSelect = (addressId: string) => {
    console.log('Address selected in DeliveryMethodStep:', addressId);
    setCurrentAddressId(addressId);
    onAddressSelect(addressId);
  };

  // Update pickup time when slot changes
  const handleTimeSlotSelection = (slotId: string) => {
    console.log('Time slot selected:', slotId);
    handleSelectTimeSlot(slotId);
    onPickupTimeChange(slotId);
  };

  const handleRefreshQuote = () => {
    if (isLoadingQuote) {
      console.log('Quote refresh already in progress, skipping');
      return;
    }
    
    const selectedAddress = mockAddresses.find(addr => addr.id === currentAddressId);
    if (selectedAddress) {
      console.log('Manually refreshing quote for address:', selectedAddress);
      toast.promise(refreshQuote(selectedAddress), {
        loading: 'Refreshing delivery quote...',
        success: 'Delivery quote updated!',
        error: 'Could not refresh quote. Please try again.'
      });
    } else {
      toast.error('Please select a delivery address to continue.');
    }
  };

  // Create content components for delivery and pickup tabs
  const deliveryContent = (
    <DeliveryTabContent 
      selectedAddressId={currentAddressId}
      onAddressSelect={handleAddressSelect}
      onDeliveryInstructionsChange={onDeliveryInstructionsChange}
      selectedDate={selectedDate}
      onDateChange={handleDateChange}
      selectedSlot={selectedSlot}
      onSlotSelect={handleTimeSlotSelection}
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
      onSlotSelect={handleTimeSlotSelection}
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
      
      <DeliveryContinueButton 
        selectedType={selectedType}
        selectedAddressId={currentAddressId}
        selectedSlot={selectedSlot}
        isLoadingQuote={isLoadingQuote}
        isLoadingTimeSlots={isLoadingTimeSlots}
        bookTimeSlotMutation={bookTimeSlotMutation}
        onNext={onNext}
        onRefreshQuote={handleRefreshQuote}
        isQuoteValid={isQuoteValid}
      />
    </div>
  );
};

export default DeliveryMethodStep;
