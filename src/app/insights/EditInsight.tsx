"use client";

import React, { useState} from "react";
import { Insight } from "./InsightApi";
import { useInsights } from "./provider";

interface EditInsightProps {
  currentInsight?: Partial<Insight>;
  onClose: () => void;
}

const EditInsight: React.FC<EditInsightProps> = ({
  currentInsight = {},
  onClose,
}) => {
  const [insightData, setInsightData] =
    useState<Partial<Insight>>(currentInsight);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { handleUpdateInsight } = useInsights();

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Ensure that the insightData has an _id to update
      if (!insightData._id) {
        throw new Error("Insight _id is required for updating.");
      }

      // Call the update function
      await handleUpdateInsight(insightData as Insight);
      setSuccessMessage("Insight updated successfully!");
      onClose(); // Close the modal after saving
    } catch (error) {
      console.error("Error saving insight:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 dark:bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-3xl w-full">
        <h3 className="text-gray-900 dark:text-white font-bold mb-4 text-lg">
          Edit Insight
        </h3>
        {error && (
          <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
        )}
        {successMessage && (
          <p className="text-green-600 dark:text-green-400 mb-2">
            {successMessage}
          </p>
        )}

        {/* Date and Issuer Row */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">
              Date
            </label>
            <input
              type="date"
              value={insightData?.published_date || ""}
              onChange={(e) =>
                setInsightData({
                  ...insightData,
                  published_date: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">
              Issuer
            </label>
            <input
              type="text"
              value={insightData?.issuer || ""}
              onChange={(e) =>
                setInsightData({ ...insightData, issuer: e.target.value })
              }
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Name Field */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">
            Name
          </label>
          <input
            type="text"
            value={insightData?.name || ""}
            onChange={(e) =>
              setInsightData({ ...insightData, name: e.target.value })
            }
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
        </div>

        {/* Summary Field */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">
            Summary
          </label>
          <textarea
            value={insightData?.summary || ""}
            onChange={(e) =>
              setInsightData({ ...insightData, summary: e.target.value })
            }
            className="w-full p-2 h-28 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            className={`text-green-600 dark:text-green-400 hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            className="text-red-600 dark:text-red-400 hover:underline focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
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
