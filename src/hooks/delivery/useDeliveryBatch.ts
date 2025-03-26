
import { useState, useCallback } from 'react';
import { DeliveryBatch, DeliveryOrder } from '@/types/delivery';
import { 
  createDeliveryBatch, 
  getDeliveryBatches, 
  updateDeliveryBatchStatus,
  getAvailableOrdersForBatching
} from '@/services/mockDeliveryService';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for managing delivery batches
 */
export const useDeliveryBatch = () => {
  const [batches, setBatches] = useState<DeliveryBatch[]>([]);
  const [availableOrders, setAvailableOrders] = useState<DeliveryOrder[]>([]);
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
   * Update a batch status
   */
  const updateBatchStatus = useCallback(async (
    batchId: string,
    status: 'pending' | 'in_progress' | 'completed' | 'canceled'
  ) => {
    try {
      setLoading(true);
      const updatedBatch = await updateDeliveryBatchStatus(batchId, status);
      
      if (updatedBatch) {
        // Update the batch in the local state
        setBatches(prev => prev.map(batch => 
          batch.id === batchId ? updatedBatch : batch
        ));
        
        toast({
          title: 'Batch updated',
          description: `Batch status changed to ${status}`,
        });
      }
      
      return updatedBatch;
    } catch (error) {
      console.error('Error updating batch status:', error);
      toast({
        title: 'Status update failed',
        description: 'Could not update batch status',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Load all available orders that could be batched
   */
  const loadAvailableOrders = useCallback(async (
    storeId: string,
    timeSlot?: string
  ) => {
    try {
      setLoading(true);
      const orders = await getAvailableOrdersForBatching(storeId, timeSlot);
      setAvailableOrders(orders);
      return orders;
    } catch (error) {
      console.error('Error loading available orders:', error);
      toast({
        title: 'Could not load orders',
        description: 'Failed to load available orders for batching',
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
    
    orders.forEach(order => {
      // Extract time slot from order or use unknown
      const timeSlot = order.time_slot || 'Unknown time slot';
      
      if (!timeSlotGroups[timeSlot]) {
        timeSlotGroups[timeSlot] = [];
      }
      
      timeSlotGroups[timeSlot].push(order);
    });
    
    return timeSlotGroups;
  }, []);

  return {
    batches,
    availableOrders,
    loading,
    createBatch,
    loadBatchesForStore,
    updateBatchStatus,
    loadAvailableOrders,
    groupOrdersByTimeSlot,
  };
};
