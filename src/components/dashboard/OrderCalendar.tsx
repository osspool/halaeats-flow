
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useOrderDatesForMonth, useOrdersByDate } from "@/hooks/useRestaurantApi";
import { Order } from "@/types/restaurant";
import DateCalendar from "@/components/shared/calendar/DateCalendar";
import OrdersList from "./orders/OrdersList";
import OrderDetailsDialog from "./orders/OrderDetailsDialog";
import { useDateItemsData } from "@/hooks/useDateItemsData";

// Define status options for restaurant orders
const orderStatusOptions = [
  { value: "pending", label: "Pending", textColor: "text-yellow-500" },
  { value: "confirmed", label: "Confirmed", textColor: "text-blue-500" },
  { value: "completed", label: "Completed", textColor: "text-green-500" }
];

const OrderCalendar = () => {
  // State for order management
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Use our custom hook for date management
  const {
    currentMonth,
    selectedDate,
    statusFilter,
    formattedSelectedDate,
    handleMonthChange,
    handleDateSelect,
    handleStatusFilter
  } = useDateItemsData({
    fetchItemsForDate: async () => ({ items: [], total: 0 }),
    fetchDatesWithItems: async () => ({ dates: [], total: 0 })
  });

  // Query to fetch dates with orders for the current month view
  const orderDatesQuery = useOrderDatesForMonth(currentMonth);

  // Query to fetch orders for selected date with optional status filter
  const ordersQuery = useOrdersByDate(
    formattedSelectedDate, 
    statusFilter || undefined
  );

  // Filter orders based on customer name search
  const filteredOrders = ordersQuery.data?.orders.filter(order => {
    if (!searchQuery.trim()) return true;
    return order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  // Count orders by status (using filtered orders)
  const orderCounts = {
    total: filteredOrders.length,
    pending: filteredOrders.filter(order => order.status === 'pending').length,
    confirmed: filteredOrders.filter(order => order.status === 'confirmed').length,
    completed: filteredOrders.filter(order => order.status === 'completed').length,
  };

  // Open dialog with order details
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  // Handle date selection with search reset
  const handleOrderDateSelect = (date: Date | undefined) => {
    handleDateSelect(date);
    setSearchQuery(""); // Reset search when changing date
  };

  // Convert API response to the format expected by our component
  const mapOrderDates = () => {
    if (!orderDatesQuery.data?.dates) return [];
    return orderDatesQuery.data.dates.map(dateItem => ({
      date: dateItem.date,
      count: dateItem.orderCount
    }));
  };

  // Custom render function for the orders content
  const renderOrdersContent = (
    selectedDate: Date | undefined, 
    isLoading: boolean, 
    statusFilter: string | null,
    onFilterChange: (filter: string | null) => void,
    itemCounts: Record<string, number>
  ) => {
    return (
      <>
        {/* Customer Search Input */}
        <div className="px-6 py-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
        </div>
        
        {/* Orders List */}
        <OrdersList 
          orders={filteredOrders}
          onViewDetails={handleViewDetails}
          isLoading={ordersQuery.isLoading}
        />
      </>
    );
  };

  return (
    <>
      <DateCalendar
        selectedDate={selectedDate}
        onDateSelect={handleOrderDateSelect}
        currentMonth={currentMonth}
        onMonthChange={handleMonthChange}
        dateItems={mapOrderDates()}
        isLoadingDates={orderDatesQuery.isLoading}
        title="Orders"
        description={`${filteredOrders.length} ${searchQuery ? "matching " : ""}orders for this date`}
        statusOptions={orderStatusOptions}
        defaultStatusCounts={orderCounts}
        renderContent={renderOrdersContent}
      />

      {/* Order Details Dialog */}
      <OrderDetailsDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        order={selectedOrder}
      />
    </>
  );
};

export default OrderCalendar;
