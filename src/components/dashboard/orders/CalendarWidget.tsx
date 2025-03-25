
import React from "react";
import { DateWithCount } from "@/components/shared/calendar/types";
import { DateCalendarWidget } from "@/components/shared/calendar";

interface CalendarWidgetProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onMonthChange: (month: Date) => void;
  orderDates: DateWithCount[] | undefined;
  isLoading: boolean;
  currentMonth: Date;
}

const CalendarWidget = ({ 
  selectedDate, 
  onDateSelect, 
  onMonthChange,
  orderDates, 
  isLoading,
  currentMonth
}: CalendarWidgetProps) => {
  // Map order dates to the format expected by DateCalendarWidget
  const mapOrderDates = () => {
    if (!orderDates) return [];
    return orderDates.map(date => ({
      date: date.date,
      count: date.count // Fixed: using count instead of orderCount
    }));
  };

  return (
    <DateCalendarWidget
      selectedDate={selectedDate}
      onDateSelect={onDateSelect}
      onMonthChange={onMonthChange}
      datesWithItems={mapOrderDates()}
      isLoading={isLoading}
      currentMonth={currentMonth}
      title="Select Date"
      description="Dates with orders are highlighted"
    />
  );
};

export default CalendarWidget;
