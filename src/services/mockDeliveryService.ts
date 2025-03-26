
import { 
  DeliveryQuote, 
  DeliveryOrder, 
  DeliveryPaymentSplit, 
  DeliveryBatch, 
  DeliveryStore
} from '@/types/delivery';
import { Address } from '@/types/checkout';
import { addMinutes, formatISO, parseISO, format, isSameDay, isWithinInterval } from 'date-fns';
import { getDeliveryStoreByExternalId } from './mockStoreService';

// In-memory storage for batches, orders and quotes
const deliveryBatches: Map<string, DeliveryBatch> = new Map();
const deliveryOrders: Map<string, DeliveryOrder> = new Map();
const deliveryQuotes: Map<string, DeliveryQuote> = new Map();

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
export const createDeliveryQuote = async (
  address: Address, 
  timeSlot?: string,
  storeId?: string  // Optional store ID
): Promise<DeliveryQuote> => {
  console.log('Creating delivery quote for address:', address, 'time slot:', timeSlot || 'not specified');
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const now = new Date();
  const expiresAt = addMinutes(now, 5); // Quote expires in 5 minutes
  
  const addressString = `${address.street}${address.apt ? ', ' + address.apt : ''}, ${address.city}, ${address.state} ${address.zipCode}`;
  const fee = calculateDeliveryFee(address, timeSlot);
  const distance = calculateDistance(address);
  
  // Get pickup address from store if storeId is provided
  let pickupAddress = '123 Food Street, San Francisco, CA 94105';
  if (storeId) {
    try {
      const store = await getDeliveryStoreByExternalId(storeId);
      if (store) {
        const storeAddress = store.address;
        pickupAddress = `${storeAddress.street}${storeAddress.street2 ? ', ' + storeAddress.street2 : ''}, ${storeAddress.city}, ${storeAddress.state} ${storeAddress.zip_code}`;
      }
    } catch (error) {
      console.error('Error fetching store:', error);
    }
  }
  
  const quoteId = `dq_${Math.random().toString(36).substring(2, 10)}`;
  
  const quote = {
    id: quoteId,
    fee,
    estimated_delivery_time: calculateEstimatedDeliveryTime(timeSlot),
    expires_at: formatISO(expiresAt),
    status: 'active' as const,
    pickup_address: pickupAddress,
    delivery_address: addressString,
    distance_miles: distance,
    created_at: formatISO(now),
    time_slot: timeSlot || null
  };
  
  // Store the quote in our mock database
  deliveryQuotes.set(quoteId, quote);
  
  console.log('Created delivery quote:', quote);
  return quote;
};

/**
 * Create a delivery order (similar to DoorDash fulfillment API)
 */
export const createDeliveryOrder = async (
  quoteId: string, 
  address: Address,
  paymentIntentId: string,
  storeId?: string
): Promise<DeliveryOrder> => {
  console.log('Creating delivery order with quote ID:', quoteId);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Get the quote to access its time slot
  const quote = deliveryQuotes.get(quoteId);
  if (!quote) {
    throw new Error(`Quote with ID ${quoteId} not found`);
  }
  
  const now = new Date();
  const orderId = `do_${Math.random().toString(36).substring(2, 10)}`;
  
  const order = {
    id: orderId,
    quote_id: quoteId,
    status: 'pending' as const,
    tracking_url: `https://mock-doordash.example.com/track/${quoteId}`,
    created_at: formatISO(now),
    updated_at: formatISO(now),
    driver_name: undefined,
    driver_phone: undefined,
    time_slot: quote.time_slot // Copy time slot from quote
  };
  
  // Store the order in our mock database
  deliveryOrders.set(orderId, order);
  
  // Automatically check if this order could be batched with existing orders
  if (storeId && order.time_slot) {
    await tryAutoBatchOrder(orderId, storeId, order.time_slot);
  }
  
  console.log('Created delivery order:', order);
  return order;
};

/**
 * Try to add an order to an existing batch or create a new batch
 * This simulates the DoorDash automatic batching system
 */
