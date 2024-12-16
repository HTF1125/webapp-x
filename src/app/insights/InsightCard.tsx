import React, { useState } from "react";
import { FaFilePdf, FaEdit, FaTrash } from "react-icons/fa";
import SummaryModal from "./SummaryModal";
import { deleteInsight } from "./api";
import Insight from "@/api/all";

const InsightCard: React.FC<{
  insight: Insight;
  selectedInsight: Insight | null;
  onSelectInsight: (insight: Insight | null) => void;
  isAdmin: boolean;
  onModify: (insight: Insight) => void;
  onDeleteComplete?: (deletedId: string) => void;
}> = ({
  insight,
  selectedInsight,
  onSelectInsight,
  isAdmin,
  onModify,
  onDeleteComplete,
}) => {
  const isOpen = selectedInsight?._id === insight._id;
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this insight?")) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteInsight(insight._id);
      if (onDeleteComplete) {
        onDeleteComplete(insight._id);
      }
    } catch (error) {
      console.error("Error deleting insight:", error);
      alert("Failed to delete the insight. Please try again later.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePdfClick = () => {
    const pdfUrl = `https://files.investment-x.app/${insight._id}.pdf`;
    window.open(pdfUrl, "_blank");
  };

  const handleToggleSummary = () => {
    if (isOpen) {
      onSelectInsight(null);
    } else {
      onSelectInsight(insight);
    }
  };

  return (
    <div className="relative w-full p-3 border border-gray-700 bg-gray-800 rounded-lg shadow-md transition hover:shadow-lg overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 sm:space-x-4">
        {/* Issuer section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm px-5 py-2 rounded-full font-bold shadow-lg truncate flex-shrink-0 text-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-800 transition-all duration-200 ease-in-out">
          {insight.issuer}
        </div>

        {/* Name section - click triggers summary modal */}
        <div
          className="flex-grow truncate cursor-pointer min-w-0"
          onClick={handleToggleSummary} // Open summary only when name is clicked
        >
          <h2 className="text-white text-sm font-semibold hover:underline">
            {insight.name}
          </h2>
        </div>

        {/* Admin controls */}
        {isAdmin && (
          <div className="flex items-center space-x-2">
            <button
              className="text-blue-500 hover:text-blue-400 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation(); // Prevent parent handlers from firing
                onModify(insight); // Trigger modify action
              }}
            >
              <FaEdit size={20} />
            </button>
            <button
              className={`text-red-500 hover:text-red-400 focus:outline-none ${
                isDeleting ? "opacity-50" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent parent handlers from firing
                handleDelete(); // Trigger delete action
              }}
              disabled={isDeleting}
            >
              <FaTrash size={20} />
            </button>
          </div>
        )}

        {/* PDF and date section */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="text-gray-400 text-xs whitespace-nowrap">
            {new Date(insight.published_date).toLocaleDateString()}
          </div>
          <button
            className="text-red-500 hover:text-red-400 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation(); // Prevent parent handlers from firing
              handlePdfClick(); // Open PDF
            }}
          >
            <FaFilePdf size={20} />
          </button>
        </div>
      </div>

      {/* Summary Modal */}
      <SummaryModal
        isOpen={isOpen}
        onClose={() => onSelectInsight(null)}
        summary={insight.summary || ""}
      />
    </div>
  );
};

export default InsightCard;
