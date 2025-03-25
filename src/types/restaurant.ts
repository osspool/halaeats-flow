
import { MenuItem } from "./index";

export interface TimeSlotSettings {
  dayOfWeek: string;
  timeSlots: string[];
}

export interface DishAvailability {
  [dishId: string]: {
    [day: string]: string[];
  };
}

export interface TimeSlotCapacity {
  [timeSlot: string]: {
    capacity: number;
    booked: number;
  };
}

export interface RestaurantMenu {
  dishes: MenuItem[];
  availability: DishAvailability;
  availableTimeSlots: string[]; // Available time slots
  timeSlotCapacities: TimeSlotCapacity; // Added capacity information
}

export interface AvailabilityUpdateRequest {
  dishId: string;
  availability: {
    [day: string]: string[];
  };
}

export interface DishCreateRequest {
  name: string;
  price: number;
  description: string;
  category: string;
  dietary: string[];
}

export interface TimeSlotUpdateRequest {
  timeSlots: string[];
  capacities?: TimeSlotCapacity; // Added capacities field
}

// Order related types
export interface OrderItem {
  id: string;
  dishId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;       // ISO date string
  time: string;       // Time in format "HH:MM"
  customer: {
    id: string;
    name: string;
    phone?: string;
    email?: string;
  };
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  paymentMethod: 'card' | 'cash' | 'online';
  paymentStatus: 'paid' | 'unpaid';
}

// Use the common DateWithCount interface for order dates
export interface OrderDate {
  date: string;       // ISO date string
  orderCount: number; // Number of orders on this date
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
}

export interface OrderDatesResponse {
  dates: OrderDate[];
  total: number;
}

// Reuse the DateWithCount interface from our shared calendar types
import { DateWithCount } from "@/components/shared/calendar/types";
export type { DateWithCount };
