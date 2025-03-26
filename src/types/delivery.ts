export interface DeliveryQuote {
  id: string;
  fee: number;
  estimated_delivery_time: string; // ISO string
  expires_at: string; // ISO string
  status: 'active' | 'expired' | 'fulfilled';
  pickup_address: string;
  delivery_address: string;
  distance_miles: number;
  created_at: string; // ISO string
  time_slot?: string | null; // Added time slot field
}

export interface DeliveryOrder {
  id: string;
  quote_id: string;
  status: 'pending' | 'accepted' | 'picked_up' | 'delivered' | 'canceled';
  tracking_url?: string;
  driver_name?: string;
  driver_phone?: string;
  created_at: string; // ISO string
  updated_at: string; // ISO string
  time_slot?: string | null; // Added time slot from quote
}

export interface DeliveryPaymentSplit {
  total_amount: number;
  delivery_fee: number;
  restaurant_amount: number;
  tip_amount: number;
  tax_amount: number;
}

// New types for store management
export interface DeliveryStore {
  id: string;
  external_id: string; // Your system's ID (caterer ID)
  name: string;
  address: DeliveryAddress;
  business_hours: BusinessHours[];
  phone_number: string;
  email?: string;
  pickup_instructions?: string;
  average_preparation_time: number; // In minutes
  status: 'active' | 'inactive' | 'pending';
  created_at: string; // ISO string
  updated_at: string; // ISO string
}

export interface DeliveryAddress {
  street: string;
  street2?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface BusinessHours {
  day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  open_time: string; // 24-hour format: "HH:MM"
  close_time: string; // 24-hour format: "HH:MM"
  is_closed: boolean;
}

// Type for batch orders
export interface DeliveryBatch {
  id: string;
  store_id: string;
  orders: DeliveryOrder[];
  status: 'pending' | 'in_progress' | 'completed' | 'canceled';
  pickup_time: string; // ISO string
  created_at: string; // ISO string
  updated_at: string; // ISO string
}
