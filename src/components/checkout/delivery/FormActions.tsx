
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormActionsProps {
  isLoading: boolean;
  onCancel: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ isLoading, onCancel }) => {
  return (
    <div className="flex space-x-2 pt-2 pb-8">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Address'
        )}
      </Button>
    </div>
  );
};

export default FormActions;
