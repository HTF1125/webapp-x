"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Insight,
  fetchInsights,
  createInsightWithPDF,
  deleteInsight,
  updateInsightSummary,
} from "./api";
import DragAndDrop from "@/components/DragAndDrop";
import LoadingSpinner from "@/components/LoadingSpinner";
import SearchBar from "@/components/SearchBar";
import SummaryModal from "./SummaryModal";
import UpdateModal from "./UpdateModal";
import SummaryCard from "./SummaryCard";
import { useAuth } from "@/context/Auth/AuthContext";
import { useProgress } from "@/context/Progress/ProgressContext";
import InsightSourceList from "./InsightSource/SourceList";

const InsightPage = () => {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading } = useAuth();

  const [allInsights, setAllInsights] = useState<Insight[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDragAndDropVisible, setDragAndDropVisible] =
    useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [selectedSummary, setSelectedSummary] = useState<string | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"success" | "error" | null>(
    null
  );
  const [files, setFiles] = useState<File[]>([]);
  const [, setIsLoading] = useState<boolean>(true);
  const insightsFetchedRef = useRef(false);

  const { addTask, updateTask, removeTask, setTaskError } = useProgress();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push("/sign-in");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (loading || insightsFetchedRef.current) return;
      if (!isAuthenticated) return;

      try {
        setIsLoading(true);
        const fetchedInsights = await fetchInsights();
        if (Array.isArray(fetchedInsights)) {
          setAllInsights(fetchedInsights);
          setInsights(fetchedInsights);
          insightsFetchedRef.current = true;
        }
      } catch (error) {
        console.error("Error fetching insights:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, loading]);

  const handleSearch = useCallback(
    (value: string) => {
      setSearchTerm(value);
      if (value) {
        const filtered = allInsights.filter((insight) =>
          ["name", "issuer"].some((key) =>
            insight[key as keyof Insight]
              ?.toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          )
        );
        setInsights(filtered);
      } else {
        setInsights(allInsights);
      }
    },
    [allInsights]
  );

  const handleFilesAdded = (addedFiles: File[]) => {
    setFiles(addedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setUploadStatus("error");
      return;
    }
    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus(null);

    const convertPdfToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result && typeof reader.result === "string") {
            resolve(reader.result.split(",")[1]);
          } else {
            reject(new Error("Failed to convert file to Base64"));
          }
        };
        reader.onerror = () => reject(new Error("Error reading file"));
        reader.readAsDataURL(file);
      });
    };

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const base64Content = await convertPdfToBase64(file);

        const createdInsight = await createInsightWithPDF(base64Content);
        console.log("Created insight:", createdInsight);

        setAllInsights((prev) => [createdInsight, ...prev]);
        setInsights((prev) => [createdInsight, ...prev]);

        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      setUploadStatus("success");
      setFiles([]);
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, insightName: string) => {
    const userConfirmed = window.confirm(
      `Are you sure you want to delete the insight "${insightName}"? This action cannot be undone.`
    );
    if (!userConfirmed) return;

    const taskName = `Deleting Insight: ${insightName}`;
    const taskId = addTask(taskName);

    try {
      updateTask(taskId, false);
      await deleteInsight(id);

      setAllInsights((prev) => prev.filter((item) => item._id !== id));
      setInsights((prev) => prev.filter((item) => item._id !== id));

      updateTask(taskId, true);
      setTimeout(() => removeTask(taskId), 2000);
    } catch (error) {
      console.error("Error deleting insight:", error);
      setTaskError(taskId, "Failed to delete insight. Please try again.");
      setTimeout(() => removeTask(taskId), 4000);
    }
  };

  const handleUpdateSummary = async (updatedInsight: Insight) => {
    const taskName = `Updating Summary for ${updatedInsight.name}`;
    const taskId = addTask(taskName);

    try {
      updateTask(taskId, false);
      const summary = await updateInsightSummary(updatedInsight._id);

      // Use the result from the API to update the summary in the state
      const updatedInsights = insights.map((insight) =>
        insight._id === updatedInsight._id
          ? { ...insight, summary: summary } // Use the updated summary from the API response
          : insight
      );
      setInsights(updatedInsights);

      updateTask(taskId, true);
      setTimeout(() => removeTask(taskId), 2000);
    } catch (error) {
      console.error("Error updating summary:", error);
      setTaskError(taskId, "Failed to update summary. Please try again.");
      setTimeout(() => removeTask(taskId), 4000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Initializing..." />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center px-5 py-8 gap-8">
      {/* Uploading overlay/spinner */}

      {isUploading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-[999]">
          <LoadingSpinner message={`Uploading files... ${uploadProgress}%`} />
        </div>
      )}

      {uploadStatus === "success" && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-[999]">
          <LoadingSpinner
            isComplete
            completeMessage="Files uploaded successfully!"
            onClose={() => setUploadStatus(null)}
          />
        </div>
      )}

      {uploadStatus === "error" && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-[999]">
          <LoadingSpinner
            isError
            errorMessage="Failed to upload files. Please try again."
            onClose={() => setUploadStatus(null)}
          />
        </div>
      )}

      {/* Search Bar and Add Button */}
      <div className="w-full gap-10 max-w-3xl flex items-center justify-between">
        <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
        {isAdmin && (
          <button
            onClick={() => setDragAndDropVisible((prev) => !prev)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500"
          >
            {isDragAndDropVisible ? "Close Upload" : "Add Insights"}
          </button>
        )}
      </div>

      {/* Drag and Drop for Admin */}
      {isAdmin && isDragAndDropVisible && (
        <div className="w-full max-w-3xl">
          <DragAndDrop
            message="Upload PDF Insights"
            onFilesAdded={handleFilesAdded}
            accept="application/pdf"
            onError={(error) => console.error("Drag and drop error:", error)}
            onUploadComplete={handleUpload}
          />
        </div>
      )}

      {/* Insights List */}
      <div className="flex flex-col gap-2 w-full max-w-3xl mx-auto py-2 relative">
        <InsightSourceList />
        {insights.length > 0 ? (
          insights.map((insight) => (
            <div key={insight._id} className="relative">
              <SummaryCard
                insight={insight}
                isAdmin={isAdmin}
                onOpenSummaryModal={setSelectedSummary}
                onOpenUpdateModal={setSelectedInsight}
                onDelete={() => handleDelete(insight._id, insight.name)}
                onUpdateSummary={handleUpdateSummary} // Pass the update handler here
              />
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No insights found.</p>
          </div>
        )}
      </div>

      {/* Update Modal */}
      {selectedInsight && (
        <UpdateModal
          isOpen={!!selectedInsight}
          onClose={() => setSelectedInsight(null)}
          currentInsight={selectedInsight}
          onSaveComplete={(updatedInsight) => {
            const updatedInsights = insights.map((insight) =>
              insight._id === updatedInsight._id ? updatedInsight : insight
            );
            setInsights(updatedInsights);
          }}
        />
      )}

      {/* Summary Modal */}
      {selectedSummary && (
        <SummaryModal
          isOpen={!!selectedSummary}
          onClose={() => setSelectedSummary(null)}
          summary={selectedSummary}
        />
      )}
    </div>
  );
};

export default InsightPage;
