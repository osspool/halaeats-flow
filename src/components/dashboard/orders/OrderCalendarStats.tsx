
import React from "react";

interface OrderStatsProps {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
}

const OrderCalendarStats = ({ total, pending, confirmed, completed }: OrderStatsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 px-6 py-3 border-b">
      <div className="flex flex-col">
        <span className="text-2xl font-bold">{total}</span>
        <span className="text-xs uppercase text-muted-foreground">Total</span>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-yellow-500">{pending}</span>
        <span className="text-xs uppercase text-muted-foreground">Pending</span>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-blue-500">{confirmed}</span>
        <span className="text-xs uppercase text-muted-foreground">Confirmed</span>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-green-500">{completed}</span>
        <span className="text-xs uppercase text-muted-foreground">Completed</span>
      </div>
    </div>
  );
};

export default OrderCalendarStats;
