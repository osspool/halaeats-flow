
import React, { useEffect, useRef } from 'react';
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
  const prevAddressRef = useRef(selectedAddressId);
  const prevSlotRef = useRef(selectedSlot);
  
  // Only refresh quote when both address and slot are selected AND one of them has changed
  useEffect(() => {
    if (selectedAddressId && 
        selectedSlot && 
        (prevAddressRef.current !== selectedAddressId || prevSlotRef.current !== selectedSlot) && 
        !isLoadingQuote) {
      console.log('Address or time slot changed, refreshing quote');
      onRefreshQuote();
      
      // Update refs to current values
      prevAddressRef.current = selectedAddressId;
      prevSlotRef.current = selectedSlot;
    }
  }, [selectedAddressId, selectedSlot, onRefreshQuote, isLoadingQuote]);

  const handleAddressSelect = (addressId: string) => {
    console.log('Address selected in DeliveryTabContent:', addressId);
    onAddressSelect(addressId);
  };

  const handleSlotSelect = (slotId: string) => {
    console.log('Slot selected in DeliveryTabContent:', slotId);
    onSlotSelect(slotId);
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
        onSlotSelect={handleSlotSelect}
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
