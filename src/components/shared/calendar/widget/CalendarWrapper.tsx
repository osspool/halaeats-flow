
import React from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import CalendarDayContent from "./CalendarDayContent";
import { DayClickEventHandler } from "react-day-picker";
import { useIsMobile } from "@/hooks/use-mobile";

interface CalendarWrapperProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onMonthChange: (month: Date) => void;
  datesWithItems: Date[];
  isLoading: boolean;
  getItemCountForDate: (date: Date) => number;
  modifiersStyles: Record<string, React.CSSProperties>;
}

const CalendarWrapper = ({
  selectedDate,
  onDateSelect,
  onMonthChange,
  datesWithItems,
  isLoading,
  getItemCountForDate,
  modifiersStyles
}: CalendarWrapperProps) => {
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-3 p-6">
        <Skeleton className="h-[300px] w-full rounded-md" />
      </div>
    );
  }

  // Components for rendering custom day cells
  const CustomDay = ({ 
    date, 
    ...props
  }: { 
    date: Date; 
    [key: string]: any;
  }) => {
    const count = getItemCountForDate(date);
    const isSelected = selectedDate && 
                      date.getDate() === selectedDate.getDate() && 
                      date.getMonth() === selectedDate.getMonth() && 
                      date.getFullYear() === selectedDate.getFullYear();

    return (
      <button
        {...props}
        onClick={() => onDateSelect(date)}
      >
        <CalendarDayContent 
          day={date} 
          count={count} 
          isSelected={isSelected}
          isMobile={isMobile}
        />
      </button>
    );
  };

  return (
    <div className="p-4">
      <CalendarComponent
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        onMonthChange={onMonthChange}
        className="rounded-md border shadow-sm bg-white dark:bg-card pointer-events-auto"
        modifiers={{
          hasItems: datesWithItems,
          today: [new Date()]
        }}
        modifiersStyles={modifiersStyles}
        components={{
          Day: CustomDay
        }}
        fromMonth={new Date(2020, 0)}
        toMonth={new Date(2030, 11)}
        showOutsideDays={false}
      />
    </div>
  );
};

export default CalendarWrapper;
