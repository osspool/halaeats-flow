
import { useState } from 'react';
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
  const [shouldRefreshQuote, setShouldRefreshQuote] = useState(false);
  
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
    refreshQuote
  } = useDeliveryQuote();

  const handleOrderTypeChange = (type: OrderType) => {
    console.log("Setting order type to:", type);
    setSelectedType(type);
    onOrderTypeChange(type);
  };

  const handleAddressSelect = (addressId: string) => {
    console.log('Address selected in DeliveryMethodStep:', addressId);
    setCurrentAddressId(addressId);
    onAddressSelect(addressId);
    setShouldRefreshQuote(true);
  };

  // Update pickup time when slot changes
  const handleTimeSlotSelection = (slotId: string) => {
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
      toast.promise(refreshQuote(selectedAddress), {
        loading: 'Refreshing delivery quote...',
        success: 'Delivery quote updated!',
        error: 'Could not refresh quote. Please try again.'
      });
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
