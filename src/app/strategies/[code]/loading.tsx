// app/strategies/[id]/loading.tsx

export default function Loading() {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
          <p className="text-lg font-semibold text-black dark:text-white">Loading strategy details...</p>
        </div>
      </div>
    );
  }
