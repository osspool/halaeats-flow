
import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { TimeSlotSelector } from '@/components/shared/time-slots';
import { TimeSlot } from '@/components/shared/time-slots/types';

interface DeliveryDateTimePickerProps {
  orderType: 'delivery' | 'pickup';
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  selectedSlot: string | null;
  onSlotSelect: (slotId: string) => void;
  availableTimeSlots: TimeSlot[];
  isLoadingTimeSlots: boolean;
}

const DeliveryDateTimePicker = ({
  orderType,
  selectedDate,
  onDateChange,
  selectedSlot,
  onSlotSelect,
  availableTimeSlots,
  isLoadingTimeSlots,
}: DeliveryDateTimePickerProps) => {
  const title = orderType === 'delivery' ? 'Delivery' : 'Pickup';
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-2">{title} Date</h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, 'PPP')
              ) : (
                <span>Pick a {title.toLowerCase()} date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateChange}
              initialFocus
              className="p-3 pointer-events-auto"
              disabled={(date) => {
                // Disable past dates
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                // Disable dates more than 14 days in advance
                const twoWeeksFromNow = new Date();
                twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
                
                return date < today || date > twoWeeksFromNow;
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Only show time slots if a date is selected */}
      {selectedDate && (
        <div>
          <h3 className="font-medium mb-2">{title} Time</h3>
          <TimeSlotSelector
            slots={availableTimeSlots}
            selectedSlot={selectedSlot}
            onSelectSlot={onSlotSelect}
            label={`Available Time Slots for ${format(selectedDate, 'MMMM d, yyyy')}`}
            showCapacity={true}
            layout="grid"
            emptyMessage={isLoadingTimeSlots ? "Loading available slots..." : `No ${title.toLowerCase()} slots available for this date. Please select another date.`}
          />
        </div>
      )}
    </div>
  );
};

export default DeliveryDateTimePicker;
