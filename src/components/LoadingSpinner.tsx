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
      <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col items-center gap-6 w-72">
          <div className="text-green-500 text-4xl">&#10004;</div>
          <p className="text-white text-lg text-center">{completeMessage}</p>
          {onClose && (
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
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
      <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col items-center gap-6 w-72">
          <div className="text-red-500 text-4xl">&#10060;</div>
          <p className="text-white text-lg text-center">{errorMessage}</p>
          {onClose && (
            <button
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
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
      <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col items-center gap-6 w-72">
          <div className="border-8 border-t-8 border-gray-300 border-t-blue-500 rounded-full w-16 h-16 animate-spin"></div>
          <p className="text-white text-lg text-center">{message}</p>
          {progress !== undefined && (
            <p className="text-white text-md">{progress}%</p>
          )}
        </div>
      </div>
    );
  }

  return <>{content}</>;
};

export default LoadingSpinner;
