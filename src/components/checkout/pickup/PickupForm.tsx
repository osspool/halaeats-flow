
import React from 'react';

const PickupForm = () => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium mb-2">Pickup Location</h3>
      <div className="bg-white p-4 rounded-lg border border-halaeats-100">
        <h4 className="font-medium text-halaeats-800 mb-2">Spice Delight</h4>
        <p className="text-sm text-halaeats-600 mb-1">123 Food Street, San Francisco, CA 94105</p>
        <p className="text-sm text-halaeats-600">Open: 11:00 AM - 9:00 PM</p>
      </div>
    </div>
  );
};

export default PickupForm;
