
import { useState } from 'react';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { DateWithCount } from '@/components/shared/calendar/types';

export interface DateDataProvider<TItem> {
  fetchItemsForDate: (date: string, filter?: string | null) => Promise<{ items: TItem[]; total: number }>;
  fetchDatesWithItems: (startDate: string, endDate: string) => Promise<{ dates: DateWithCount[]; total: number }>;
}

export function useDateItemsData<TItem>(dataProvider: DateDataProvider<TItem>) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Calculate date range for the current month
  const startDate = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
  const endDate = format(endOfMonth(currentMonth), 'yyyy-MM-dd');
  const formattedSelectedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';

  // Function to handle month change
  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month);
  };

  // Function to handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  // Function to handle status filtering
  const handleStatusFilter = (filter: string | null) => {
    setStatusFilter(filter);
  };

  return {
    currentMonth,
    selectedDate,
    statusFilter,
    startDate,
    endDate,
    formattedSelectedDate,
    handleMonthChange,
    handleDateSelect,
    handleStatusFilter,
  };
}
