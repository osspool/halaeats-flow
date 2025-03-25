
export interface DateWithCount {
  date: string | Date;
  count: number;
}

export interface DateItemStatus {
  value: string;
  label: string;
  textColor?: string;
  bgColor?: string;
}

export interface DateCalendarBaseProps<TItem> {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  currentMonth: Date;
  onMonthChange: (month: Date) => void;
  dateItems: DateWithCount[] | undefined;
  isLoadingDates: boolean;
  statusOptions?: DateItemStatus[];
  defaultStatusCounts?: Record<string, number>;
}
