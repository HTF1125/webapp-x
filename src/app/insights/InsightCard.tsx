"use client";

import React, { useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { NEXT_PUBLIC_API_URL } from "@/config";
import Insight from "@/api/all";

const InsightCard: React.FC<{ insight: Insight }> = ({ insight }) => {
  const [showSummary, setShowSummary] = useState(false);

  const handlePdfClick = () => {
    const pdfUrl = `${NEXT_PUBLIC_API_URL}/api/data/insights/${insight._id}`;
    window.open(pdfUrl, "_blank");
  };

  const toggleSummary = () => {
    setShowSummary((prev) => !prev);
  };

  return (
    <div className="relative p-4 border border-gray-700 rounded-lg shadow-md transition hover:border-blue-500">
      <div className="flex items-center justify-between">
        {/* Left Section: Issuer */}
        <span
          className="bg-blue-600 text-white text-xs px-3 py-1 rounded-md font-medium shadow text-center truncate flex-shrink-0"
          style={{ width: "100px" }}
        >
          {insight.issuer}
        </span>

        {/* Middle Section: Title */}
        <div
          className="flex-grow mx-4 min-w-0"
          onClick={toggleSummary}
        >
          <h2 className="text-white text-sm font-semibold truncate cursor-pointer hover:underline">
            {insight.name}
          </h2>
        </div>

        {/* Right Section: Date and PDF */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          <div className="text-gray-400 text-xs whitespace-nowrap">
            {new Date(insight.published_date).toLocaleDateString()}
          </div>
          <button
            className="flex items-center text-red-500 hover:text-red-400 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              handlePdfClick();
            }}
          >
            <FaFilePdf size={20} />
          </button>
        </div>
      </div>

      {/* Summary Section */}
      {showSummary && insight.summary && (
        <div className="mt-3 p-3 bg-gray-800 text-white text-sm rounded-md shadow-md">
          <h3 className="text-blue-400 font-bold mb-2">Summary</h3>
          <p className="text-gray-300 leading-tight">{insight.summary}</p>
        </div>
      )}
    </div>
  );
};

export default InsightCard;
