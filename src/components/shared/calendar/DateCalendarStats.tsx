
import React from "react";
import { Button } from "@/components/ui/button";
import { DateItemStatus } from "./types";

interface DateCalendarStatsProps {
  statusOptions: DateItemStatus[];
  currentFilter: string | null;
  onFilterChange: (filter: string | null) => void;
  itemCounts: Record<string, number>;
}

const DateCalendarStats = ({ 
  statusOptions, 
  currentFilter, 
  onFilterChange,
  itemCounts
}: DateCalendarStatsProps) => {
  return (
    <div className="space-y-4">
      {/* Status Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={currentFilter === null ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(null)}
        >
          All
        </Button>
        {statusOptions.map(status => (
          <Button
            key={status.value}
            variant={currentFilter === status.value ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(status.value)}
          >
            {status.label}
          </Button>
        ))}
      </div>
      
      {/* Status Counts Display */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 px-6 py-3 border-b">
        <div className="flex flex-col">
          <span className="text-2xl font-bold">{itemCounts.total || 0}</span>
          <span className="text-xs uppercase text-muted-foreground">Total</span>
        </div>
        
        {statusOptions.map(status => (
          <div className="flex flex-col" key={status.value}>
            <span className={`text-2xl font-bold ${status.textColor || ''}`}>
              {itemCounts[status.value] || 0}
            </span>
            <span className="text-xs uppercase text-muted-foreground">
              {status.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DateCalendarStats;
