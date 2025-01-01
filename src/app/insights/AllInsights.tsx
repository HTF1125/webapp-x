"use client";

import React from "react";
import { useInsights } from "./provider";
import { FileText, Edit2, RefreshCcw, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/LoadingSpinner";
import SearchBar from "@/components/SearchBar";
import DragAndDrop from "@/components/DragAndDrop";
import SummarySheet from "./SummarySheet";
import EditInsight from "./EditInsight";
import SourceList from "./SourceList"; // Ensure this component exists

const AllInsights = () => {
  const {
    insights,
    searchTerm,
    isLoadingMore,
    selectedSummary,
    selectedInsight,
    isSourceListVisible,
    handleSearch,
    handleLoadMore,
    handleDelete,
    handleUpdateSummary,
    handleFilesAdded,
    setIsSourceListVisible,
    setSelectedSummary,
    setSelectedInsight,
  } = useInsights();

  return (
    <div className="min-h-screen max-w-5xl bg-black text-white flex flex-col items-center px-4 py-6">
      {/* Header, Search, and Actions */}
      <div className="w-full flex items-center justify-between px-4 py-2 mb-6">
        <div className="flex items-center space-x-4 w-full">
          <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
          <div className="flex space-x-4">
            <Button
              onClick={() => setIsSourceListVisible((prev) => !prev)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {isSourceListVisible ? "Hide Source List" : "Show Source List"}
            </Button>
          </div>
        </div>
      </div>

      {/* Drag-and-Drop for PDFs */}
      <div className="w-full max-w-5xl my-2 z-0">
        <DragAndDrop
          message="Upload PDF Insights"
          onFilesAdded={handleFilesAdded}
        />
      </div>

      {/* SourceList visibility toggled here */}
      {isSourceListVisible && <SourceList />}

      {/* Cards Container */}
      <div className="w-full max-w-5xl bg-black border border-gray-700 rounded shadow-lg p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.length > 0 ? (
          insights.map((insight) => (
            <div
              key={insight._id}
              className="bg-black text-white border border-white rounded-lg p-4 flex flex-col h-full relative hover:bg-gray-900 transition-colors duration-200"
              onClick={() =>
                setSelectedSummary(insight.summary || "No summary available.")
              }
            >
              {/* Name Row */}
              <div className="text-sm font-semibold mb-2 truncate w-full">
                {insight.name}
              </div>

              {/* Issuer and Date Row */}
              <div className="flex justify-between text-xs text-gray-500 mb-4">
                <div className="text-gray-400">
                  {insight.issuer || "Unknown"}
                </div>
                <div>
                  {new Date(insight.published_date).toLocaleDateString()}
                </div>
              </div>

              {/* Actions Row */}
              <div className="flex justify-between space-x-3 mt-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(
                      `https://files.investment-x.app/${insight._id}.pdf`,
                      "pdfWindow",
                      "width=800,height=600,resizable,scrollbars"
                    );
                  }}
                  className="text-white text-xs"
                >
                  <FileText className="inline mr-1" />
                  PDF
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedInsight(insight);
                  }}
                  className="text-white text-xs"
                >
                  <Edit2 className="inline mr-1" />
                  Edit
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateSummary(insight);
                  }}
                  className="text-white text-xs"
                >
                  <RefreshCcw className="inline mr-1" />
                  Update
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(insight);
                  }}
                  className="text-white text-xs"
                >
                  <Trash className="inline mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-3">
            No insights found.
          </div>
        )}
      </div>

      {/* Load More Button */}
      {isLoadingMore && (
        <div className="mt-4">
          <LoadingSpinner message="Loading more..." />
        </div>
      )}
      {!isLoadingMore && insights.length > 0 && (
        <Button
          onClick={handleLoadMore}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Load More
        </Button>
      )}

      {/* SummarySheet Modal */}
      {selectedSummary && (
        <div className="max-h-[70%] overflow-y-auto">
          <SummarySheet
            isOpen={!!selectedSummary}
            onClose={() => setSelectedSummary(null)}
            summary={selectedSummary}
          />
        </div>
      )}

      {/* Edit Insight Modal */}
      {selectedInsight && (
        <EditInsight
          currentInsight={selectedInsight}
          onSaveComplete={(updatedInsight) => {
            setSelectedInsight(null);
          }}
          onClose={() => setSelectedInsight(null)}
        />
      )}
    </div>
  );
};

export default AllInsights;
