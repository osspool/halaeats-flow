
import React from 'react';
import { LocationProvider } from './contexts/LocationContext';
import App from './App';

const AppWrapper: React.FC = () => {
  return (
    <LocationProvider>
      <App />
    </LocationProvider>
  );
};

export default AppWrapper;
