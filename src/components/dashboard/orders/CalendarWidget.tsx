
import React from "react";
import { DateWithCount } from "@/components/shared/calendar/types";
import { DateCalendarWidget } from "@/components/shared/calendar";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, CalendarIcon } from "lucide-react";

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
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Map order dates to the format expected by DateCalendarWidget
  const mapOrderDates = () => {
    if (!orderDates) return [];
    return orderDates.map(date => ({
      date: date.date,
      count: date.count
    }));
  };

  // For mobile, we'll wrap the calendar in a collapsible component
  if (isMobile) {
    return (
      <div className="mb-4 md:mb-0">
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="rounded-lg border border-border shadow-sm bg-card"
        >
          <div className="px-4 py-3 flex items-center justify-between border-b">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">Select Date</h3>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                <span className="sr-only">Toggle calendar</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
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
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }

  // For desktop, we'll use the original DateCalendarWidget
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
