
import { useState, useCallback } from 'react';
import { DeliveryBatch, DeliveryOrder } from '@/types/delivery';
import { createDeliveryBatch, getDeliveryBatches } from '@/services/mockDeliveryService';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for managing delivery batches
 */
export const useDeliveryBatch = () => {
  const [batches, setBatches] = useState<DeliveryBatch[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  /**
   * Create a batch of orders for a specific time slot
   */
  const createBatch = useCallback(async (
    storeId: string,
    orderIds: string[],
    pickupTime: string
  ) => {
    try {
      setLoading(true);
      const batch = await createDeliveryBatch(storeId, orderIds, pickupTime);
      
      setBatches(prev => [...prev, batch]);
      
      toast({
        title: 'Batch created',
        description: `Created batch with ${batch.orders.length} orders for pickup at ${new Date(pickupTime).toLocaleTimeString()}`,
      });
      
      return batch;
    } catch (error) {
      console.error('Error creating batch:', error);
      toast({
        title: 'Batch creation failed',
        description: 'Could not create delivery batch',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Load all batches for a store
   */
  const loadBatchesForStore = useCallback(async (storeId: string) => {
    try {
      setLoading(true);
      const storeBatches = await getDeliveryBatches(storeId);
      setBatches(storeBatches);
      return storeBatches;
    } catch (error) {
      console.error('Error loading batches:', error);
      toast({
        title: 'Could not load batches',
        description: 'Failed to load delivery batches',
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Group orders by time slot for potential batching
   */
  const groupOrdersByTimeSlot = useCallback((orders: DeliveryOrder[]) => {
    const timeSlotGroups: Record<string, DeliveryOrder[]> = {};
    
    // This is a simplified mock implementation
    // In a real app, you'd need to extract time slot data from orders
    // For now, we'll use a random time slot assignment for demonstration
    
    const mockTimeSlots = [
      '09:00-10:00',
      '11:00-12:00',
      '13:00-14:00',
      '15:00-16:00',
      '17:00-18:00',
      '19:00-20:00',
    ];
    
    orders.forEach(order => {
      // Randomly assign orders to time slots for demo purposes
      const randomIndex = Math.floor(Math.random() * mockTimeSlots.length);
      const timeSlot = mockTimeSlots[randomIndex];
      
      if (!timeSlotGroups[timeSlot]) {
        timeSlotGroups[timeSlot] = [];
      }
      
      timeSlotGroups[timeSlot].push(order);
    });
    
    return timeSlotGroups;
  }, []);

  return {
    batches,
    loading,
    createBatch,
    loadBatchesForStore,
    groupOrdersByTimeSlot,
  };
};
