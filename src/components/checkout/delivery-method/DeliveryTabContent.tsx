
import React from 'react';
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
  return (
    <div>
      <DeliveryForm
        selectedAddressId={selectedAddressId}
        onAddressSelect={onAddressSelect}
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
