import React, { useEffect } from "react";

interface LoadingSpinnerProps {
  message?: string;
  progress?: number;
  isComplete?: boolean;
  isError?: boolean;
  onClose?: () => void;
  completeMessage?: string;
  errorMessage?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
  progress,
  isComplete = false,
  isError = false,
  onClose,
  completeMessage = "Completed!",
  errorMessage = "An error occurred!",
}) => {
  // Add key press event listener to handle 'Enter' key for the OK button
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        onClose && onClose(); // Trigger the same action as clicking OK
      }
    };

    // Only add the listener when the "Completed" or "Error" message is shown
    if (isComplete || isError) {
      document.addEventListener("keydown", handleKeyDown);
    }

    // Cleanup event listener on component unmount or when modal closes
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isComplete, isError, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div className="bg-gray-900 text-white p-8 rounded-lg shadow-xl w-96 max-w-sm mx-4 transition-all">
        {/* Loading State */}
        {!isComplete && !isError ? (
          <>
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-500"></div>
              <p className="mt-6 text-xl font-semibold">{message}</p>
            </div>
            {progress !== undefined && (
              <>
                <div className="w-full bg-gray-800 rounded-full h-2 mt-6">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-center text-xs text-gray-300 mt-2">
                  Upload Progress: {progress}%
                </p>
              </>
            )}
          </>
        ) : isComplete ? (
          <>
            <h2 className="text-xl font-semibold text-green-300 text-center">{completeMessage}</h2>
            <button
              className="mt-6 bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-all duration-200 mx-auto block"
              onClick={onClose}
            >
              OK
            </button>
          </>
        ) : isError ? (
          <>
            <h2 className="text-xl font-semibold text-red-400 text-center">{errorMessage}</h2>
            <button
              className="mt-6 bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-all duration-200 mx-auto block"
              onClick={onClose}
            >
              Close
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default LoadingSpinner;
