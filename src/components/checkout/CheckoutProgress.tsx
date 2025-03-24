
import { CheckoutStep } from '@/types/checkout';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckoutProgressProps {
  currentStep: CheckoutStep;
}

const steps: { key: CheckoutStep; label: string }[] = [
  { key: 'delivery-method', label: 'Delivery' },
  { key: 'address', label: 'Address' },
  { key: 'payment', label: 'Payment' },
  { key: 'review', label: 'Review' },
];

const CheckoutProgress = ({ currentStep }: CheckoutProgressProps) => {
  const currentStepIndex = steps.findIndex(step => step.key === currentStep);
  
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isLast = index === steps.length - 1;
          
          return (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium",
                    isCompleted ? "bg-primary" : isCurrent ? "bg-primary" : "bg-halaeats-200"
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span className={cn(
                  "text-xs mt-1",
                  isCurrent ? "font-medium text-primary" : "text-halaeats-500"
                )}>
                  {step.label}
                </span>
              </div>
              
              {!isLast && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-2",
                    index < currentStepIndex ? "bg-primary" : "bg-halaeats-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutProgress;
