import React, { useState, useEffect } from "react";
import { Insight } from "./api";
import { NEXT_PUBLIC_API_URL } from "@/config";

// Utility to convert PDF to Base64
export const convertPdfToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result && typeof reader.result === "string") {
        resolve(reader.result.split(",")[1]); // Extract Base64 content
      } else {
        reject("Failed to convert file to Base64");
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentInsight?: Partial<Insight>; // The insight to edit (if editing)
  onSaveComplete: (updatedInsight: Insight) => void; // Callback to refresh insights
}

const UpdateModal: React.FC<UpdateModalProps> = ({
  isOpen,
  onClose,
  currentInsight = {}, // Default to an empty object for adding a new insight
  onSaveComplete,
}) => {
  const [insightData, setInsightData] = useState<Partial<Insight>>(
    currentInsight
  );
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 2000); // Close the modal after 2 seconds of showing the success message
      return () => clearTimeout(timer);
    }
  }, [successMessage, onClose]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let serializedPdf = null;

      if (file) {
        serializedPdf = await convertPdfToBase64(file); // Convert PDF to Base64
      }

      const payload = {
        issuer: insightData?.issuer || "",
        name: insightData?.name || "",
        published_date: insightData?.published_date
          ? new Date(insightData.published_date).toISOString().split("T")[0]
          : "",
        summary: insightData?.summary || "",
        content: serializedPdf, // Add Base64 PDF content
      };

      const endpoint = insightData?._id
        ? `${NEXT_PUBLIC_API_URL}/api/data/insights/update/${insightData._id}`
        : `${NEXT_PUBLIC_API_URL}/api/data/insights/new`;

      const method = insightData?._id ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to save insight");
      }

      const updatedInsight = await response.json();

      setSuccessMessage(
        insightData._id
          ? "Insight updated successfully."
          : "Insight added successfully."
      );
      onSaveComplete(updatedInsight); // Notify the parent component to refresh data
    } catch (err) {
      console.error("Error saving insight:", err);
      setError("Failed to save insight. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-2">
      <div className="bg-gray-800 p-4 rounded-lg max-w-3xl w-full">
        <h3 className="text-white font-bold mb-4 text-lg">
          {insightData?._id ? "Edit Insight" : "Add New Insight"}
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

        {/* PDF File Field */}
        <div className="mb-4">
          <label className="block text-gray-400 text-sm">PDF File</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
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

export default UpdateModal;
