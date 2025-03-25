
import React, { useState } from "react";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, Clock, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
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
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// Mock data for orders
const mockOrders = [
  {
    id: "ord-001",
    date: addDays(new Date(), 1),
    time: "12:30",
    customer: "John Doe",
    items: ["Pasta Carbonara", "Caesar Salad"],
    total: 42.99,
    status: "confirmed"
  },
  {
    id: "ord-002",
    date: addDays(new Date(), 1),
    time: "18:45",
    customer: "Jane Smith",
    items: ["Margherita Pizza", "Tiramisu"],
    total: 28.50,
    status: "confirmed"
  },
  {
    id: "ord-003",
    date: addDays(new Date(), 3),
    time: "19:15",
    customer: "Robert Johnson",
    items: ["Chicken Curry", "Naan", "Mango Lassi"],
    total: 35.75,
    status: "pending"
  },
  {
    id: "ord-004",
    date: addDays(new Date(), 5),
    time: "13:00",
    customer: "Sarah Williams",
    items: ["Sushi Combo", "Miso Soup"],
    total: 48.25,
    status: "confirmed"
  },
  {
    id: "ord-005",
    date: addDays(new Date(), 5),
    time: "20:30",
    customer: "Michael Brown",
    items: ["Steak", "Red Wine"],
    total: 65.00,
    status: "pending"
  }
];

const OrderCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<any[]>([]);

  // Function to highlight dates with orders
  const getDaysWithOrders = () => {
    const month = selectedDate ? selectedDate : new Date();
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const days = eachDayOfInterval({ start, end });
    
    return days.map(day => {
      const hasOrders = mockOrders.some(order => isSameDay(order.date, day));
      return {
        date: day,
        hasOrders
      };
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    
    if (date) {
      const ordersForDay = mockOrders.filter(order => 
        isSameDay(order.date, date)
      );
      
      if (ordersForDay.length > 0) {
        setSelectedOrders(ordersForDay);
        setIsDialogOpen(true);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5" />
            Select Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="p-3 pointer-events-auto"
            modifiers={{
              hasOrders: getDaysWithOrders()
                .filter(day => day.hasOrders)
                .map(day => day.date)
            }}
            modifiersStyles={{
              hasOrders: {
                backgroundColor: "#f0f9ff",
                fontWeight: "bold",
                borderBottom: "2px solid #3b82f6"
              }
            }}
          />
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              • Dates with orders are highlighted in blue
            </p>
            <p className="text-sm text-muted-foreground">
              • Click on a date to view orders
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>
            Orders Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-3 shadow-sm">
              <div className="text-2xl font-bold">{mockOrders.length}</div>
              <p className="text-xs uppercase text-muted-foreground">Total Orders</p>
            </div>
            <div className="rounded-lg border p-3 shadow-sm">
              <div className="text-2xl font-bold">
                {mockOrders.filter(order => order.status === "confirmed").length}
              </div>
              <p className="text-xs uppercase text-muted-foreground">Confirmed</p>
            </div>
            <div className="rounded-lg border p-3 shadow-sm">
              <div className="text-2xl font-bold">
                {mockOrders.filter(order => order.status === "pending").length}
              </div>
              <p className="text-xs uppercase text-muted-foreground">Pending</p>
            </div>
          </div>

          <Table className="mt-6">
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrders.slice(0, 5).map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{format(order.date, "MMM dd, yyyy")}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {order.time}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="mr-1 h-3 w-3" />
                      {order.customer}
                    </div>
                  </TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Orders for {selectedDate ? format(selectedDate, "MMMM d, yyyy") : ""}
            </DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.time}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside">
                      {order.items.map((item: string, idx: number) => (
                        <li key={idx} className="text-sm">{item}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderCalendar;
