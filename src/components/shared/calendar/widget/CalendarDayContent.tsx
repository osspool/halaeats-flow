
import React from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface CalendarDayContentProps {
  day: Date;
  count: number;
  isSelected: boolean;
  isMobile: boolean;
}

const CalendarDayContent = ({ day, count, isSelected, isMobile }: CalendarDayContentProps) => {
  // For mobile, keep it simple
  if (isMobile) {
    return (
      <div 
        className={`relative w-full h-full flex items-center justify-center ${
          count > 0 ? 'font-semibold' : ''
        } ${isSelected ? 'text-primary-foreground' : ''}`}
      >
        {day.getDate()}
        {count > 0 && !isSelected && (
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
        )}
      </div>
    );
  }

  // For desktop, add hover card with count info
  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div 
          className={`relative w-full h-full flex items-center justify-center ${
            count > 0 ? 'font-semibold' : ''
          } ${isSelected ? 'text-primary-foreground' : ''}`}
        >
          {day.getDate()}
          {count > 0 && !isSelected && (
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-1 bg-primary rounded-full" />
          )}
        </div>
      </HoverCardTrigger>
      {count > 0 && (
        <HoverCardContent className="w-auto p-2 text-xs" align="center" side="top">
          {count} {count === 1 ? 'item' : 'items'}
        </HoverCardContent>
      )}
    </HoverCard>
  );
};

export default CalendarDayContent;
