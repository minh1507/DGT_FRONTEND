// ToastContext.tsx
import React, { createContext, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { ToastContextProps, ToastProviderProps } from './type/toast';

export const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const toast = useRef<Toast>(null);

  const showToast = (message: string, severity: 'success' | 'info' | 'warn' | 'error' = 'info') => {
    toast.current?.show({ severity, summary: severity, detail: message, life: 3000 });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast ref={toast} />
    </ToastContext.Provider>
  );
};