"use client";

import { useState } from "react";
import TickerRow from "./TickerRow";
import TickerForm from "./TickerForm";
import { TickerInfo, addNewTicker } from "@/api/all";

export default function TickerTableClient({ initialTickers }: { initialTickers: TickerInfo[] }) {
  const [tickers, setTickers] = useState<TickerInfo[]>(initialTickers);
  const [showModal, setShowModal] = useState(false);
  const [newTicker, setNewTicker] = useState<Partial<TickerInfo>>({});
  const [error, setError] = useState<string | null>(null);

  const handleAddTicker = async () => {
    if (!newTicker.code || !newTicker.name || !newTicker.exchange) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const addedTicker = await addNewTicker(newTicker);
      setTickers([...tickers, addedTicker]);
      setShowModal(false);
      setNewTicker({});
      setError(null);
    } catch (err) {
      console.error("Error adding new ticker:", err);
      setError("Failed to add new ticker. Please try again.");
    }
  };

  const handleFormChange = (field: keyof TickerInfo, value: string) => {
    setNewTicker((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => setShowModal(true)}
      >
        Add New Ticker
      </button>
      <div className="overflow-hidden rounded-md">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-gray-400 uppercase border-b border-gray-600">
            <tr>
              <th className="px-4 py-2">Code</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Exchange</th>
              <th className="px-4 py-2">Market</th>
              <th className="px-4 py-2">Source</th>
            </tr>
          </thead>
          <tbody>
            {tickers.map((ticker) => (
              <TickerRow key={ticker.code} ticker={ticker} />
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-4 rounded-md max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Add New Ticker</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <TickerForm
              formData={newTicker}
              isEditing={true}
              onChange={handleFormChange}
            />
            <div className="mt-4 flex justify-end gap-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleAddTicker}
              >
                Add
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
