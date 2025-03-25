
import React from 'react';
import { format } from 'date-fns';
import { Clock, Users, CheckCircle2 } from 'lucide-react';
import { TimeSlotCapacity } from '@/types/restaurant';
import { cn } from '@/lib/utils';

interface TimeSlotSelectorProps {
  timeSlots: string[];
  capacities: TimeSlotCapacity;
  selectedTimeSlot: string | null;
  onSelect: (timeSlot: string) => void;
}

const TimeSlotSelector = ({
  timeSlots,
  capacities,
  selectedTimeSlot,
  onSelect
}: TimeSlotSelectorProps) => {
  
  // Helper function to check if a slot is full
  const isSlotFull = (slot: string): boolean => {
    const slotData = capacities[slot];
    if (!slotData) return false;
    
    return slotData.booked >= slotData.capacity;
  };
  
  // Helper function to get slot availability status
  const getSlotAvailability = (slot: string): {
    available: number;
    total: number;
    isFull: boolean;
    isAlmostFull: boolean; // Less than 20% available
  } => {
    const slotData = capacities[slot] || { capacity: 5, booked: 0 };
    const available = slotData.capacity - slotData.booked;
    const isFull = available <= 0;
    const isAlmostFull = available <= Math.max(1, Math.floor(slotData.capacity * 0.2));
    
    return {
      available,
      total: slotData.capacity,
      isFull,
      isAlmostFull
    };
  };
  
  // Function to format time for display
  const formatTimeRange = (timeRange: string): string => {
    const [start, end] = timeRange.split('-');
    return timeRange; // Keep original format or customize as needed
  };
  
  return (
    <div className="space-y-4">
      <div className="text-sm font-medium mb-2">Select a Delivery Time Slot:</div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {timeSlots.map(slot => {
          const availability = getSlotAvailability(slot);
          const isSelected = selectedTimeSlot === slot;
          
          return (
            <button
              key={slot}
              onClick={() => !availability.isFull && onSelect(slot)}
              disabled={availability.isFull}
              className={cn(
                "relative flex items-center justify-between border rounded-md p-3 transition-colors",
                isSelected && !availability.isFull && "border-primary bg-primary/10",
                availability.isFull ? "bg-gray-100 cursor-not-allowed opacity-70" : "hover:border-primary",
                availability.isAlmostFull && !availability.isFull && "border-orange-300"
              )}
            >
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <span>{formatTimeRange(slot)}</span>
                
                {isSelected && (
                  <CheckCircle2 className="h-4 w-4 ml-2 text-primary" />
                )}
              </div>
              
              <div className={cn(
                "flex items-center text-xs rounded-full px-2 py-1",
                availability.isFull ? "bg-red-100 text-red-600" : 
                availability.isAlmostFull ? "bg-orange-100 text-orange-600" : 
                "bg-green-100 text-green-600"
              )}>
                <Users className="h-3 w-3 mr-1" />
                {availability.isFull ? (
                  "Full"
                ) : (
                  <>{availability.available} left</>
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        * Time slots with limited availability may fill up quickly.
      </div>
    </div>
  );
};

export default TimeSlotSelector;
