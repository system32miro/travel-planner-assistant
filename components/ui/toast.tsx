"use client";

import React from 'react';
import { useToast } from './use-toast';

export function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 mb-2 max-w-sm"
        >
          <h3 className="font-semibold text-gray-900">{toast.title}</h3>
          {toast.description && (
            <p className="mt-1 text-sm text-gray-500">{toast.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}