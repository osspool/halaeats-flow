
import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar } from 'lucide-react';
import { AvailableDate } from '@/types';
import { cn } from '@/lib/utils';

interface MenuDatePickerProps {
  availableDates: AvailableDate[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const MenuDatePicker = ({ availableDates, selectedDate, onSelectDate }: MenuDatePickerProps) => {
  const [dateOptions, setDateOptions] = useState<{ date: string; dayOfWeek: string }[]>([]);
  
  useEffect(() => {
    // Group dates by day of week
    const options = availableDates.map(({ date }) => {
      const parsedDate = parseISO(date);
      const dayOfWeek = format(parsedDate, 'EEEE'); // Get day name (Monday, Tuesday, etc.)
      
      return { date, dayOfWeek };
    });
    
    setDateOptions(options);
  }, [availableDates]);
  
  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <Calendar className="h-5 w-5 text-primary mr-2" />
        <h3 className="text-lg font-medium">Serving Days</h3>
        <span className="ml-2 text-sm text-halaeats-500">(all dishes shown regardless of availability)</span>
      </div>
      
      <div className="flex flex-wrap gap-2 md:gap-3">
        {Array.from(new Set(dateOptions.map(option => option.dayOfWeek))).map(dayOfWeek => {
          // Find the first date that corresponds to this day of week
          const relevantDate = dateOptions.find(option => option.dayOfWeek === dayOfWeek)?.date || '';
          const isSelected = selectedDate && format(parseISO(selectedDate), 'EEEE') === dayOfWeek;
          
          return (
            <button
              key={dayOfWeek}
              onClick={() => {
                // If this day is selected, find the date that matches this day of week and select it
                if (relevantDate) {
                  onSelectDate(relevantDate);
                }
              }}
              className={cn(
                "py-2 px-4 rounded-full border transition-all",
                isSelected
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-halaeats-700 border-halaeats-200 hover:border-primary/50"
              )}
            >
              <span className="text-sm font-medium">{dayOfWeek}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MenuDatePicker;
