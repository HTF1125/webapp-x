import React, { useState, useEffect, useRef } from "react";
import { FaFilePdf, FaEdit, FaTrash, FaEllipsisV } from "react-icons/fa";
import { Insight } from "@/api/all";

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      onClick={() => onOpenSummaryModal(insight.summary ?? "")}
      className="
        bg-slate-800
        text-white
        rounded-lg
        p-4
        w-full
        transition
        shadow-md
        hover:shadow-lg
        hover:scale-[1.01]
        overflow-hidden
        relative
        cursor-pointer
      "
    >
      {/* Header: Title */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{insight.name}</h2>

        {/* Dropdown for Edit and Delete */}
        <div
          className="relative"
          onClick={(e) => e.stopPropagation()} // Prevent card click when interacting with dropdown
        >
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="text-white hover:text-slate-300 p-2 rounded-full"
          >
            <FaEllipsisV />
          </button>
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="
                absolute
                right-0
                mt-2
                w-40
                bg-slate-700
                text-white
                rounded-md
                shadow-lg
                z-20
                overflow-hidden
              "
            >
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  onOpenUpdateModal(insight);
                }}
                className="
                  block
                  w-full
                  text-left
                  px-4
                  py-2
                  hover:bg-slate-600
                "
              >
                <div className="flex items-center gap-2">
                  <FaEdit />
                  <span>Edit</span>
                </div>
              </button>
              {isAdmin && (
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onDelete();
                  }}
                  className="
                    block
                    w-full
                    text-left
                    px-4
                    py-2
                    hover:bg-slate-600
                  "
                >
                  <div className="flex items-center gap-2">
                    <FaTrash />
                    <span>Delete</span>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Issuer & Published Date */}
      <p className="text-xs text-slate-400 mb-2">
        Issuer:{" "}
        <span className="font-semibold text-slate-200">{insight.issuer}</span>
      </p>
      <p className="text-xs text-slate-400">
        Published:{" "}
        <span className="font-semibold text-slate-200">
          {new Date(insight.published_date).toLocaleDateString()}
        </span>
      </p>

      {/* PDF Button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent card click when button is clicked
          window.open(
            `https://files.investment-x.app/${insight._id}.pdf`,
            "pdfWindow",
            "width=800,height=600,resizable,scrollbars"
          );
        }}
        title="Download PDF"
        className="
          text-red-400
          hover:text-red-300
          p-2
          rounded-full
          absolute
          right-3
          bottom-3
          bg-slate-700
          shadow-md
        "
      >
        <FaFilePdf size={20} />
      </button>
    </div>
  );
};

export default SummaryCard;
