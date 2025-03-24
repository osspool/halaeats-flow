
import { useState, useEffect } from 'react';
import { format, parseISO, isToday, isTomorrow, addDays } from 'date-fns';
import { Calendar } from 'lucide-react';
import { AvailableDate } from '@/types';
import { cn } from '@/lib/utils';

interface MenuDatePickerProps {
  availableDates: AvailableDate[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const MenuDatePicker = ({ availableDates, selectedDate, onSelectDate }: MenuDatePickerProps) => {
  const [dateOptions, setDateOptions] = useState<{ date: string; label: string }[]>([]);
  
  useEffect(() => {
    // Create date options with readable labels
    const options = availableDates.map(({ date }) => {
      const parsedDate = parseISO(date);
      let label = '';
      
      if (isToday(parsedDate)) {
        label = 'Today';
      } else if (isTomorrow(parsedDate)) {
        label = 'Tomorrow';
      } else {
        label = format(parsedDate, 'EEE, MMM d');
      }
      
      return { date, label };
    });
    
    setDateOptions(options);
  }, [availableDates]);
  
  const today = new Date();
  const next7Days = Array.from({ length: 7 }, (_, i) => addDays(today, i));
  
  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <Calendar className="h-5 w-5 text-primary mr-2" />
        <h3 className="text-lg font-medium">Available Dates</h3>
      </div>
      
      <div className="flex overflow-x-auto pb-3 gap-2 md:gap-3">
        {dateOptions.map(({ date, label }) => (
          <button
            key={date}
            onClick={() => onSelectDate(date)}
            className={cn(
              "flex-shrink-0 py-2 px-4 rounded-full border transition-all",
              selectedDate === date
                ? "bg-primary text-white border-primary"
                : "bg-white text-halaeats-700 border-halaeats-200 hover:border-primary/50"
            )}
          >
            <span className="text-sm font-medium">{label}</span>
            <span className="block text-xs">
              {format(parseISO(date), 'MMM d')}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuDatePicker;
