import React from "react";
import { cn } from "@/lib/utils";
import TimeSlotItem from "./TimeSlotItem";
import { TimeSlotSelectorProps } from "./types";
import { Label } from "@/components/ui/label";

const TimeSlotSelector = ({
  slots,
  selectedSlot,
  onSelectSlot,
  renderSlot,
  emptyMessage = "No time slots available",
  showCapacity = true,
  layout = "grid",
  label,
  className,
  disabled = false
}: TimeSlotSelectorProps) => {
  // Check if a slot is full
  const isSlotFull = (slotId: string) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot) return false;
    return slot.booked >= slot.capacity;
  };

  // Layout class based on the layout prop
  const layoutClass = layout === "grid" 
    ? "grid grid-cols-1 sm:grid-cols-2 gap-3" 
    : "flex flex-col space-y-2";

  return (
    <div className={cn("space-y-4", className)}>
      {label && (
        <div className="text-sm font-medium mb-2">
          <Label>{label}</Label>
        </div>
      )}
      
      {slots.length === 0 ? (
        <div className="text-center p-4 border rounded-md text-gray-500">
          {emptyMessage}
        </div>
      ) : (
        <div className={layoutClass}>
          {slots.map(slot => {
            const isSelected = selectedSlot === slot.id;
            const isFull = slot.booked >= slot.capacity;
            
            // If custom renderer is provided, use that
            if (renderSlot) {
              return (
                <div key={slot.id} onClick={() => !isFull && !disabled && onSelectSlot(slot.id)}>
                  {renderSlot(slot, isSelected, isFull)}
                </div>
              );
            }
            
            // Otherwise use the default time slot item
            return (
              <TimeSlotItem
                key={slot.id}
                slot={slot}
                isSelected={isSelected}
                isFull={isFull}
                onSelect={() => onSelectSlot(slot.id)}
                showCapacity={showCapacity}
                disabled={disabled}
              />
            );
          })}
        </div>
      )}
      
      {slots.length > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          * Time slots with limited availability may fill up quickly.
        </div>
      )}
    </div>
  );
};

export default TimeSlotSelector;
