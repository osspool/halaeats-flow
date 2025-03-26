
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { TimeSlot } from '@/components/shared/time-slots/types';

/**
 * Hook to fetch and manage time slots for delivery and pickup
 */
export const useTimeSlots = (menuData: any | undefined) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState<boolean>(false);
  
  // When date changes, fetch available time slots for that date
  useEffect(() => {
    if (!selectedDate || !menuData) {
      setAvailableTimeSlots([]);
      return;
    }
    
    setIsLoadingTimeSlots(true);
    
    // Simulate API call to get time slots for the selected date
    setTimeout(() => {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      console.log(`Fetching time slots for date: ${formattedDate}`);
      
      // Get the time slots for this date from menu data
      const dateTimeSlots = menuData.availableTimeSlots || [];
      const capacities = menuData.timeSlotCapacities || {};
      
      // Convert to the format our TimeSlotSelector component expects
      const slots = dateTimeSlots.map((timeSlot: string) => {
        const capacity = capacities[timeSlot]?.capacity || 5;
        const booked = capacities[timeSlot]?.booked || 0;
        
        return {
          id: timeSlot,
          time: timeSlot,
          capacity,
          booked
        };
      });
      
      setAvailableTimeSlots(slots);
      setIsLoadingTimeSlots(false);
    }, 500); // Simulate network delay
  }, [selectedDate, menuData]);

  const handleDateChange = (date: Date | undefined) => {
    console.log("Selected date:", date);
    setSelectedDate(date);
    // Reset selected slot when date changes
    setSelectedSlot(null);
  };

  const handleSelectTimeSlot = (slotId: string) => {
    console.log("Selected time slot:", slotId);
    setSelectedSlot(slotId);
  };

  return {
    selectedDate,
    selectedSlot,
    availableTimeSlots,
    isLoadingTimeSlots,
    handleDateChange,
    handleSelectTimeSlot,
    setSelectedSlot
  };
};
