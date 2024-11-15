// app/insights/components/LoadingSpinner.tsx

"use client";

interface LoadingSpinnerProps {
  size?: number; // spinner size in pixels
  color?: string; // color for the spinner
  message?: string; // optional loading message
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  color = "text-blue-500",
  message = "Loading...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div
        className={`animate-spin rounded-full ${color}`}
        style={{
          width: size,
          height: size,
          borderWidth: size / 10,
          borderColor: `${color.replace("text", "border")}`,
          borderTopColor: "transparent",
        }}
      ></div>
      {message && <p className="mt-4 text-lg text-gray-500">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
