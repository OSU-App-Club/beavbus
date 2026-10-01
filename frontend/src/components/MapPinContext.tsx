import React, { createContext, useState, useContext, ReactNode } from 'react';
import { LocationResult } from '../scripts/onSearch';

interface MapPinContextType {
  selectedLocation: LocationResult | null;
  setSelectedLocation: (location: LocationResult | null) => void;
}

const MapPinContext = createContext<MapPinContextType | undefined>(undefined);

export function MapPinProvider({ children }: { children: ReactNode }) {
  const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null);

  return (
    <MapPinContext.Provider value={{ selectedLocation, setSelectedLocation }}>
      {children}
    </MapPinContext.Provider>
  );
}

export function useMapPin() {
  const context = useContext(MapPinContext);
  if (context === undefined) {
    throw new Error('useMapPin must be used within a MapPinProvider');
  }
  return context;
}