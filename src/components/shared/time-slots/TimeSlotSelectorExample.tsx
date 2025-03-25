
import React, { useState } from 'react';
import { TimeSlotSelector } from './index';
import { TimeSlot } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';

// Example data
const exampleTimeSlots: TimeSlot[] = [
  { id: '1', time: '09:00-10:00', capacity: 5, booked: 0 },
  { id: '2', time: '10:00-11:00', capacity: 5, booked: 3 },
  { id: '3', time: '11:00-12:00', capacity: 5, booked: 5 },
  { id: '4', time: '13:00-14:00', capacity: 5, booked: 2 },
  { id: '5', time: '14:00-15:00', capacity: 5, booked: 1 },
  { id: '6', time: '15:00-16:00', capacity: 5, booked: 4 },
];

// Example data for multiple dates
const exampleTimeSlotsByDate: Record<string, TimeSlot[]> = {
  '2023-11-15': exampleTimeSlots,
  '2023-11-16': [
    { id: '7', time: '09:00-10:00', capacity: 5, booked: 1 },
    { id: '8', time: '10:00-11:00', capacity: 5, booked: 4 },
    { id: '9', time: '11:00-12:00', capacity: 5, booked: 2 },
  ],
  '2023-11-17': [
    { id: '10', time: '13:00-14:00', capacity: 5, booked: 0 },
    { id: '11', time: '14:00-15:00', capacity: 5, booked: 5 },
  ]
};

const TimeSlotSelectorExample = () => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleSelectTimeSlot = (slotId: string) => {
    setSelectedSlot(slotId);
  };

  // Get time slots for the selected date
  const getTimeSlotsForSelectedDate = (): TimeSlot[] => {
    if (!selectedDate) return [];
    
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    return exampleTimeSlotsByDate[formattedDate] || [];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book a Time Slot</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date selector */}
        <div>
          <div className="font-medium mb-2">Select Date</div>
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
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Time slot selector */}
        <TimeSlotSelector
          slots={getTimeSlotsForSelectedDate()}
          selectedSlot={selectedSlot}
          onSelectSlot={handleSelectTimeSlot}
          label="Available Time Slots"
          showCapacity={true}
          layout="grid"
          emptyMessage="No time slots available for this date. Please select another date."
        />
        
        {selectedSlot && (
          <div className="mt-4 p-3 bg-primary/10 rounded-md">
            <p className="font-medium">Selected Time Slot: {
              getTimeSlotsForSelectedDate().find(s => s.id === selectedSlot)?.time
            }</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimeSlotSelectorExample;