const tryAutoBatchOrder = async (
  orderId: string,
  storeId: string,
  timeSlot: string
): Promise<void> => {
  const order = deliveryOrders.get(orderId);
  if (!order) return;
  
  console.log(`Checking if order ${orderId} can be batched for time slot ${timeSlot}`);
  
  // Check if there's an existing batch for this store and time slot
  let existingBatch: DeliveryBatch | undefined;
  
  for (const batch of deliveryBatches.values()) {
    if (batch.store_id === storeId && batch.status === 'pending') {
      // Parse the pickup time to check if it's in the same time slot
      const pickupDate = new Date(batch.pickup_time);
      const [startTime, endTime] = timeSlot.split('-');
      
      // Create date objects for the time slot boundaries
      const today = new Date();
      const slotStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        parseInt(startTime.split(':')[0]),
        parseInt(startTime.split(':')[1])
      );
      
      const slotEnd = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        parseInt(endTime.split(':')[0]),
        parseInt(endTime.split(':')[1])
      );
      
      // Check if the batch pickup time falls within this time slot
      if (isSameDay(pickupDate, today) && 
          isWithinInterval(pickupDate, { start: slotStart, end: slotEnd })) {
        existingBatch = batch;
        break;
      }
    }
  }
  
  if (existingBatch) {
    // Add this order to the existing batch
    console.log(`Adding order ${orderId} to existing batch ${existingBatch.id}`);
    
    const updatedOrders = [...existingBatch.orders, order];
    const updatedBatch = {
      ...existingBatch,
      orders: updatedOrders,
      updated_at: formatISO(new Date())
    };
    
    deliveryBatches.set(existingBatch.id, updatedBatch);
  } else {
    // Create a new batch for this order
    console.log(`Creating new batch for order ${orderId}`);
    
    // Parse the time slot to get a pickup time
    const [startTime] = timeSlot.split('-');
    const [hours, minutes] = startTime.split(':').map(Number);
    
    // Create a date object for today with the start time from the slot
    const today = new Date();
    const pickupTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      hours,
      minutes
    );
    
    const batchId = `batch_${Math.random().toString(36).substring(2, 10)}`;
    const newBatch: DeliveryBatch = {
      id: batchId,
      store_id: storeId,
      orders: [order],
      status: 'pending',
      pickup_time: formatISO(pickupTime),
      created_at: formatISO(new Date()),
      updated_at: formatISO(new Date()),
    };
    
    deliveryBatches.set(batchId, newBatch);
  }
};

/**
 * Create a batch of orders for a specific time slot
 */
export const createDeliveryBatch = async (
  storeId: string,
  orderIds: string[],
  pickupTime: string
): Promise<DeliveryBatch> => {
  console.log('Creating delivery batch for store:', storeId, 'with orders:', orderIds);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const now = new Date();
  
  // Collect the orders
  const batchOrders: DeliveryOrder[] = [];
  for (const orderId of orderIds) {
    const order = deliveryOrders.get(orderId);
    if (order) {
      batchOrders.push(order);
    }
  }
  
  if (batchOrders.length === 0) {
    throw new Error('No valid orders found for batch creation');
  }
  
  const batchId = `batch_${Math.random().toString(36).substring(2, 10)}`;
  const batch: DeliveryBatch = {
    id: batchId,
    store_id: storeId,
    orders: batchOrders,
    status: 'pending',
    pickup_time: pickupTime,
    created_at: formatISO(now),
    updated_at: formatISO(now),
  };
  
  // Store the batch
  deliveryBatches.set(batchId, batch);
  
  console.log('Created delivery batch:', batch);
  return batch;
};

/**
 * Get delivery batches for a store
 */
export const getDeliveryBatches = async (storeId: string): Promise<DeliveryBatch[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const batches: DeliveryBatch[] = [];
  for (const batch of deliveryBatches.values()) {
    if (batch.store_id === storeId) {
      batches.push(batch);
    }
  }
  
  return batches;
};

/**
 * Update a batch status
 */
export const updateDeliveryBatchStatus = async (
  batchId: string,
  status: 'pending' | 'in_progress' | 'completed' | 'canceled'
): Promise<DeliveryBatch | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const batch = deliveryBatches.get(batchId);
  if (!batch) {
    return null;
  }
  
  const updatedBatch = {
    ...batch,
    status,
    updated_at: formatISO(new Date()),
  };
  
  deliveryBatches.set(batchId, updatedBatch);
  console.log(`Updated batch ${batchId} status to ${status}`);
  
  return updatedBatch;
};

/**
 * Get all available orders that could be batched
 */
export const getAvailableOrdersForBatching = async (
  storeId: string,
  timeSlot?: string
): Promise<DeliveryOrder[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const availableOrders: DeliveryOrder[] = [];
  
  // Find orders that aren't already in a batch
  orderLoop: for (const order of deliveryOrders.values()) {
    if (order.status !== 'pending') continue;
    
    // Check if order is already in a batch
    for (const batch of deliveryBatches.values()) {
      if (batch.orders.some(o => o.id === order.id)) {
        continue orderLoop;
      }
    }
    
    // If time slot is specified, filter by that
    if (timeSlot && order.time_slot && order.time_slot !== timeSlot) {
      continue;
    }
    
    // Add to available orders
    availableOrders.push(order);
  }
  
  return availableOrders;
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

/**
 * Get delivery order details
 */
export const getDeliveryOrder = async (orderId: string): Promise<DeliveryOrder | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return deliveryOrders.get(orderId) || null;
};

/**
 * Update order status (for driver updates)
 */
export const updateDeliveryOrderStatus = async (
  orderId: string, 
  status: 'pending' | 'accepted' | 'picked_up' | 'delivered' | 'canceled',
  driverInfo?: { name?: string, phone?: string }
): Promise<DeliveryOrder | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const order = deliveryOrders.get(orderId);
  if (!order) {
    return null;
  }
  
  const updatedOrder = {
    ...order,
    status,
    updated_at: formatISO(new Date()),
    driver_name: driverInfo?.name || order.driver_name,
    driver_phone: driverInfo?.phone || order.driver_phone
  };
  
  deliveryOrders.set(orderId, updatedOrder);
  
  return updatedOrder;
};
