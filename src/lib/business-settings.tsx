'use client';

import { createContext, useContext, type ReactNode } from 'react';

type BusinessSettings = { phone: string; whatsapp: string };

const BusinessSettingsContext = createContext<BusinessSettings>({ phone: '', whatsapp: '' });

export function BusinessSettingsProvider({
  children,
  phone,
  whatsapp,
}: BusinessSettings & { children: ReactNode }) {
  return (
    <BusinessSettingsContext.Provider value={{ phone, whatsapp }}>
      {children}
    </BusinessSettingsContext.Provider>
  );
}

export const useBusinessSettings = () => useContext(BusinessSettingsContext);
