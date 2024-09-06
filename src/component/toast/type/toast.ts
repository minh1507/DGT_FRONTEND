import { ReactNode } from "react";

export interface ToastContextProps {
    showToast: (message: string, severity?: 'success' | 'info' | 'warn' | 'error') => void;
}

export interface ToastProviderProps {
    children: ReactNode;
}