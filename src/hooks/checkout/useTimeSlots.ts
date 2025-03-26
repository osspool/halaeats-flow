
import { useState, useEffect, useCallback } from 'react';
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
  
  // Fetch time slots when date changes
  const fetchTimeSlotsForDate = useCallback(async (date: Date) => {
    if (!date || !menuData) {
      setAvailableTimeSlots([]);
      return;
    }
    
    setIsLoadingTimeSlots(true);
    
    try {
      // Format date for API call
      const formattedDate = format(date, 'yyyy-MM-dd');
      console.log(`Fetching time slots for date: ${formattedDate}`);
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get the time slots for this date from menu data or use mock data
      const dateTimeSlots = menuData.availableTimeSlots || [];
      const capacities = menuData.timeSlotCapacities || {};
      
      // Generate different time slots based on the day of week to simulate variability
      const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday
      let filteredSlots = [...dateTimeSlots];
      
      // Weekend has different time slots than weekdays
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // Weekend slots - remove early morning slots
        filteredSlots = filteredSlots.filter(slot => !slot.includes('07:00'));
      } else if (dayOfWeek === 5) {
        // Friday has extended evening hours
        if (!filteredSlots.includes('21:00-23:30')) {
          filteredSlots.push('21:00-23:30');
        }
      }
      
      // Convert to the format our TimeSlotSelector component expects
      const slots = filteredSlots.map((timeSlot: string) => {
        // Make capacity and booking numbers slightly different per day
        const dayModifier = (dayOfWeek + 1) % 3; // 0, 1, or 2
        const capacity = (capacities[timeSlot]?.capacity || 5) + dayModifier;
        const booked = Math.min(
          (capacities[timeSlot]?.booked || 0) + Math.floor(dayOfWeek / 2),
          capacity - 1 // Ensure at least 1 slot is available
        );
        
        return {
          id: timeSlot,
          time: timeSlot,
          capacity,
          booked
        };
      });
      
      console.log(`Loaded ${slots.length} time slots for ${formattedDate}`);
      setAvailableTimeSlots(slots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      setAvailableTimeSlots([]);
    } finally {
      setIsLoadingTimeSlots(false);
    }
  }, [menuData]);
  
  // When date changes, fetch available time slots for that date
  useEffect(() => {
    if (selectedDate) {
      fetchTimeSlotsForDate(selectedDate);
    } else {
      setAvailableTimeSlots([]);
    }
  }, [selectedDate, fetchTimeSlotsForDate]);

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

  // Force refresh time slots for current date
  const refreshTimeSlots = useCallback(() => {
    if (selectedDate) {
      fetchTimeSlotsForDate(selectedDate);
    }
  }, [selectedDate, fetchTimeSlotsForDate]);

  return {
    selectedDate,
    selectedSlot,
    availableTimeSlots,
    isLoadingTimeSlots,
    handleDateChange,
    handleSelectTimeSlot,
    refreshTimeSlots,
    setSelectedSlot
  };
};
