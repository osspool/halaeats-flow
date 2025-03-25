
import React from "react";
import { Badge } from "@/components/ui/badge";

export const getStatusBadge = (status: string) => {
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

export const getPaymentBadge = (status: string) => {
  return status === 'paid' 
    ? <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>
    : <Badge className="bg-orange-500 hover:bg-orange-600">Unpaid</Badge>;
};
