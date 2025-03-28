
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
  payment_id?: string; // Stripe payment intent ID
}

export interface DeliveryPaymentSplit {
  total_amount: number;
  delivery_fee: number;
  restaurant_amount: number;
  tip_amount: number;
  tax_amount: number;
}

// New types for payment processing with delivery
export interface DeliveryPayment {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  payment_method_id: string;
  payment_method_type: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  created_at: string;
  updated_at: string;
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
  stripe_account_id?: string; // Connected Stripe account ID for payouts
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
  payment_id?: string; // Single payment for the entire batch
}

// Type for payout information
export interface DeliveryPayout {
  id: string;
  store_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'in_transit' | 'paid' | 'failed';
  payout_method: 'bank_account' | 'debit_card' | 'check';
  payout_method_details?: {
    bank_name?: string;
    last4?: string;
    routing_number?: string;
  };
  created_at: string;
  arrival_date?: string;
  orders: string[]; // Array of order IDs included in this payout
}
