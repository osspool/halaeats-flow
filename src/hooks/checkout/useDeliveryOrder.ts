
import { useCallback } from 'react';
import { createDeliveryOrder } from '@/services/mockDeliveryService';
import { mockAddresses } from '@/data/checkoutMockData';
import { DeliveryQuote, DeliveryOrder } from '@/types/delivery';

/**
 * Hook for handling delivery order creation
 */
export const useDeliveryOrder = () => {
  const createOrder = useCallback(async (
    selectedAddressId: string,
    deliveryQuote: DeliveryQuote,
    paymentIntentId: string
  ): Promise<DeliveryOrder | undefined> => {
    try {
      // Find the selected address
      const selectedAddress = mockAddresses.find(addr => addr.id === selectedAddressId);
      
      if (!selectedAddress) {
        console.error('Selected address not found:', selectedAddressId);
        return undefined;
      }
      
      // Create delivery order
      return await createDeliveryOrder(
        deliveryQuote.id,
        selectedAddress,
        paymentIntentId
      );
    } catch (error) {
      console.error('Error creating delivery order:', error);
      throw error;
    }
  }, []);

  return { createOrder };
};
