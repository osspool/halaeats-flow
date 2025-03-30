
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface DeliveryInstructionsProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const DeliveryInstructions: React.FC<DeliveryInstructionsProps> = ({ value, onChange }) => {
  return (
    <div className="mt-4">
      <h3 className="font-medium mb-2">Delivery Instructions (Optional)</h3>
      <Textarea
        placeholder="Add any special instructions for delivery..."
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default DeliveryInstructions;
