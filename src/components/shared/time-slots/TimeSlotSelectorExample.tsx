
import React, { useState } from 'react';
import { TimeSlotSelector } from './index';
import { TimeSlot } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Example data
const exampleTimeSlots: TimeSlot[] = [
  { id: '1', time: '09:00-10:00', capacity: 5, booked: 0 },
  { id: '2', time: '10:00-11:00', capacity: 5, booked: 3 },
  { id: '3', time: '11:00-12:00', capacity: 5, booked: 5 },
  { id: '4', time: '13:00-14:00', capacity: 5, booked: 2 },
  { id: '5', time: '14:00-15:00', capacity: 5, booked: 1 },
  { id: '6', time: '15:00-16:00', capacity: 5, booked: 4 },
];

const TimeSlotSelectorExample = () => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const handleSelectTimeSlot = (slotId: string) => {
    setSelectedSlot(slotId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select a Time Slot</CardTitle>
      </CardHeader>
      <CardContent>
        <TimeSlotSelector
          slots={exampleTimeSlots}
          selectedSlot={selectedSlot}
          onSelectSlot={handleSelectTimeSlot}
          label="Available Time Slots"
          showCapacity={true}
          layout="grid"
        />
        
        {selectedSlot && (
          <div className="mt-4 p-3 bg-primary/10 rounded-md">
            <p className="font-medium">Selected Time Slot: {exampleTimeSlots.find(s => s.id === selectedSlot)?.time}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimeSlotSelectorExample;
