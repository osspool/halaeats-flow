
import { MenuItem } from "./index";

export enum DishVisibility {
  PUBLIC = 'public',
  DRAFT = 'draft',
}

export enum DishType {
  APPETIZER = 'appetizer',
  MAIN_COURSE = 'main_course',
  DESSERT = 'dessert',
  BEVERAGE = 'beverage',
  SIDE_DISH = 'side_dish',
  SPECIAL = 'special'
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
}

export interface DailyAvailability {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  time_slots: TimeSlot[];
}

// Update the DishCreateRequest interface to align with the new schema
export interface DishCreateRequest {
  name: string;
  price: number;
  description: string;
  category?: string; // For backward compatibility
  dishType: DishType;
  dietary: string[];
  featured?: boolean;
  visibility?: DishVisibility;
  isSpicy?: boolean;
  maxOrdersPerDay?: number;
  availability?: DailyAvailability[];
}

export interface TimeSlotCapacity {
  [timeSlot: string]: {
    capacity: number;
    booked: number;
  };
}

export interface RestaurantMenu {
  dishes: MenuItem[];
  availableTimeSlots: string[]; // Available time slots
  timeSlotCapacities: TimeSlotCapacity; // Added capacity information
}

// Request types for API calls
export interface TimeSlotUpdateRequest {
  timeSlots: string[];
  capacities?: TimeSlotCapacity;
}

export interface BookTimeSlotRequest {
  timeSlot: string;
  date: string;
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
