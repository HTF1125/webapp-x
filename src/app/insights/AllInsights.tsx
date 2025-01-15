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
import InsightCard from "./InsightCard";
import { useAuth } from "@/context/Auth/AuthContext";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";

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

  const { isAdmin } = useAuth();

  return (
    <div className="w-full bg-background text-foreground flex flex-col items-center px-4 py-6 space-y-6">
      {/* Header with Search Bar and Action Button */}
      <div className="w-full flex items-center justify-between gap-4 px-4 py-2">
        <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
        <Button
          onClick={() => setIsSourceListVisible(true)}
          className="w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Source
        </Button>
      </div>

      {/* Drag-and-Drop Section for PDFs */}
      <div className="w-full my-4">
        <DragAndDrop message="Upload PDF Insights" />
      </div>

      {/* Insights Section: Cards */}
      <div className="w-full bg-background border border-divider rounded-lg p-4 max-h-[600px] overflow-y-auto">
        <div className="w-full space-y-4">
          {insights.length > 0 ? (
            insights.map((insight) => (
              <InsightCard key={insight._id} insight={insight} isAdmin={isAdmin} />
            ))
          ) : (
            <div className="text-center text-muted py-3">No insights found.</div>
          )}
        </div>

        {/* Load More Button */}
        {!isLoadingMore && insights.length > 0 && (
          <Button
            onClick={handleLoadMore}
            className="mt-4 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Load More
          </Button>
        )}

        {/* Loading Spinner */}
        {isLoadingMore && (
          <div className="mt-4">
            <LoadingSpinner message="Loading more..." />
          </div>
        )}
      </div>

      {/* Source List Modal */}
      <Modal
        isOpen={isSourceListVisible}
        size="5xl"
        onOpenChange={(open) => {
          if (!open) {
            setIsSourceListVisible(false);
          }
        }}
        className="bg-background overflow-hidden"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="text-foreground text-2xl font-bold">Source List</ModalHeader>
              <ModalBody className="h-[80vh] overflow-y-auto p-4">
                <SourceList />
              </ModalBody>
              <ModalFooter className="flex justify-end">
                <Button
                  color="danger"
                  variant="default"
                  onClick={() => {
                    setIsSourceListVisible(false);
                  }}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

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
          onClose={() => setSelectedInsight(null)}
        />
      )}
    </div>
  );
};

export default AllInsights;
