// src/components/LoadingSpinner.tsx
import React from "react";

interface LoadingSpinnerProps {
  message?: string;
  isComplete?: boolean;
  completeMessage?: string;
  isError?: boolean;
  errorMessage?: string;
  progress?: number;
  onClose?: () => void;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  isComplete = false,
  completeMessage,
  isError = false,
  errorMessage,
  progress,
  onClose,
}) => {
  // Determine the content based on props
  let content;

  if (isComplete) {
    content = (
      <div style={overlayStyle}>
        <div style={spinnerContainerStyle}>
          <div style={iconStyle(isComplete)}>&#10004;</div>
          <p>{completeMessage}</p>
          {onClose && (
            <button style={buttonStyle} onClick={onClose}>
              OK
            </button>
          )}
        </div>
      </div>
    );
  } else if (isError) {
    content = (
      <div style={overlayStyle}>
        <div style={spinnerContainerStyle}>
          <div style={iconStyle(isError)}>&#10060;</div>
          <p>{errorMessage}</p>
          {onClose && (
            <button style={buttonStyle} onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    );
  } else {
    content = (
      <div style={overlayStyle}>
        <div style={spinnerContainerStyle}>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
          <div style={spinnerStyle}></div>
          <p>{message}</p>
          {progress !== undefined && (
            <p style={{ marginTop: "10px" }}>{progress}%</p>
          )}
        </div>
      </div>
    );
  }

  return <>{content}</>;
};

// Inline styles
const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(26, 32, 44, 0.8)", // Semi-transparent dark overlay
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1001, // Above other elements
};

const spinnerContainerStyle: React.CSSProperties = {
  backgroundColor: "#2D3748", // Dark background
  padding: "20px",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "15px",
};

const spinnerStyle: React.CSSProperties = {
  border: "8px solid #f3f3f3",
  borderTop: "8px solid #3182ce",
  borderRadius: "50%",
  width: "60px",
  height: "60px",
  animation: "spin 2s linear infinite",
};

const iconStyle = (isSuccessOrError: boolean) => ({
  fontSize: "40px",
  color: isSuccessOrError ? "#38a169" : "#e53e3e", // Green for success, red for error
});

const buttonStyle: React.CSSProperties = {
  padding: "8px 16px",
  backgroundColor: "#3182ce",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default LoadingSpinner;
