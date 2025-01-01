"use client";

import React from "react";
import { useInsights } from "./provider";
import { FileText, Edit2, RefreshCcw, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/LoadingSpinner";
import SearchBar from "@/components/SearchBar";
import DragAndDrop from "@/components/DragAndDrop";
import SummarySheet from "./SummaryModal";
import EditInsight from "./EditModal";
import { ScrollShadow } from "@nextui-org/react"; // Assuming NextUI's ScrollShadow component

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
    <div className="w-full max-w-5xl bg-black text-white flex flex-col items-center px-4 py-4">
      {/* Header, Search, and Actions */}
      <div className="w-full flex items-center justify-between px-4 py-2 mb-4">
        <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
        <Button
          onClick={() => setIsSourceListVisible((prev) => !prev)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {isSourceListVisible ? "Hide Source List" : "Show Source List"}
        </Button>
      </div>

      {/* Drag-and-Drop for PDFs */}
      <div className="w-full my-2 z-0">
        <DragAndDrop message="Upload PDF Insights" onFilesAdded={handleFilesAdded} />
      </div>

      {/* Insights Cards in a table-like structure */}
      <ScrollShadow className="w-full bg-black border border-gray-700 rounded shadow-lg p-4 max-h-[800px] overflow-y-auto">
        <div className="w-full space-y-4">
          {insights.length > 0 ? (
            insights.map((insight) => (
              <div
                key={insight._id}
                className="bg-black text-white border border-white rounded-lg p-4 flex items-center justify-between h-full relative hover:bg-gray-900 transition-colors duration-200"
                onClick={() => setSelectedSummary(insight.summary || "No summary available.")}
              >
                {/* Insight Info (Name, Issuer, Date) */}
                <div className="flex w-full items-center justify-between">
                  {/* Insight Name and Issuer */}
                  <div className="flex flex-col w-1/4">
                    <div className="text-sm font-semibold mb-1 truncate">{insight.name}</div>
                    <div className="text-xs text-gray-500">{insight.issuer || "Unknown"}</div>
                  </div>

                  {/* Publication Date */}
                  <div className="flex flex-col w-1/4">
                    <div className="text-xs text-gray-500">{new Date(insight.published_date).toLocaleDateString()}</div>
                  </div>

                  {/* Actions Section (PDF, Edit, Update, Delete) */}
                  <div className="flex space-x-2 text-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://files.investment-x.app/${insight._id}.pdf`, "pdfWindow", "width=800,height=600,resizable,scrollbars");
                      }}
                      className="text-white hover:text-cyan-400"
                    >
                      <FileText className="inline mr-1" />
                      PDF
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInsight(insight);
                      }}
                      className="text-white hover:text-cyan-400"
                    >
                      <Edit2 className="inline mr-1" />
                      Edit
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateSummary(insight);
                      }}
                      className="text-white hover:text-cyan-400"
                    >
                      <RefreshCcw className="inline mr-1" />
                      Update
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(insight);
                      }}
                      className="text-white hover:text-cyan-400"
                    >
                      <Trash className="inline mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-3">No insights found.</div>
          )}
        </div>

        {/* Load More Button */}
        {!isLoadingMore && insights.length > 0 && (
          <Button onClick={handleLoadMore} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
            Load More
          </Button>
        )}

        {/* Loading Spinner */}
        {isLoadingMore && (
          <div className="mt-4">
            <LoadingSpinner message="Loading more..." />
          </div>
        )}
      </ScrollShadow>

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
          onSaveComplete={() => {
            setSelectedInsight(null);
          }}
          onClose={() => setSelectedInsight(null)}
        />
      )}
    </div>
  );
};

export default AllInsights;
