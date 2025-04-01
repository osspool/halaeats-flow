
import React from 'react';
import { MapProvider } from './components/map/MapContext';
import { LocationProvider } from './contexts/LocationContext';
import App from './App';

const AppWrapper: React.FC = () => {
  return (
    <MapProvider>
      <LocationProvider>
        <App />
      </LocationProvider>
    </MapProvider>
  );
};

export default AppWrapper;
