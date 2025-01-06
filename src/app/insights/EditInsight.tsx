"use client";

import React, { useState } from "react";
import { Insight } from "./InsightApi";
import { useInsights } from "./provider"; // Import the context hook

interface EditInsightProps {
  currentInsight?: Partial<Insight>; // The insight to edit
  onSaveComplete: (updatedInsight: Insight) => void; // Callback to refresh insights
  onClose: () => void; // Callback to close the modal
}

const EditInsight: React.FC<EditInsightProps> = ({
  currentInsight = {},
  onSaveComplete,
  onClose,
}) => {
  const { handleUpdateInsight } = useInsights(); // Use context to access update function
  const [insightData, setInsightData] = useState<Partial<Insight>>(currentInsight);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (!insightData._id) {
        throw new Error("Invalid insight ID");
      }

      const updatedInsight = {
        ...insightData,
        published_date: insightData.published_date
          ? new Date(insightData.published_date).toISOString().split("T")[0]
          : "",
      };

      await handleUpdateInsight(updatedInsight as Insight); // Use context update function

      setSuccessMessage("Insight updated successfully.");
      onSaveComplete(updatedInsight as Insight); // Notify the parent component to refresh data
      onClose(); // Close the modal after saving
    } catch (err) {
      console.error("Error saving insight:", err);
      setError("Failed to save insight. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-4 rounded-lg max-w-3xl w-full">
        <h3 className="text-white font-bold mb-4 text-lg">
          Edit Insight
        </h3>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {successMessage && <p className="text-green-500 mb-2">{successMessage}</p>}

        {/* Date and Issuer Row */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-400 text-sm">Date</label>
            <input
              type="date"
              value={insightData?.published_date || ""}
              onChange={(e) =>
                setInsightData({
                  ...insightData,
                  published_date: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm">Issuer</label>
            <input
              type="text"
              value={insightData?.issuer || ""}
              onChange={(e) =>
                setInsightData({ ...insightData, issuer: e.target.value })
              }
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
            />
          </div>
        </div>

        {/* Name Field */}
        <div className="mb-4">
          <label className="block text-gray-400 text-sm">Name</label>
          <input
            type="text"
            value={insightData?.name || ""}
            onChange={(e) =>
              setInsightData({ ...insightData, name: e.target.value })
            }
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
          />
        </div>

        {/* Summary Field */}
        <div className="mb-4">
          <label className="block text-gray-400 text-sm">Summary</label>
          <textarea
            value={insightData?.summary || ""}
            onChange={(e) =>
              setInsightData({ ...insightData, summary: e.target.value })
            }
            className="w-full p-2 h-28 border border-gray-600 rounded bg-gray-700 text-white"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            className={`text-green-400 hover:underline ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            className="text-red-400 hover:underline"
            onClick={() => onClose()}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditInsight;
