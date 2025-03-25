
import React, { useState } from "react";
import { format, isToday } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Import our refactored components
import DateCalendarWidget from "./DateCalendarWidget";
import DateCalendarStats from "./DateCalendarStats";
import { DateCalendarBaseProps, DateWithCount, DateItemStatus } from "./types";

interface DateCalendarProps<TItem> extends DateCalendarBaseProps<TItem> {
  title?: string;
  description?: string;
  renderContent: (
    selectedDate: Date | undefined, 
    isLoading: boolean, 
    statusFilter: string | null,
    onFilterChange: (filter: string | null) => void,
    itemCounts: Record<string, number>
  ) => React.ReactNode;
}

function DateCalendar<TItem>({
  selectedDate,
  onDateSelect,
  currentMonth,
  onMonthChange,
  dateItems,
  isLoadingDates,
  title = "Calendar",
  description = "Select a date to view details",
  statusOptions,
  renderContent,
  defaultStatusCounts = {},
}: DateCalendarProps<TItem>) {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Create status counts based on the current data
  const currentStatusCounts = { ...defaultStatusCounts };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-1 gap-6">
        {/* Calendar Widget Card */}
        <DateCalendarWidget
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
          onMonthChange={onMonthChange}
          datesWithItems={dateItems}
          isLoading={isLoadingDates}
          currentMonth={currentMonth}
        />

        {/* Content Overview Card */}
        <Card className="md:col-span-1 lg:col-span-2 xl:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>
                  {selectedDate ? (
                    <>
                      {isToday(selectedDate) ? `Today's ${title}` : format(selectedDate, "MMMM d, yyyy")}
                    </>
                  ) : (
                    `${title} Overview`
                  )}
                </CardTitle>
                <CardDescription>
                  {description}
                </CardDescription>
              </div>
              
              {/* Status Filter Buttons - Only show if status options provided */}
              {statusOptions && statusOptions.length > 0 && (
                <DateCalendarStats
                  statusOptions={statusOptions}
                  currentFilter={statusFilter}
                  onFilterChange={setStatusFilter}
                  itemCounts={currentStatusCounts}
                />
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {/* Dynamic content rendered by parent component */}
            {renderContent(selectedDate, isLoadingDates, statusFilter, setStatusFilter, currentStatusCounts)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DateCalendar;
