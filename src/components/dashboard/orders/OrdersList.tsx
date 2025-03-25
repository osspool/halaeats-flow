
import React from "react";
import { Clock, Users, Utensils, CreditCard } from "lucide-react";
import { Order } from "@/types/restaurant";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStatusBadge, getPaymentBadge } from "./OrderStatusBadges";

interface OrdersListProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
  isLoading: boolean;
}

const OrdersList = ({ orders, onViewDetails, isLoading }: OrdersListProps) => {
  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">No orders found for this date with the selected status.</p>
      </div>
    );
  }

  return (
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
          {orders.map((order) => (
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
                  onClick={() => onViewDetails(order)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersList;
