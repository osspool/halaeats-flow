
import { useState, useCallback } from 'react';
import { DeliveryStore, DeliveryAddress } from '@/types/delivery';
import { 
  registerDeliveryStore, 
  getDeliveryStore, 
  getDeliveryStoreByExternalId,
  updateDeliveryStore,
  deactivateDeliveryStore
} from '@/services/mockStoreService';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for managing delivery store operations
 */
export const useDeliveryStore = () => {
  const [store, setStore] = useState<DeliveryStore | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  /**
   * Register a new restaurant with the delivery service
   */
  const registerStore = useCallback(async (
    catererId: string,
    name: string,
    address: DeliveryAddress,
    phoneNumber: string,
    email?: string,
    pickupInstructions?: string,
    prepTime?: number,
  ) => {
    try {
      setLoading(true);
      const newStore = await registerDeliveryStore(
        catererId,
        name,
        address,
        phoneNumber,
        email,
        pickupInstructions,
        prepTime
      );
      
      setStore(newStore);
      toast({
        title: 'Store registered',
        description: `${name} was successfully registered with the delivery service`,
      });
      
      return newStore;
    } catch (error) {
      console.error('Error registering store:', error);
      toast({
        title: 'Registration failed',
        description: 'Could not register the store with delivery service',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Load a store by its ID
   */
  const loadStore = useCallback(async (storeId: string) => {
    try {
      setLoading(true);
      const foundStore = await getDeliveryStore(storeId);
      setStore(foundStore);
      return foundStore;
    } catch (error) {
      console.error('Error loading store:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load a store by the caterer's ID in your system
   */
  const loadStoreByExternalId = useCallback(async (catererId: string) => {
    try {
      setLoading(true);
      const foundStore = await getDeliveryStoreByExternalId(catererId);
      setStore(foundStore);
      return foundStore;
    } catch (error) {
      console.error('Error loading store by external ID:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update store information
   */
  const updateStore = useCallback(async (
    storeId: string,
    updates: Partial<DeliveryStore>
  ) => {
    try {
      setLoading(true);
      const updatedStore = await updateDeliveryStore(storeId, updates);
      
      if (updatedStore) {
        setStore(updatedStore);
        toast({
          title: 'Store updated',
          description: 'Store information was successfully updated',
        });
      }
      
      return updatedStore;
    } catch (error) {
      console.error('Error updating store:', error);
      toast({
        title: 'Update failed',
        description: 'Could not update store information',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Deactivate a store
   */
  const deactivateStore = useCallback(async (storeId: string) => {
    try {
      setLoading(true);
      const success = await deactivateDeliveryStore(storeId);
      
      if (success && store?.id === storeId) {
        setStore({
          ...store,
          status: 'inactive',
          updated_at: new Date().toISOString(),
        });
        
        toast({
          title: 'Store deactivated',
          description: 'Store was successfully deactivated',
        });
      }
      
      return success;
    } catch (error) {
      console.error('Error deactivating store:', error);
      toast({
        title: 'Deactivation failed',
        description: 'Could not deactivate the store',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [store, toast]);

  return {
    store,
    loading,
    registerStore,
    loadStore,
    loadStoreByExternalId,
    updateStore,
    deactivateStore,
  };
};
