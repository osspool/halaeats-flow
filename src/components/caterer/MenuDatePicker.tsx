
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
      
      <div className="mt-6">
        <h4 className="text-sm font-medium mb-3">Available Time Slots</h4>
        <div className="flex flex-wrap gap-2">
          {availableDates
            .find(d => d.date === selectedDate)
            ?.availableTimeSlots.map(slot => (
              <div 
                key={slot.id}
                className={cn(
                  "py-2 px-4 rounded-lg border text-sm",
                  slot.available
                    ? "bg-white border-halaeats-200 hover:border-primary/50 cursor-pointer"
                    : "bg-halaeats-50 border-halaeats-100 text-halaeats-400 cursor-not-allowed"
                )}
              >
                {slot.startTime} - {slot.endTime}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MenuDatePicker;
