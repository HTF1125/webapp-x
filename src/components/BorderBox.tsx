"use client";

import React from "react";

interface BorderBoxProps {
  children: React.ReactNode;
  className?: string; // Additional custom styles
}

const BorderBox: React.FC<BorderBoxProps> = ({ children, className }) => {
  return (
    <div className={`border border-white rounded-lg p-4 ${className || ""}`}>
      {children}
    </div>
  );
};

export default BorderBox;
