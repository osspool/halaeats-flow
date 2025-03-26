
import { DeliveryQuote, DeliveryOrder, DeliveryPaymentSplit } from '@/types/delivery';
import { Address } from '@/types/checkout';
import { addMinutes, formatISO, parseISO, format } from 'date-fns';

// Mock restaurant address 
const RESTAURANT_ADDRESS = '123 Food Street, San Francisco, CA 94105';

// Calculate a delivery fee based on address distance and time slot (mock implementation)
const calculateDeliveryFee = (address: Address, timeSlot?: string): number => {
  // Simple mock calculation based on zip code
  const zipCodeLastDigit = parseInt(address.zipCode.charAt(address.zipCode.length - 1));
  
  // Base fee + variable component based on zip code
  let fee = 3.99 + (zipCodeLastDigit * 0.5);
  
  // Add time-based pricing - peak hours cost more
  if (timeSlot) {
    if (timeSlot.includes('18:00') || timeSlot.includes('19:00')) {
      // Dinner rush hour premium
      fee += 1.50;
    } else if (timeSlot.includes('12:00') || timeSlot.includes('13:00')) {
      // Lunch rush hour premium
      fee += 1.00;
    } else if (timeSlot.includes('21:00') || timeSlot.includes('22:00')) {
      // Late night premium
      fee += 0.75;
    }
  }
  
  return parseFloat(fee.toFixed(2));
};

// Calculate estimated delivery time based on the selected time slot
const calculateEstimatedDeliveryTime = (timeSlot?: string): string => {
  if (!timeSlot) {
    // Default: 20-40 mins from now if no time slot
    const minMinutes = 20;
    const maxMinutes = 40;
    const randomMinutes = Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) + minMinutes;
    return formatISO(addMinutes(new Date(), randomMinutes));
  }
  
  try {
    // Parse the time slot format (e.g., "18:00-21:00")
    const [startTime] = timeSlot.split('-');
    const [hours, minutes] = startTime.split(':').map(Number);
    
    // Create a date object for today with the start time from the slot
    const today = new Date();
    const deliveryDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      hours,
      minutes
    );
    
    // Add 15-30 minutes for delivery within the time slot
    const additionalMinutes = Math.floor(Math.random() * 16) + 15; // 15-30 minutes
    return formatISO(addMinutes(deliveryDate, additionalMinutes));
  } catch (error) {
    console.error('Error parsing time slot:', timeSlot, error);
    // Fallback to default behavior
    const randomMinutes = Math.floor(Math.random() * 21) + 20; // 20-40 minutes
    return formatISO(addMinutes(new Date(), randomMinutes));
  }
};

// Calculate distance in miles (mock)
const calculateDistance = (address: Address): number => {
  // Mock distance calculation based on zip code
  const zipCodeLastDigit = parseInt(address.zipCode.charAt(address.zipCode.length - 1));
  return 1.5 + (zipCodeLastDigit * 0.7);
};

/**
 * Create a delivery quote (similar to DoorDash quoting API)
 */
export const createDeliveryQuote = async (address: Address, timeSlot?: string): Promise<DeliveryQuote> => {
  console.log('Creating delivery quote for address:', address, 'time slot:', timeSlot || 'not specified');
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const now = new Date();
  const expiresAt = addMinutes(now, 5); // Quote expires in 5 minutes
  
  const addressString = `${address.street}${address.apt ? ', ' + address.apt : ''}, ${address.city}, ${address.state} ${address.zipCode}`;
  const fee = calculateDeliveryFee(address, timeSlot);
  const distance = calculateDistance(address);
  
  const quote = {
    id: `dq_${Math.random().toString(36).substring(2, 10)}`,
    fee,
    estimated_delivery_time: calculateEstimatedDeliveryTime(timeSlot),
    expires_at: formatISO(expiresAt),
    status: 'active' as const,
    pickup_address: RESTAURANT_ADDRESS,
    delivery_address: addressString,
    distance_miles: distance,
    created_at: formatISO(now),
    time_slot: timeSlot || null
  };
  
  console.log('Created delivery quote:', quote);
  return quote;
};

/**
 * Create a delivery order (similar to DoorDash fulfillment API)
 */
export const createDeliveryOrder = async (
  quoteId: string, 
  address: Address,
  paymentIntentId: string
): Promise<DeliveryOrder> => {
  console.log('Creating delivery order with quote ID:', quoteId);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Validate that the quote exists and is active
  // In a real implementation, you would check this with the actual service
  
  const now = new Date();
  
  const order = {
    id: `do_${Math.random().toString(36).substring(2, 10)}`,
    quote_id: quoteId,
    status: 'pending' as const,
    tracking_url: `https://mock-doordash.example.com/track/${quoteId}`,
    created_at: formatISO(now),
    updated_at: formatISO(now),
  };
  
  console.log('Created delivery order:', order);
  return order;
};

/**
 * Calculate payment split between restaurant and delivery service
 */
export const calculatePaymentSplit = (
  subtotal: number,
  deliveryFee: number,
  tipAmount: number = 0,
  taxRate: number = 0.08
): DeliveryPaymentSplit => {
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + deliveryFee + tipAmount + taxAmount;
  
  return {
    total_amount: totalAmount,
    delivery_fee: deliveryFee,
    restaurant_amount: subtotal - (subtotal * 0.15), // Restaurant gets 85% of subtotal
    tip_amount: tipAmount,
    tax_amount: taxAmount,
  };
};

/**
 * Check if a delivery quote is still valid
 */
export const isDeliveryQuoteValid = (quote: DeliveryQuote | null): boolean => {
  if (!quote) {
    console.log('Quote is null, not valid');
    return false;
  }
  
  const now = new Date();
  const expiresAt = new Date(quote.expires_at);
  
  const isValid = expiresAt > now && quote.status === 'active';
  console.log(`Quote validity check: expires at ${expiresAt}, now is ${now}, status is ${quote.status}, isValid: ${isValid}`);
  
  return isValid;
};
