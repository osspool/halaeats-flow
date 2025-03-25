
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

export interface RestaurantMenu {
  dishes: MenuItem[];
  availability: DishAvailability;
  availableTimeSlots: string[]; // Added this to store custom time slots
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
