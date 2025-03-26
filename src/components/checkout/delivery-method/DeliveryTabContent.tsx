
import React, { useEffect } from 'react';
import DeliveryForm from '../delivery/DeliveryForm';
import TimeSlotSection from './TimeSlotSection';
import { TimeSlot } from '@/components/shared/time-slots/types';
import { DeliveryQuote } from '@/types/delivery';

interface DeliveryTabContentProps {
  selectedAddressId?: string;
  onAddressSelect: (addressId: string) => void;
  onDeliveryInstructionsChange: (instructions: string) => void;
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  selectedSlot: string | null;
  onSlotSelect: (slotId: string) => void;
  availableTimeSlots: TimeSlot[];
  isLoadingTimeSlots: boolean;
  deliveryQuote?: DeliveryQuote | null;
  isLoadingQuote: boolean;
  onRefreshQuote: () => void;
}

const DeliveryTabContent = ({
  selectedAddressId,
  onAddressSelect,
  onDeliveryInstructionsChange,
  selectedDate,
  onDateChange,
  selectedSlot,
  onSlotSelect,
  availableTimeSlots,
  isLoadingTimeSlots,
  deliveryQuote,
  isLoadingQuote,
  onRefreshQuote
}: DeliveryTabContentProps) => {
  // When time slot or address changes, we need to refresh the quote
  useEffect(() => {
    if (selectedAddressId && selectedSlot) {
      console.log('Address and time slot both selected, should refresh quote');
      onRefreshQuote();
    }
  }, [selectedAddressId, selectedSlot, onRefreshQuote]);

  const handleAddressSelect = (addressId: string) => {
    console.log('Address selected in DeliveryTabContent:', addressId);
    onAddressSelect(addressId);
  };

  return (
    <div>
      <DeliveryForm
        selectedAddressId={selectedAddressId}
        onAddressSelect={handleAddressSelect}
        onDeliveryInstructionsChange={onDeliveryInstructionsChange}
      />
      
      <TimeSlotSection
        orderType="delivery"
        selectedDate={selectedDate}
        onDateChange={onDateChange}
        selectedSlot={selectedSlot}
        onSlotSelect={onSlotSelect}
        availableTimeSlots={availableTimeSlots}
        isLoadingTimeSlots={isLoadingTimeSlots}
        deliveryQuote={deliveryQuote}
        isLoadingQuote={isLoadingQuote}
        onRefreshQuote={onRefreshQuote}
      />
    </div>
  );
};

export default DeliveryTabContent;
