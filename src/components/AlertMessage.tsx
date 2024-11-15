// app/insights/components/AlertMessage.tsx

"use client";

interface AlertMessageProps {
  message: string;
  title?: string;
  bgColor?: string;
  textColor?: string;
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  message,
  title = "Alert",
  bgColor = "bg-red-600",
  textColor = "text-white",
}) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className={`${bgColor} ${textColor} p-6 rounded-lg shadow-lg`}>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default AlertMessage;
