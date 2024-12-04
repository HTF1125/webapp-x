"use client";

import { useState } from "react";
import GoBackButton from "@/components/GoBackButton";
import { updateTicker, TickerInfo } from "@/api/all";
import TickerForm from "../TickerForm";

export default function TickerDetailClient({ ticker }: { ticker: TickerInfo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<TickerInfo>>(ticker);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: keyof TickerInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await updateTicker(ticker.code, formData);
      setIsEditing(false);
      setSuccess(true);
      setError(null);
    } catch (err) {
      setError("Failed to update ticker information.");
    }
  };

  const handleCancel = () => {
    setFormData(ticker); // Reset the form to original ticker values
    setIsEditing(false);
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="container mx-auto p-6 bg-black text-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="col-span-4 bg-gray-800 p-4 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold text-white mb-4">
            {isEditing ? "Edit Ticker Details" : `${ticker.name || ticker.code} Details`}
          </h1>
          <p className="text-gray-400">
            {isEditing
              ? "You are editing the details of this ticker. Make changes and click Save or Cancel."
              : "View details of the ticker below."}
          </p>
        </div>

        <TickerForm
          formData={formData}
          isEditing={isEditing}
          onChange={handleInputChange}
        />

        <div className="flex justify-center mt-6 space-x-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500"
            >
              Edit
            </button>
          )}
        </div>

        <div className="mt-8 text-center">
          {success && <p className="text-green-500">Ticker updated successfully!</p>}
          {error && <p className="text-red-500">{error}</p>}
          <GoBackButton />
        </div>
      </div>
    </div>
  );
}
