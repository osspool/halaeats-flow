
import { useCallback } from 'react';
import { calculatePaymentSplit } from '@/services/mockDeliveryService';

/**
 * Hook for calculating payment splits between restaurant and delivery service
 */
export const usePaymentSplit = () => {
  const calculateSplit = useCallback((subtotal: number, deliveryFee: number) => {
    return calculatePaymentSplit(subtotal, deliveryFee);
  }, []);

  return { calculateSplit };
};
