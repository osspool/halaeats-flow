
import React from "react";
import { DateCalendarStats } from "@/components/shared/calendar";

// Define order status options
const orderStatusOptions = [
  { value: "pending", label: "Pending", textColor: "text-yellow-500" },
  { value: "confirmed", label: "Confirmed", textColor: "text-blue-500" },
  { value: "completed", label: "Completed", textColor: "text-green-500" }
];

interface OrderStatsProps {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  currentFilter?: string | null;
  onFilterChange?: (filter: string | null) => void;
}

const OrderCalendarStats = ({ 
  total, 
  pending, 
  confirmed, 
  completed,
  currentFilter = null,
  onFilterChange = () => {}
}: OrderStatsProps) => {
  const counts = {
    total,
    pending,
    confirmed,
    completed
  };
  
  return (
    <DateCalendarStats
      statusOptions={orderStatusOptions}
      currentFilter={currentFilter}
      onFilterChange={onFilterChange}
      itemCounts={counts}
    />
  );
};

export default OrderCalendarStats;
