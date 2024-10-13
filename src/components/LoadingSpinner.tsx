// src/components/LoadingSpinner.tsx
'use client';

import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="loader"></div>
      <style jsx>{`
        .loader {
          border: 4px solid rgba(75, 192, 192, 0.3);
          border-top: 4px solid rgba(75, 192, 192, 1);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
