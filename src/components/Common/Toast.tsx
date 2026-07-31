'use client';

import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: '#dcfce7',
    error: '#fee2e2',
    info: '#e0e7ff',
  }[type];

  const borderColor = {
    success: '#86efac',
    error: '#fca5a5',
    info: '#c7d2fe',
  }[type];

  const textColor = {
    success: '#166534',
    error: '#991b1b',
    info: '#312e81',
  }[type];

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  }[type];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '0.375rem',
        padding: '1rem',
        minWidth: '300px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}
    >
      <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: textColor }}>{icon}</span>
      <p style={{ margin: 0, color: textColor, fontSize: '0.875rem' }}>{message}</p>
      <button
        onClick={onClose}
        style={{
          marginLeft: 'auto',
          backgroundColor: 'transparent',
          border: 'none',
          color: textColor,
          cursor: 'pointer',
          fontSize: '1.25rem',
          padding: '0',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        ×
      </button>
    </div>
  );
};
