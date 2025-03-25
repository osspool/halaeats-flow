
import React, { useState, useEffect } from "react";
import { format, parseISO, isToday, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, Clock, Users, Utensils, CreditCard, Check, X, Calendar, ChevronRight, ChevronLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { restaurantService } from "@/services/restaurantService";
import { Order } from "@/types/restaurant";
import { useIsMobile } from "@/hooks/use-mobile";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const OrderCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const isMobile = useIsMobile();

  // Format selected date as ISO string for API
  const formattedDate = selectedDate 
    ? format(selectedDate, 'yyyy-MM-dd') 
    : format(new Date(), 'yyyy-MM-dd');

  // Query to fetch dates with orders
  const orderDatesQuery = useQuery({
    queryKey: ['order-dates'],
    queryFn: () => restaurantService.getOrderDates(),
  });

  // Query to fetch orders for selected date
  const ordersQuery = useQuery({
    queryKey: ['orders', formattedDate],
    queryFn: () => restaurantService.getOrdersByDate(formattedDate),
    enabled: !!formattedDate,
  });

  // Filter orders by status if a filter is active
  const filteredOrders = ordersQuery.data?.orders.filter(order => 
    statusFilter ? order.status === statusFilter : true
  ) || [];

  // Count orders by status
  const orderCounts = {
    total: ordersQuery.data?.total || 0,
    pending: ordersQuery.data?.orders.filter(order => order.status === 'pending').length || 0,
    confirmed: ordersQuery.data?.orders.filter(order => order.status === 'confirmed').length || 0,
    completed: ordersQuery.data?.orders.filter(order => order.status === 'completed').length || 0,
    cancelled: ordersQuery.data?.orders.filter(order => order.status === 'cancelled').length || 0,
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    
    if (date) {
      // Reset status filter when selecting a new date
      setStatusFilter(null);
    }
  };

  // Open dialog with order details
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  // Get status badge with appropriate color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case "confirmed":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Confirmed</Badge>;
      case "completed":
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500 hover:bg-red-600">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Get payment status badge
  const getPaymentBadge = (status: string) => {
    return status === 'paid' 
      ? <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>
      : <Badge className="bg-orange-500 hover:bg-orange-600">Unpaid</Badge>;
  };

  // Function to identify dates with orders for the calendar
  const getDatesWithOrders = () => {
    if (!orderDatesQuery.data) return [];
    
    return orderDatesQuery.data.dates.map(orderDate => parseISO(orderDate.date));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-1 gap-6">
        {/* Calendar Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5" />
              Select Date
            </CardTitle>
            <CardDescription>
              Dates with orders are highlighted
            </CardDescription>
          </CardHeader>
          <CardContent>
            {orderDatesQuery.isLoading ? (
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[300px] w-full rounded-md" />
              </div>
            ) : (
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="p-3 pointer-events-auto rounded-md border"
                modifiers={{
                  booked: getDatesWithOrders(),
                  today: [new Date()]
                }}
                modifiersStyles={{
                  booked: {
                    fontWeight: "bold",
                    borderBottom: "2px solid #3b82f6",
                    color: "#2563eb"
                  },
                  today: {
                    fontWeight: "bold",
                    border: "2px solid #10b981"
                  }
                }}
              />
            )}
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <div className="h-3 w-3 rounded-full border-2 border-blue-500 mr-2"></div>
                <span>Dates with orders</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <div className="h-3 w-3 rounded-full border-2 border-green-500 mr-2"></div>
                <span>Today</span>
              </div>
            </div>
          </CardContent>
        </Card>

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
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 px-6 py-3 border-b">
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{orderCounts.total}</span>
                <span className="text-xs uppercase text-muted-foreground">Total</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-yellow-500">{orderCounts.pending}</span>
                <span className="text-xs uppercase text-muted-foreground">Pending</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-blue-500">{orderCounts.confirmed}</span>
                <span className="text-xs uppercase text-muted-foreground">Confirmed</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-green-500">{orderCounts.completed}</span>
                <span className="text-xs uppercase text-muted-foreground">Completed</span>
              </div>
            </div>
            
            {/* Orders Table */}
            {ordersQuery.isLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col space-y-3">
                    <Skeleton className="h-12 w-full rounded-md" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {filteredOrders.length > 0 ? (
                  <div className="px-6 overflow-auto max-h-[400px]">
                    <Table>
                      <TableHeader className="sticky top-0 bg-card z-10">
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead className="hidden md:table-cell">Items</TableHead>
                          <TableHead className="hidden md:table-cell">Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="hidden md:table-cell">Payment</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order) => (
                          <TableRow key={order.id} className="hover:bg-muted/50">
                            <TableCell>
                              <div className="flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                {order.time}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Users className="mr-1 h-3 w-3" />
                                {order.customer.name}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="flex items-center">
                                <Utensils className="mr-1 h-3 w-3" />
                                {order.items.length} items
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="flex items-center">
                                <CreditCard className="mr-1 h-3 w-3" />
                                ${order.total.toFixed(2)}
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                            <TableCell className="hidden md:table-cell">{getPaymentBadge(order.paymentStatus)}</TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleViewDetails(order)}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground">No orders found for this date{statusFilter ? ` with status: ${statusFilter}` : ''}.</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder && `Order #${selectedOrder.id} - ${format(parseISO(selectedOrder.date), 'MMM d, yyyy')} at ${selectedOrder.time}`}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">Customer</h3>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customer.name}</p>
                  {selectedOrder.customer.email && (
                    <p className="text-sm text-muted-foreground">{selectedOrder.customer.email}</p>
                  )}
                  {selectedOrder.customer.phone && (
                    <p className="text-sm text-muted-foreground">{selectedOrder.customer.phone}</p>
                  )}
                </div>
                <div className="text-right">
                  <h3 className="font-medium">Status</h3>
                  <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                  <div className="mt-1">{getPaymentBadge(selectedOrder.paymentStatus)}</div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Order Items</h3>
                <div className="bg-muted p-3 rounded-md space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 font-medium flex justify-between">
                    <span>Total</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <h3 className="font-medium mb-1">Notes</h3>
                  <p className="text-sm bg-muted p-3 rounded-md">{selectedOrder.notes}</p>
                </div>
              )}

              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                <div className="space-x-2">
                  {selectedOrder.status === 'pending' && (
                    <Button>Confirm Order</Button>
                  )}
                  {(selectedOrder.status === 'pending' || selectedOrder.status === 'confirmed') && (
                    <Button variant="destructive">Cancel Order</Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderCalendar;
