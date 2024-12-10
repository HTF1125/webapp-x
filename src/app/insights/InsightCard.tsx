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
    <div className="relative w-full p-3 border border-gray-700 bg-gray-800 rounded-lg shadow-md transition hover:shadow-lg overflow-hidden">
      {/* Flex Container */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 sm:space-x-4">
        {/* Issuer Section */}
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm px-5 py-2 rounded-full font-bold shadow-lg truncate flex-shrink-0 text-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-800 transition-all duration-200 ease-in-out"
          style={{ flex: "0 0 20%" }}
        >
          {insight.issuer}
        </div>

        {/* Title Section */}
        <div
          className="flex-grow truncate cursor-pointer min-w-0"
          onClick={toggleSummary}
          style={{ flex: "1" }}
        >
          <h2 className="text-white text-sm font-semibold hover:underline">
            {insight.name}
          </h2>
        </div>

        {/* Date and Icon Section */}
        <div
          className="flex items-center justify-end space-x-2 flex-shrink-0"
          style={{ flex: "0 0 25%" }}
        >
          {/* Date */}
          <div className="text-gray-400 text-xs whitespace-nowrap">
            {new Date(insight.published_date).toLocaleDateString()}
          </div>

          {/* PDF Icon */}
          <button
            className="text-red-500 hover:text-red-400 focus:outline-none"
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
        <div className="mt-4 p-3 bg-gray-900 text-white text-sm rounded-md shadow-inner">
          <h3 className="text-blue-400 font-bold mb-2">Summary</h3>
          <p className="text-gray-300 leading-relaxed">{insight.summary}</p>
        </div>
      )}
    </div>
  );
};

export default InsightCard;
