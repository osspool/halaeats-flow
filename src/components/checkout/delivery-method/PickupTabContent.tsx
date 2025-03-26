
import React from 'react';
import PickupForm from '../pickup/PickupForm';
import TimeSlotSection from './TimeSlotSection';
import { TimeSlot } from '@/components/shared/time-slots/types';

interface PickupTabContentProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  selectedSlot: string | null;
  onSlotSelect: (slotId: string) => void;
  availableTimeSlots: TimeSlot[];
  isLoadingTimeSlots: boolean;
}

const PickupTabContent = ({
  selectedDate,
  onDateChange,
  selectedSlot,
  onSlotSelect,
  availableTimeSlots,
  isLoadingTimeSlots
}: PickupTabContentProps) => {
  return (
    <div className="p-4 bg-halaeats-50 rounded-lg space-y-6">
      <PickupForm />
      
      <TimeSlotSection
        orderType="pickup"
        selectedDate={selectedDate}
        onDateChange={onDateChange}
        selectedSlot={selectedSlot}
        onSlotSelect={onSlotSelect}
        availableTimeSlots={availableTimeSlots}
        isLoadingTimeSlots={isLoadingTimeSlots}
      />
    </div>
  );
};

export default PickupTabContent;
