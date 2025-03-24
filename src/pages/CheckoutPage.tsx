
import { useEffect } from 'react';
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

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
  
  // Calculate order summary
  const subtotal = mockCartItems.reduce((total, item) => total + item.subtotal, 0);
  const deliveryFee = checkoutState.orderType === 'delivery' ? 3.99 : 0;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + deliveryFee + tax;
  
  const orderSummary = {
    subtotal,
    deliveryFee,
    tax,
    total,
  };
  
  // Redirect to cart if no items
  useEffect(() => {
    if (mockCartItems.length === 0) {
      navigate('/cart');
      toast({
        title: "Empty cart",
        description: "Your cart is empty. Add some items before checkout.",
      });
    }
  }, [navigate, toast]);
  
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
            items={mockCartItems}
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
