// LoadingSpinner.tsx
import React from "react";
import { Spinner } from "@nextui-org/react";

interface LoadingSpinnerProps {
  className?: string; // Additional classes for customization
  size?: "sm" | "md" | "lg"; // Size of the spinner
  color?: "default" | "current" | "white" | "primary" | "secondary" | "success" | "warning" | "danger"; // Custom color for the spinner
  label?: string; // Optional label for accessibility
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className = "",
  size = "md", // Default size
  color = "primary", // Default color
  label = "Loading...", // Default label for accessibility
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Spinner 
        size={size} 
        color={color} 
        aria-label={label} 
      />
      {label && <span className="ml-2 text-gray-500">{label}</span>}
    </div>
  );
};

export default LoadingSpinner;
