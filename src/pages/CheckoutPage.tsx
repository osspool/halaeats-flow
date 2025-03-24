
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DeliveryMethodStep from '@/components/checkout/DeliveryMethodStep';
import StripePaymentWrapper from '@/components/checkout/StripePaymentWrapper';
import ReviewStep from '@/components/checkout/ReviewStep';
import ConfirmationStep from '@/components/checkout/ConfirmationStep';
import CheckoutProgress from '@/components/checkout/CheckoutProgress';
import { useCheckout } from '@/hooks/useCheckout';
import { mockCartItems } from '@/pages/CartPage';
import { useToast } from '@/hooks/use-toast';
import { CartItem } from '@/types';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filteredItems, setFilteredItems] = useState<CartItem[]>([]);
  
  const {
    checkoutState,
    nextStep,
    previousStep,
    setOrderType,
    setSelectedAddressId,
    setSelectedPaymentMethodId,
    setDeliveryInstructions,
    setPickupTime,
    resetCheckout,
  } = useCheckout();
  
  useEffect(() => {
    // Get the selected caterer ID from localStorage
    const selectedCatererId = localStorage.getItem('selectedCatererId');
    
    // Filter cart items by the selected caterer
    const items = selectedCatererId
      ? mockCartItems.filter(item => item.caterer.id === selectedCatererId)
      : mockCartItems;
      
    setFilteredItems(items);
    
    // If no items or no selected caterer, redirect to cart
    if (items.length === 0) {
      navigate('/cart');
      toast({
        title: "Empty cart",
        description: "Your cart is empty or no caterer was selected. Add some items before checkout.",
      });
    }
    
    // Clear the selected caterer from localStorage when unmounting
    return () => {
      localStorage.removeItem('selectedCatererId');
    };
  }, [navigate, toast]);
  
  // Calculate order summary
  const subtotal = filteredItems.reduce((total, item) => total + item.subtotal, 0);
  const deliveryFee = checkoutState.orderType === 'delivery' ? 3.99 : 0;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + deliveryFee + tax;
  
  const orderSummary = {
    subtotal,
    deliveryFee,
    tax,
    total,
  };
  
  // Reset checkout when unmounting
  useEffect(() => {
    console.log('Current checkout step:', checkoutState.step);
    return () => {
      resetCheckout();
    };
  }, [resetCheckout]);
  
  // Render step content
  const renderStepContent = () => {
    console.log('Rendering step:', checkoutState.step);
    
    switch (checkoutState.step) {
      case 'delivery-method':
        return (
          <DeliveryMethodStep
            orderType={checkoutState.orderType}
            onOrderTypeChange={setOrderType}
            selectedAddressId={checkoutState.selectedAddressId}
            onAddressSelect={setSelectedAddressId}
            onDeliveryInstructionsChange={setDeliveryInstructions}
            onPickupTimeChange={setPickupTime}
            onNext={nextStep}
          />
        );
      case 'payment':
        return (
          <StripePaymentWrapper
            selectedPaymentMethodId={checkoutState.selectedPaymentMethodId}
            onPaymentMethodSelect={setSelectedPaymentMethodId}
            onNext={nextStep}
            onPrevious={previousStep}
          />
        );
      case 'review':
        return (
          <ReviewStep
            items={filteredItems}
            orderSummary={orderSummary}
            orderType={checkoutState.orderType}
            selectedAddressId={checkoutState.selectedAddressId}
            selectedPaymentMethodId={checkoutState.selectedPaymentMethodId}
            onNext={nextStep}
            onPrevious={previousStep}
          />
        );
      case 'confirmation':
        return <ConfirmationStep />;
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow mt-16 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {checkoutState.step !== 'confirmation' && (
              <CheckoutProgress currentStep={checkoutState.step} />
            )}
            
            {renderStepContent()}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutPage;
