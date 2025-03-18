
export interface Caterer {
  id: string;
  name: string;
  profileImage: string;
  coverImage: string;
  description: string;
  rating: number;
  reviewCount: number;
  cuisine: string[];
  location: string;
  deliveryFee: number;
  minimumOrder: number;
  preparationTime: string;
  isOpen: boolean;
  availableDates: AvailableDate[];
}

export interface AvailableDate {
  date: string; // ISO date string
  availableTimeSlots: TimeSlot[];
  menu: MenuItem[];
}

export interface TimeSlot {
  id: string;
  startTime: string; // 24hr format "14:00"
  endTime: string; // 24hr format "18:00"
  available: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  dietary: string[];
  featured: boolean;
  availableDates: string[]; // ISO date strings
  availableForDates?: string[]; // Dates this item is available (for frontend filtering)
  customizations?: MenuItemCustomization[];
}

export interface MenuItemCustomization {
  id: string;
  name: string;
  required: boolean;
  multiple: boolean;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedDate: string; // ISO date string
  selectedTimeSlot: TimeSlot;
  customizations: SelectedCustomization[];
  caterer: {
    id: string;
    name: string;
  };
  subtotal: number;
}

export interface SelectedCustomization {
  customizationId: string;
  optionIds: string[];
}

export interface OrderSummary {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
}

export interface DeliveryInfo {
  address: string;
  city: string;
  zipCode: string;
  instructions: string;
}

export type OrderType = 'delivery' | 'pickup';
