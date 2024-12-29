"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/Auth/AuthContext";
import { Insight } from "./InsightApi";
import { FaFilePdf, FaEdit, FaTrash, FaSync } from "react-icons/fa";
import { MoreVerticalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import LoadingSpinner from "@/components/LoadingSpinner";
import SearchBar from "@/components/SearchBar";
import DragAndDrop from "@/components/DragAndDrop";
import SummarySheet from "./SummarySheet";
import EditInsight from "./EditInsight";
import { useInsights } from "./InsightHook";
import SourceList from "./SourceList"; // Import SourceList

// Helper function to convert a file (PDF) to base64
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        const result = reader.result as string;
        resolve(result.split(",")[1]);
      } else {
        reject("File reading result is null.");
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const InsightTable = () => {
  // If using AuthContext:
  const { isAuthenticated, isAdmin } = useAuth();

  // Hook usage
  const {
    insights,
    searchTerm,
    isLoadingMore,
    selectedSummary,
    selectedInsight,
    initializeInsights,
    handleSearch,
    handleLoadMore,
    handleDelete,
    handleUpdateSummary,
    handleUpdateInsight,
    handleCreateInsightWithPDF,
    setSelectedSummary,
    setSelectedInsight,
  } = useInsights();

  // For one-time initialization
  const [isClient, setIsClient] = useState(false);
  const initialized = useRef(false);

  // Check if we are in the browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
    }
  }, []);

  // Initialize data
  useEffect(() => {
    if (!initialized.current && isClient) {
      initializeInsights();
      initialized.current = true;
    }
  }, [isClient, initializeInsights]);

  // Upload states
  const [, setIsUploading] = useState<boolean>(false);
  const [, setUploadProgress] = useState<number>(0);
  const [, setUploadStatus] = useState<"success" | "error" | null>(null);
  const [isDragAndDropVisible, setIsDragAndDropVisible] = useState<boolean>(false);
  const [isHandlingFiles, setIsHandlingFiles] = useState<boolean>(false);
  const [isSourceListVisible, setIsSourceListVisible] = useState<boolean>(false); // Add state for SourceList visibility

  const handleFilesAdded = async (files: File[]) => {
    if (isHandlingFiles || files.length === 0) return;

    setIsHandlingFiles(true);
    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus(null);
    setIsDragAndDropVisible(false);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const base64Content = await convertFileToBase64(file);

        await handleCreateInsightWithPDF(file.name || "Untitled Insight", base64Content);
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }
      setUploadStatus("success");
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
      setIsHandlingFiles(false);
    }
  };

  // Helper to view summary
  const handleSelectSummary = (summary: string | null) => {
    setSelectedSummary(summary);
  };

  // Render row actions
  const renderInsightRowActions = (insight: Insight) => {
    if (isAuthenticated) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVerticalIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                window.open(`https://files.investment-x.app/${insight._id}.pdf`, "pdfWindow", "width=800,height=600,resizable,scrollbars");
              }}
            >
              <FaFilePdf className="inline mr-2" />
              PDF
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedInsight(insight);
                  }}
                >
                  <FaEdit className="inline mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateSummary(insight);
                  }}
                >
                  <FaSync className="inline mr-2" />
                  Update
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(insight);
                  }}
                  className="text-red-500"
                >
                  <FaTrash className="inline mr-2" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    // If not authenticated, just show a "View Summary" button
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleSelectSummary(insight.summary || "No summary available.");
        }}
        className="text-blue-400 text-xs"
      >
        View Summary
      </button>
    );
  };

  return (
    <div className="min-h-screen max-w-5xl bg-black text-white flex flex-col items-center px-4 py-6">
      {/* Header, Search, and Actions */}
      <div className="w-full flex items-center justify-between px-4 py-2 mb-6">
        <div className="flex items-center space-x-4 w-full">
          <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
          <div className="flex space-x-4">
            <Button
              onClick={() => setIsDragAndDropVisible((prev) => !prev)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 z-10"
            >
              {isDragAndDropVisible ? "Upload Complete" : "Upload PDF"}
            </Button>
            <Button
              onClick={() => setIsSourceListVisible((prev) => !prev)} // Toggle SourceList visibility
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {isSourceListVisible ? "Hide Source List" : "Show Source List"}
            </Button>
          </div>
        </div>
      </div>

      {/* Drag-and-Drop for PDFs */}
      {isDragAndDropVisible && (
        <div className="w-full max-w-5xl mb-4 mt-4 z-0">
          <DragAndDrop message="Upload PDF Insights" onFilesAdded={handleFilesAdded} />
        </div>
      )}

      {/* SourceList visibility toggled here */}
      {isSourceListVisible && <SourceList />}

      {/* Table Container */}
      <div className="w-full max-w-5xl bg-black border border-gray-700 rounded shadow-lg overflow-hidden z-0">
        <Table className="w-full table-fixed">
          <TableHeader className="bg-gray-800">
            <TableRow>
              <TableHead className="w-[40%] px-3 py-1 text-xs uppercase text-gray-400 text-left">
                Headline
              </TableHead>
              <TableHead className="w-[30%] px-3 py-1 text-xs uppercase text-gray-400 text-left">
                Issuer
              </TableHead>
              <TableHead className="w-[15%] px-3 py-1 text-xs uppercase text-gray-400 text-center">
                Date
              </TableHead>
              <TableHead className="w-[15%] px-3 py-1 text-xs uppercase text-gray-400 text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>

        <ScrollArea className="h-[70vh] z-0">
          <Table className="w-full">
            <TableBody>
              {insights.length > 0 ? (
                insights.map((insight) => (
                  <TableRow
                    key={insight._id}
                    onClick={() => handleSelectSummary(insight.summary || "No summary available.")}
                    className="cursor-pointer hover:bg-gray-900"
                  >
                    <TableCell className="w-[40%] px-3 py-1 text-xs text-white text-left break-words truncate">
                      {insight.name}
                    </TableCell>
                    <TableCell className="w-[30%] px-3 py-1 text-xs text-gray-400 text-left truncate">
                      {insight.issuer || "Unknown"}
                    </TableCell>
                    <TableCell className="w-[15%] px-3 py-1 text-xs text-gray-400 text-center truncate">
                      {new Date(insight.published_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="w-[15%] px-3 py-1 text-xs text-gray-100 text-center">
                      {renderInsightRowActions(insight)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 py-3">
                    No insights found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Loading More */}
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

      {/* SummarySheet */}
      {selectedSummary && (
        <SummarySheet
          isOpen={!!selectedSummary}
          onClose={() => setSelectedSummary(null)}
          summary={selectedSummary}
        />
      )}

      {/* Edit Insight dialog */}
      {selectedInsight && (
        <EditInsight
          currentInsight={selectedInsight}
          onSaveComplete={(updatedInsight) => {
            handleUpdateInsight(updatedInsight);
            setSelectedInsight(null);
          }}
          onClose={() => setSelectedInsight(null)} // Close modal on cancel
        />
      )}
    </div>
  );
};

export default InsightTable;
