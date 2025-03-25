
import React from "react";
import { format, parseISO } from "date-fns";
import { Order } from "@/types/restaurant";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getStatusBadge, getPaymentBadge } from "./OrderStatusBadges";

interface OrderDetailsDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  order: Order | null;
}

const OrderDetailsDialog = ({ isOpen, setIsOpen, order }: OrderDetailsDialogProps) => {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            {`Order #${order.id} - ${format(parseISO(order.date), 'MMM d, yyyy')} at ${order.time}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium">Customer</h3>
              <p className="text-sm text-muted-foreground">{order.customer.name}</p>
              {order.customer.email && (
                <p className="text-sm text-muted-foreground">{order.customer.email}</p>
              )}
              {order.customer.phone && (
                <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
              )}
            </div>
            <div className="text-right">
              <h3 className="font-medium">Status</h3>
              <div className="mt-1">{getStatusBadge(order.status)}</div>
              <div className="mt-1">{getPaymentBadge(order.paymentStatus)}</div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Order Items</h3>
            <div className="bg-muted p-3 rounded-md space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2 font-medium flex justify-between">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {order.notes && (
            <div>
              <h3 className="font-medium mb-1">Notes</h3>
              <p className="text-sm bg-muted p-3 rounded-md">{order.notes}</p>
            </div>
          )}

          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
            <div className="space-x-2">
              {order.status === 'pending' && (
                <Button>Confirm Order</Button>
              )}
              {(order.status === 'pending' || order.status === 'confirmed') && (
                <Button variant="destructive">Cancel Order</Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
