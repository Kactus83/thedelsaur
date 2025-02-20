import React, { createContext, useContext, useState, ReactNode } from 'react';

export type OverlayType = 'inventory' | 'buildings' | null;

interface OverlayContextProps {
  currentOverlay: OverlayType;
  openOverlay: (overlay: OverlayType) => void;
  closeOverlay: () => void;
}

const OverlayContext = createContext<OverlayContextProps | undefined>(undefined);

export const OverlayProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentOverlay, setCurrentOverlay] = useState<OverlayType>(null);

  const openOverlay = (overlay: OverlayType) => setCurrentOverlay(overlay);
  const closeOverlay = () => setCurrentOverlay(null);

  return (
    <OverlayContext.Provider value={{ currentOverlay, openOverlay, closeOverlay }}>
      {children}
    </OverlayContext.Provider>
  );
};

export const useOverlay = (): OverlayContextProps => {
  const context = useContext(OverlayContext);
  if (context === undefined) {
    throw new Error('useOverlay must be used within an OverlayProvider');
  }
  return context;
};
