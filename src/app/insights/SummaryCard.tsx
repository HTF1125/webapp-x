import React, { useState, useEffect, useRef } from "react";
import { FaFilePdf, FaEdit, FaTrash, FaEllipsisV, FaSync } from "react-icons/fa";
import { Insight } from "@/api/all";
import { updateInsightSummary } from "./api";

interface SummaryCardProps {
  insight: Insight;
  isAdmin: boolean;
  onOpenSummaryModal: (summary: string) => void;
  onOpenUpdateModal: (insight: Insight) => void;
  onDelete: () => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  insight,
  isAdmin,
  onOpenSummaryModal,
  onOpenUpdateModal,
  onDelete,
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownOpen((prev) => !prev);
  };

  const handleUpdateSummary = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setDropdownOpen(false);
      const result = await updateInsightSummary(insight._id);
      alert(result);
    } catch (error) {
      console.error("Error updating summary:", error);
      alert("Failed to update the insight summary. Please try again.");
    }
  };

  const handlePdfClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(
      `https://files.investment-x.app/${insight._id}.pdf`,
      "pdfWindow",
      "width=800,height=600,resizable,scrollbars"
    );
  };

  return (
    <div className="relative mb-4">
      <div
        className="bg-gradient-to-r from-blue-600 to-slate-700 text-white rounded-lg p-4 w-full flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-lg hover:shadow-xl hover:scale-[1.01] transition transform cursor-pointer relative z-0 overflow-visible"
        onClick={() => onOpenSummaryModal(insight.summary ?? "")}
        style={{ minHeight: "80px" }}
      >
        <div className="flex items-center w-full sm:w-auto mb-2 sm:mb-0">
          {/* Left: PDF Icon */}
          <div
            className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-md hover:shadow-lg transition mr-3"
            onClick={handlePdfClick}
          >
            <FaFilePdf className="text-blue-600 text-lg sm:text-xl" />
          </div>

          {/* Middle: Insight Details */}
          <div className="flex-grow overflow-hidden">
            <h2 className="text-sm font-bold truncate">{insight.name}</h2>
            <div className="text-xs text-slate-300 flex flex-col sm:flex-row sm:gap-4 mt-1">
              <p className="flex items-center truncate">
                <span className="font-medium text-white">Issuer:</span>{" "}
                <span className="ml-1 truncate">{insight.issuer}</span>
              </p>
              <p className="flex items-center whitespace-nowrap">
                <span className="font-medium text-white">Published:</span>{" "}
                <span className="ml-1">
                  {new Date(insight.published_date).toLocaleDateString()}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Admin Actions */}
        {isAdmin && (
          <div
            className="relative flex-shrink-0 self-end sm:self-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={buttonRef}
              onClick={handleDropdownToggle}
              className="text-white hover:text-blue-300 p-2 rounded-full bg-blue-600 hover:bg-blue-500 transition"
            >
              <FaEllipsisV />
            </button>
          </div>
        )}
      </div>

      {/* Dropdown menu */}
      {isAdmin && isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-44 bg-slate-800 text-white rounded-lg shadow-xl z-50"
          style={{ top: "100%", right: "0" }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen(false);
              onOpenUpdateModal(insight);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-slate-700"
          >
            <FaEdit className="inline-block mr-2 text-blue-400" />
            Edit
          </button>
          <button
            onClick={handleUpdateSummary}
            className="block w-full text-left px-4 py-2 hover:bg-slate-700"
          >
            <FaSync className="inline-block mr-2 text-green-400" />
            Update
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen(false);
              onDelete();
            }}
            className="block w-full text-left px-4 py-2 hover:bg-slate-700"
          >
            <FaTrash className="inline-block mr-2 text-red-400" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default SummaryCard;
