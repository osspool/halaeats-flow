
import React from "react";

const CalendarLegend = () => {
  return (
    <div className="px-6 pb-6 pt-2 space-y-3">
      <div className="flex items-center text-sm text-muted-foreground">
        <div className="h-3 w-3 rounded-md bg-amber-500/20 border border-amber-500 mr-2"></div>
        <span>Dates with items</span>
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <div className="h-3 w-3 rounded-md bg-green-500/20 border border-green-500 mr-2"></div>
        <span>Today</span>
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <div className="h-3 w-3 rounded-md bg-primary border border-primary mr-2"></div>
        <span>Selected date</span>
      </div>
    </div>
  );
};

export default CalendarLegend;
