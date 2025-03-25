
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
}

export interface DeliveryPaymentSplit {
  total_amount: number;
  delivery_fee: number;
  restaurant_amount: number;
  tip_amount: number;
  tax_amount: number;
}
