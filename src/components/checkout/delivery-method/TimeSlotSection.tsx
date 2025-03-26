
import React from 'react';
import { TimeSlot } from '@/components/shared/time-slots/types';
import { DeliveryQuote } from '@/types/delivery';
import DeliveryDateTimePicker from '@/components/checkout/date-time/DeliveryDateTimePicker';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

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
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">{orderType === 'delivery' ? 'Delivery' : 'Pickup'} Date & Time</h3>
        
        {orderType === 'delivery' && deliveryQuote?.status === 'expired' && onRefreshQuote && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefreshQuote}
            disabled={isLoadingQuote}
            className="flex items-center text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh Quote
          </Button>
        )}
      </div>
      
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
