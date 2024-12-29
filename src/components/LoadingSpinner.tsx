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
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
        <div className="bg-gray-900 p-8 rounded-lg shadow-xl flex flex-col items-center gap-6 w-80 max-w-md">
          <div className="text-green-500 text-5xl">&#10004;</div>
          <p className="text-white text-lg text-center">{completeMessage}</p>
          {onClose && (
            <button
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-all"
              onClick={onClose}
            >
              OK
            </button>
          )}
        </div>
      </div>
    );
  } else if (isError) {
    content = (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
        <div className="bg-gray-900 p-8 rounded-lg shadow-xl flex flex-col items-center gap-6 w-80 max-w-md">
          <div className="text-red-500 text-5xl">&#10060;</div>
          <p className="text-white text-lg text-center">{errorMessage}</p>
          {onClose && (
            <button
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all"
              onClick={onClose}
            >
              Close
            </button>
          )}
        </div>
      </div>
    );
  } else {
    content = (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
        <div className="bg-gray-900 p-8 rounded-lg shadow-xl flex flex-col items-center gap-6 w-80 max-w-md">
          <div className="border-8 border-t-8 border-gray-600 border-t-blue-500 rounded-full w-20 h-20 animate-spin"></div>
          <p className="text-white text-lg text-center">{message}</p>
          {progress !== undefined && (
            <p className="text-white text-lg">{progress}%</p>
          )}
        </div>
      </div>
    );
  }

  return <>{content}</>;
};

export default LoadingSpinner;
