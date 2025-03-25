
import React from "react";
import { CalendarIcon } from "lucide-react";
import { parseISO } from "date-fns";
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
}

const CalendarWidget = ({ 
  selectedDate, 
  onDateSelect, 
  onMonthChange,
  orderDates, 
  isLoading 
}: CalendarWidgetProps) => {
  // Function to identify dates with orders for the calendar
  const getDatesWithOrders = (): Date[] => {
    if (!orderDates) return [];
    return orderDates.map(orderDate => parseISO(orderDate.date));
  };

  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarIcon className="mr-2 h-5 w-5" />
          Select Date
        </CardTitle>
        <CardDescription>
          Dates with orders are highlighted
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[300px] w-full rounded-md" />
          </div>
        ) : (
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            onMonthChange={onMonthChange}
            className="p-3 pointer-events-auto rounded-md border"
            modifiers={{
              booked: getDatesWithOrders(),
              today: [new Date()]
            }}
            modifiersStyles={{
              booked: {
                fontWeight: "bold",
                borderBottom: "2px solid #3b82f6",
                color: "#2563eb"
              },
              today: {
                fontWeight: "bold",
                border: "2px solid #10b981"
              }
            }}
          />
        )}
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <div className="h-3 w-3 rounded-full border-2 border-blue-500 mr-2"></div>
            <span>Dates with orders</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <div className="h-3 w-3 rounded-full border-2 border-green-500 mr-2"></div>
            <span>Today</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarWidget;
