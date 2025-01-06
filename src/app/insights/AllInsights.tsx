"use client";

import React from "react";
import { useInsights } from "./provider";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/LoadingSpinner";
import SearchBar from "@/components/SearchBar";
import DragAndDrop from "./DragAndDrop";
import SummarySheet from "./SummaryModal";
import EditInsight from "./EditInsight";
import SourceList from "./SourceList"; // Ensure this component exists
import { ScrollShadow } from "@nextui-org/react"; // Assuming NextUI's ScrollShadow component
import InsightCard from "./InsightCard";

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
        <DragAndDrop message="Upload PDF Insights" />
      </div>

      {/* SourceList visibility toggled here */}
      {isSourceListVisible && <SourceList />}

      {/* Insights Cards in a table-like structure */}
      <ScrollShadow className="w-full bg-black border border-gray-700 rounded shadow-lg p-4 max-h-[400px] overflow-y-auto">
        <div className="w-full space-y-4">
          {insights.length > 0 ? (
            insights.map((insight) => (
              <InsightCard key={insight._id} insight={insight} />
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
