'use client';

import React from 'react';

interface SkeletonProps {
  height?: string;
  width?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ height = '1rem', width = '100%', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          data-testid="skeleton-loader"
          style={{
            height,
            width,
            backgroundColor: 'var(--color-neutral-200)',
            borderRadius: '0.375rem',
            animation: 'loading 1.5s infinite',
            marginBottom: count > 1 && idx < count - 1 ? '0.75rem' : '0',
          }}
        />
      ))}
      <style>{`
        @keyframes loading {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </>
  );
};
