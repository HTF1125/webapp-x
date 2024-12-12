"use client";

import React, { useState } from "react";
import Insight from "@/api/all";
interface AddInsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (insight: Partial<Insight>, file: File | null) => Promise<void>;
}

const AddInsightModal: React.FC<AddInsightModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [currentInsight, setCurrentInsight] = useState<Partial<Insight>>({});
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(currentInsight, file);
      onClose(); // Close modal on successful save
    } catch (error) {
      console.error("Error saving insight:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg max-w-4xl w-full min-h-[400px]">
        <h3 className="text-white font-bold mb-6 text-xl">Add New Insight</h3>
        <div className="mb-6">
          <label className="block text-gray-400 text-sm">Issuer</label>
          <input
            type="text"
            value={currentInsight?.issuer || ""}
            onChange={(e) =>
              setCurrentInsight({ ...currentInsight, issuer: e.target.value })
            }
            className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-400 text-sm">Name</label>
          <input
            type="text"
            value={currentInsight?.name || ""}
            onChange={(e) =>
              setCurrentInsight({ ...currentInsight, name: e.target.value })
            }
            className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-400 text-sm">Date</label>
          <input
            type="date"
            value={currentInsight?.published_date || ""}
            onChange={(e) =>
              setCurrentInsight({
                ...currentInsight,
                published_date: e.target.value,
              })
            }
            className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-400 text-sm">Summary</label>
          <textarea
            value={currentInsight?.summary || ""}
            onChange={(e) =>
              setCurrentInsight({ ...currentInsight, summary: e.target.value })
            }
            className="w-full p-4 border border-gray-600 rounded bg-gray-700 text-white text-lg"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-400 text-sm">PDF File</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="flex justify-between">
          <button
            className={`text-green-400 hover:underline ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Add"}
          </button>
          <button
            className="text-red-400 hover:underline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddInsightModal;
