// app/tickers/TickerRow.tsx
"use client";

import React, { useState } from "react";
import { TickerInfo, updateTicker } from "@/api/all";

export default function TickerRow({ ticker }: { ticker: TickerInfo }) {
  const [editing, setEditing] = useState(false);
  const [updatedTicker, setUpdatedTicker] = useState(ticker);

  const handleInputChange = (field: keyof TickerInfo, value: string) => {
    setUpdatedTicker({ ...updatedTicker, [field]: value });
  };

  const handleSave = async () => {
    try {
      await updateTicker(ticker.code, updatedTicker);
      setEditing(false);
    } catch (error) {
      console.error("Failed to update ticker:", error);
    }
  };

  return editing ? (
    <tr className="bg-gray-900 hover:bg-gray-800">
      <td className="p-4 border border-gray-700">{ticker.code}</td>
      <td className="p-4 border border-gray-700">
        <input
          type="text"
          value={updatedTicker.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-600 rounded"
        />
      </td>
      <td className="p-4 border border-gray-700">
        <input
          type="text"
          value={updatedTicker.exchange || ""}
          onChange={(e) => handleInputChange("exchange", e.target.value)}
          className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-600 rounded"
        />
      </td>
      <td className="p-4 border border-gray-700">
        <input
          type="text"
          value={updatedTicker.market || ""}
          onChange={(e) => handleInputChange("market", e.target.value)}
          className="w-full p-2 bg-gray-800 text-gray-200 border border-gray-600 rounded"
        />
      </td>
      <td className="p-4 border border-gray-700">{ticker.source}</td>
      <td className="p-4 border border-gray-700 flex gap-2">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded"
        >
          Save
        </button>
        <button
          onClick={() => setEditing(false)}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded"
        >
          Cancel
        </button>
      </td>
    </tr>
  ) : (
    <tr className="hover:bg-gray-800">
      <td className="p-4 border border-gray-700">{ticker.code}</td>
      <td className="p-4 border border-gray-700">{ticker.name}</td>
      <td className="p-4 border border-gray-700">{ticker.exchange}</td>
      <td className="p-4 border border-gray-700">{ticker.market}</td>
      <td className="p-4 border border-gray-700">{ticker.source}</td>
      <td className="p-4 border border-gray-700">
        <button
          onClick={() => setEditing(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded"
        >
          Edit
        </button>
      </td>
    </tr>
  );
}
