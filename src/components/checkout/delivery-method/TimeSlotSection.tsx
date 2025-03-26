
import React from 'react';
import { TimeSlot } from '@/components/shared/time-slots/types';
import { DeliveryQuote } from '@/types/delivery';
import DeliveryDateTimePicker from '@/components/checkout/date-time/DeliveryDateTimePicker';

interface TimeSlotSectionProps {
  orderType: 'delivery' | 'pickup';
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  selectedSlot: string | null;
  onSlotSelect: (slotId: string) => void;
  availableTimeSlots: TimeSlot[];
  isLoadingTimeSlots: boolean;
  deliveryQuote?: DeliveryQuote | null;
  isLoadingQuote?: boolean;
  onRefreshQuote?: () => void;
}

const TimeSlotSection = ({
  orderType,
  selectedDate,
  onDateChange,
  selectedSlot,
  onSlotSelect,
  availableTimeSlots,
  isLoadingTimeSlots,
  deliveryQuote,
  isLoadingQuote,
  onRefreshQuote
}: TimeSlotSectionProps) => {
  return (
    <div className="border-t pt-4">
      <DeliveryDateTimePicker
        orderType={orderType}
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

export default TimeSlotSection;
