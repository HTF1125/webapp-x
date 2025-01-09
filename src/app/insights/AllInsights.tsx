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
    <div className="w-full bg-black text-white flex flex-col items-center px-4 py-4">
      {/* Header, Search, and Actions */}
      <div className="w-full flex items-center justify-between px-4 py-2 mb-4">
        <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
        <Button
          onClick={() => setIsSourceListVisible(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Show Source List
        </Button>
      </div>

      {/* Drag-and-Drop for PDFs */}
      <div className="w-full my-2 z-0">
        <DragAndDrop message="Upload PDF Insights" />
      </div>

      {/* Insights Cards in a table-like structure */}
      <div className="w-full bg-black border border-gray-700 rounded p-4 max-h-[600px] overflow-y-auto">
        <div className="w-full space-y-4">
          {insights.length > 0 ? (
            insights.map((insight) => (
              <InsightCard
                key={insight._id}
                insight={insight}
                isAdmin={isAdmin}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 py-3">
              No insights found.
            </div>
          )}
        </div>

        {/* Load More Button */}
        {!isLoadingMore && insights.length > 0 && (
          <Button
            onClick={handleLoadMore}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
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

      {/* SourceList Modal */}
      {/* SourceList Modal */}
      <Modal
        isOpen={isSourceListVisible}
        size="5xl" // Make the modal fullscreen
        onOpenChange={(open) => {
          if (!open) {
            setIsSourceListVisible(false);
          }
        }}
        className="bg-black overflow-hidden"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="text-white text-2xl font-bold">
                Source List
              </ModalHeader>
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
