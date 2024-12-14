"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaVolumeUp, FaStop, FaFilePdf, FaEdit } from "react-icons/fa";
import Insight from "@/api/all";

const InsightCard: React.FC<{
  insight: Insight;
  selectedInsight: Insight | null; // Currently selected insight
  onSelectInsight: (insight: Insight | null) => void; // Function to select or deselect an insight
  isAdmin: boolean; // Check if the user is an admin
  onModify: (insight: Insight) => void; // Function to open the InsightModal
}> = ({ insight, selectedInsight, onSelectInsight, isAdmin, onModify }) => {
  const isOpen = selectedInsight?._id === insight._id; // Check if this insight's summary is open
  const [isReading, setIsReading] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.5);
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!isOpen) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      setCurrentCharIndex(0);
    }
  }, [isOpen]);

  const handleReadAloud = () => {
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      setCurrentCharIndex(0);
    } else if (insight.summary) {
      const utterance = new SpeechSynthesisUtterance(insight.summary || "");
      utterance.lang = "en-US";
      utterance.rate = speechRate;

      utterance.onboundary = (event) => {
        if (event.name === "word") {
          setCurrentCharIndex(event.charIndex);
        }
      };

      utterance.onend = () => {
        setIsReading(false);
        setCurrentCharIndex(0);
      };

      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsReading(true);
    }
  };

  const handleToggleSummary = () => {
    if (isOpen) {
      onSelectInsight(null); // Close the summary
    } else {
      onSelectInsight(insight); // Open this summary
    }
  };

  const handlePdfClick = () => {
    const pdfUrl = `https://files.investment-x.app/${insight._id}.pdf`;
    window.open(pdfUrl, "_blank");
  };

  const increaseSpeed = () => {
    setSpeechRate((prevRate) => Math.min(prevRate + 0.25, 2));
  };

  const decreaseSpeed = () => {
    setSpeechRate((prevRate) => Math.max(prevRate - 0.5, 0.5));
  };

  const renderSummaryWithHighlight = () => {
    if (!insight.summary) return null;

    const readText = insight.summary.substring(0, currentCharIndex);
    const unreadText = insight.summary.substring(currentCharIndex);

    return (
      <span>
        <span className="text-gray-500">{readText}</span>
        <span className="text-gray-100">{unreadText}</span>
      </span>
    );
  };

  return (
    <div className="relative w-full p-3 border border-gray-700 bg-gray-800 rounded-lg shadow-md transition hover:shadow-lg overflow-hidden">
      {/* Flex Container */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 sm:space-x-4">
        {/* Issuer Section */}
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm px-5 py-2 rounded-full font-bold shadow-lg truncate flex-shrink-0 text-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-800 transition-all duration-200 ease-in-out cursor-pointer"
          style={{ flex: "0 0 20%" }}
          onClick={handleToggleSummary} // Toggles the summary visibility
        >
          {insight.issuer}
        </div>

        {/* Title Section */}
        <div
          className="flex-grow truncate cursor-pointer min-w-0"
          onClick={handleToggleSummary} // Toggles the summary visibility
          style={{ flex: "1" }}
        >
          <h2 className="text-white text-sm font-semibold hover:underline">
            {insight.name}
          </h2>
        </div>

        {/* Admin Modify Button */}
        {isAdmin && (
          <button
            className="text-blue-500 hover:text-blue-400 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              onModify(insight); // Trigger modify action
            }}
          >
            <FaEdit size={20} />
          </button>
        )}

        {/* Date and PDF Section */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="text-gray-400 text-xs whitespace-nowrap">
            {new Date(insight.published_date).toLocaleDateString()}
          </div>
          <button
            className="text-red-500 hover:text-red-400 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation(); // Prevent toggling summary on PDF click
              handlePdfClick();
            }}
          >
            <FaFilePdf size={20} />
          </button>
        </div>
      </div>

      {/* Summary Section */}
      {isOpen && (
        <div className="mt-4 p-3 bg-gray-900 text-white text-sm rounded-md shadow-inner">
          <div className="flex items-center justify-between">
            <h3 className="text-blue-400 font-bold mb-2 flex-grow">Summary</h3>
            <div className="flex items-center space-x-2">
              <button
                className="px-2 py-1 bg-gray-700 text-white text-xs rounded-md hover:bg-gray-600"
                onClick={decreaseSpeed}
              >
                -
              </button>
              <span className="text-gray-300 text-xs">
                {speechRate.toFixed(2)}x
              </span>
              <button
                className="px-2 py-1 bg-gray-700 text-white text-xs rounded-md hover:bg-gray-600"
                onClick={increaseSpeed}
              >
                +
              </button>
              <button
                className={`text-blue-500 hover:text-blue-400 focus:outline-none ${
                  isReading ? "text-red-500" : ""
                }`}
                onClick={handleReadAloud}
              >
                {isReading ? <FaStop size={18} /> : <FaVolumeUp size={18} />}
              </button>
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed">
            {renderSummaryWithHighlight()}
          </p>
        </div>
      )}
    </div>
  );
};

export default InsightCard;
