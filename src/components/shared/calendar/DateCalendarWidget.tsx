
import React from "react";
import { CalendarIcon } from "lucide-react";
import { isSameMonth } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DateWithCount } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";
import CalendarWrapper from "./widget/CalendarWrapper";
import CalendarLegend from "./widget/CalendarLegend";
import { useDateItemsManager } from "./widget/DateItemsManager";

interface DateCalendarWidgetProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onMonthChange: (month: Date) => void;
  datesWithItems: DateWithCount[] | undefined;
  isLoading: boolean;
  currentMonth: Date;
  title?: string;
  description?: string;
}

const DateCalendarWidget = ({ 
  selectedDate, 
  onDateSelect, 
  onMonthChange,
  datesWithItems, 
  isLoading,
  currentMonth,
  title = "Select Date",
  description = "Dates with items are highlighted"
}: DateCalendarWidgetProps) => {
  const isMobile = useIsMobile();
  const { getDatesWithItems, getItemCountForDate } = useDateItemsManager(datesWithItems);

  // Handle date selection with validation for current month
  const handleDateSelect = (date: Date | undefined) => {
    if (date && !isSameMonth(date, currentMonth)) {
      // If selecting a date outside the current month, change to that month first
      onMonthChange(date);
    }
    onDateSelect(date);
  };

  // Styles for calendar day modifiers
  const modifiersStyles = {
    hasItems: {
      fontWeight: "bold",
      backgroundColor: "rgba(245, 158, 11, 0.1)",
      color: "#f59e0b",
      borderRadius: "0.375rem",
    },
    today: {
      fontWeight: "bold",
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      color: "#10b981",
      borderRadius: "0.375rem",
    },
    selected: {
      backgroundColor: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
      borderRadius: "0.375rem",
    }
  };

  return (
    <Card className={`md:col-span-1 overflow-hidden ${isMobile ? '' : 'border-none shadow-elevation-medium'}`}>
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
        <CardTitle className="flex items-center text-xl">
          <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <CalendarWrapper
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          onMonthChange={onMonthChange}
          datesWithItems={getDatesWithItems()}
          isLoading={isLoading}
          getItemCountForDate={getItemCountForDate}
          modifiersStyles={modifiersStyles}
        />
        
        <CalendarLegend />
      </CardContent>
    </Card>
  );
};

export default DateCalendarWidget;
