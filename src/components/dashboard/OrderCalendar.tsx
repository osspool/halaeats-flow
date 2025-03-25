
import React, { useState } from "react";
import { format, isToday, startOfMonth, endOfMonth } from "date-fns";
import { Order } from "@/types/restaurant";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Import the refactored components
import CalendarWidget from "./orders/CalendarWidget";
import OrderCalendarStats from "./orders/OrderCalendarStats";
import OrdersList from "./orders/OrdersList";
import OrderDetailsDialog from "./orders/OrderDetailsDialog";

// Import updated hooks
import { useOrderDatesForMonth, useOrdersByDate } from "@/hooks/useRestaurantApi";

const OrderCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date()); // Track current month for calendar
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const isMobile = useIsMobile();

  // Format selected date as ISO string for API
  const formattedDate = selectedDate 
    ? format(selectedDate, 'yyyy-MM-dd') 
    : format(new Date(), 'yyyy-MM-dd');

  // Query to fetch dates with orders for the current month view
  const orderDatesQuery = useOrderDatesForMonth(currentMonth);

  // Query to fetch orders for selected date with optional status filter
  const ordersQuery = useOrdersByDate(
    formattedDate, 
    statusFilter || undefined
  );

  // Count orders by status
  const orderCounts = {
    total: ordersQuery.data?.total || 0,
    pending: ordersQuery.data?.orders.filter(order => order.status === 'pending').length || 0,
    confirmed: ordersQuery.data?.orders.filter(order => order.status === 'confirmed').length || 0,
    completed: ordersQuery.data?.orders.filter(order => order.status === 'completed').length || 0,
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  // Handle month change in calendar
  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month);
  };

  // Open dialog with order details
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-1 gap-6">
        {/* Calendar Card */}
        <CalendarWidget 
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          onMonthChange={handleMonthChange}
          orderDates={orderDatesQuery.data?.dates}
          isLoading={orderDatesQuery.isLoading}
        />

        {/* Orders Overview Card */}
        <Card className="md:col-span-1 lg:col-span-2 xl:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>
                  {selectedDate ? (
                    <>
                      {isToday(selectedDate) ? "Today's Orders" : format(selectedDate, "MMMM d, yyyy")}
                    </>
                  ) : (
                    "Orders Overview"
                  )}
                </CardTitle>
                <CardDescription>
                  {ordersQuery.data?.total} orders for this date
                </CardDescription>
              </div>
              
              {/* Status Filter */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={statusFilter === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(null)}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === "pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("pending")}
                >
                  Pending
                </Button>
                <Button
                  variant={statusFilter === "confirmed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("confirmed")}
                >
                  Confirmed
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {/* Stats Section */}
            <OrderCalendarStats 
              total={orderCounts.total}
              pending={orderCounts.pending}
              confirmed={orderCounts.confirmed}
              completed={orderCounts.completed}
            />
            
            {/* Orders Table */}
            <OrdersList 
              orders={ordersQuery.data?.orders || []}
              onViewDetails={handleViewDetails}
              isLoading={ordersQuery.isLoading}
            />
          </CardContent>
        </Card>
      </div>

      {/* Order Details Dialog */}
      <OrderDetailsDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        order={selectedOrder}
      />
    </div>
  );
};

export default OrderCalendar;
