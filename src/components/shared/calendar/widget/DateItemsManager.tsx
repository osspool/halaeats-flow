
import React from "react";
import { DateWithCount } from "../types";

interface DateItemsManagerProps {
  datesWithItems: DateWithCount[] | undefined;
}

export const useDateItemsManager = (datesWithItems: DateWithCount[] | undefined) => {
  // Function to identify dates with items for the calendar
  const getDatesWithItems = (): Date[] => {
    if (!datesWithItems) return [];
    return datesWithItems.map(dateItem => 
      typeof dateItem.date === 'string' 
        ? new Date(dateItem.date) 
        : dateItem.date
    );
  };

  // Get item count for each date
  const getItemCountForDate = (date: Date): number => {
    if (!datesWithItems) return 0;
    
    const dateString = date.toISOString().split('T')[0];
    const matchingDate = datesWithItems.find(item => {
      const itemDate = typeof item.date === 'string' 
        ? item.date.split('T')[0] 
        : item.date.toISOString().split('T')[0];
      
      return itemDate === dateString;
    });
    
    return matchingDate?.count || 0;
  };

  return {
    getDatesWithItems,
    getItemCountForDate
  };
};

// This is just a type provider component - it doesn't render anything
const DateItemsManager: React.FC<DateItemsManagerProps> = () => null;

export default DateItemsManager;
