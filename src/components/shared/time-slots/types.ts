
import { ReactNode } from "react";

export interface TimeSlot {
  id: string;
  time: string;
  capacity: number;
  booked: number;
}

export interface TimeSlotSelectorProps {
  /**
   * Array of time slots to display
   */
  slots: TimeSlot[];
  
  /**
   * Currently selected time slot
   */
  selectedSlot?: string | null;
  
  /**
   * Callback when a time slot is selected
   */
  onSelectSlot: (slotId: string) => void;
  
  /**
   * Optional custom renderer for each time slot
   */
  renderSlot?: (slot: TimeSlot, isSelected: boolean, isFull: boolean) => ReactNode;
  
  /**
   * Text to display when no slots are available
   */
  emptyMessage?: string;
  
  /**
   * Whether to show the capacity indicator
   */
  showCapacity?: boolean;
  
  /**
   * Layout orientation
   */
  layout?: 'grid' | 'list';
  
  /**
   * Optional label for the time slot selector
   */
  label?: string;
  
  /**
   * Optional className for the container
   */
  className?: string;
  
  /**
   * Disabled state
   */
  disabled?: boolean;
}

export interface TimeSlotItemProps {
  slot: TimeSlot;
  isSelected: boolean;
  isFull: boolean;
  onSelect: () => void;
  showCapacity?: boolean;
  disabled?: boolean;
}
