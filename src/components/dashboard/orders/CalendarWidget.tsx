
import React from "react";
import { CalendarIcon } from "lucide-react";
import { parseISO, format, isSameMonth } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderDate } from "@/types/restaurant";

interface CalendarWidgetProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onMonthChange: (month: Date) => void;
  orderDates: OrderDate[] | undefined;
  isLoading: boolean;
  currentMonth: Date; // Add currentMonth prop
}

const CalendarWidget = ({ 
  selectedDate, 
  onDateSelect, 
  onMonthChange,
  orderDates, 
  isLoading,
  currentMonth // Add currentMonth to props
}: CalendarWidgetProps) => {
  // Function to identify dates with orders for the calendar
  const getDatesWithOrders = (): Date[] => {
    if (!orderDates) return [];
    return orderDates.map(orderDate => parseISO(orderDate.date));
  };

  // Handle date selection with validation for current month
  const handleDateSelect = (date: Date | undefined) => {
    if (date && !isSameMonth(date, currentMonth)) {
      // If selecting a date outside the current month, change to that month first
      onMonthChange(date);
    }
    onDateSelect(date);
  };

  return (
    <Card className="md:col-span-1 overflow-hidden border-none shadow-elevation-medium">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
        <CardTitle className="flex items-center text-xl">
          <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
          Select Date
        </CardTitle>
        <CardDescription>
          Dates with orders are highlighted
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex flex-col space-y-3 p-6">
            <Skeleton className="h-[300px] w-full rounded-md" />
          </div>
        ) : (
          <div className="p-4">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              onMonthChange={onMonthChange}
              className="rounded-md border shadow-sm bg-white dark:bg-card pointer-events-auto"
              modifiers={{
                booked: getDatesWithOrders(),
                today: [new Date()],
                outsideCurrentMonth: (date) => !isSameMonth(date, currentMonth)
              }}
              modifiersStyles={{
                booked: {
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
                },
                outsideCurrentMonth: {
                  opacity: "0.4"
                }
              }}
              fromMonth={new Date(2020, 0)} // Allow selecting dates from Jan 2020
              toMonth={new Date(2030, 11)}  // Allow selecting dates until Dec 2030
            />
          </div>
        )}
        
        <div className="px-6 pb-6 pt-2 space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <div className="h-3 w-3 rounded-md bg-amber-500/20 border border-amber-500 mr-2"></div>
            <span>Dates with orders</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <div className="h-3 w-3 rounded-md bg-green-500/20 border border-green-500 mr-2"></div>
            <span>Today</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <div className="h-3 w-3 rounded-md bg-primary border border-primary mr-2"></div>
            <span>Selected date</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <div className="h-3 w-3 rounded-md bg-gray-200 border border-gray-300 mr-2"></div>
            <span>Dates outside current month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarWidget;
