
export interface TimeSlot {
  id: string;
  time: string;
  capacity: number;
  booked: number;
}

export interface TimeSlotItemProps {
  slot: TimeSlot;
  isSelected: boolean;
  isFull: boolean;
  onSelect: () => void;
  showCapacity?: boolean;
  disabled?: boolean;
}

export interface TimeSlotSelectorProps {
  slots: TimeSlot[];
  selectedSlot: string | null;
  onSelectSlot: (slotId: string) => void;
  renderSlot?: (slot: TimeSlot, isSelected: boolean, isFull: boolean) => React.ReactNode;
  emptyMessage?: string;
  showCapacity?: boolean;
  layout?: 'grid' | 'list';
  label?: string;
  className?: string;
  disabled?: boolean;
}
