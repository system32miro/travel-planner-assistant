"use client";

import { useState, useCallback } from 'react';

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
}

interface Toast extends ToastOptions {
  id: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ title, description = '', duration = 3000 }: ToastOptions) => {
    const id = Date.now();
    const newToast: Toast = { id, title, description, duration };
    setToasts((currentToasts) => [...currentToasts, newToast]);

    setTimeout(() => {
      setToasts((currentToasts) => currentToasts.filter((t) => t.id !== id));
    }, duration);
  }, []);

  return { toast, toasts };
}