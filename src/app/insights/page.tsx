// src/pages/InsightPage.tsx

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { fetchInsights, createInsightWithPDF, deleteInsight } from "./api";
import DragAndDrop from "@/components/DragAndDrop";
import LoadingSpinner from "@/components/LoadingSpinner";
import SearchBar from "@/components/SearchBar";
import SummaryModal from "./SummaryModal";
import UpdateModal from "./UpdateModal";
import { Insight } from "@/api/all";
import SummaryCard from "./SummaryCard";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/Progress/ProgressContext";

const InsightPage = () => {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading } = useAuth();

  const [allInsights, setAllInsights] = useState<Insight[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [selectedSummary, setSelectedSummary] = useState<string | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"success" | "error" | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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

  // Basic search handler
  const handleSearch = useCallback(
    (value: string) => {
      setSearchTerm(value);
      if (value) {
        const filtered = allInsights.filter((insight) =>
          ["name", "issuer"].some((key) =>
            insight[key as keyof Insight]?.toString().toLowerCase().includes(value.toLowerCase())
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
      updateTask(taskId, 50);
      await deleteInsight(id);

      setAllInsights((prev) => prev.filter((item) => item._id !== id));
      setInsights((prev) => prev.filter((item) => item._id !== id));

      updateTask(taskId, 100);
      setTimeout(() => removeTask(taskId), 2000);
    } catch (error) {
      console.error("Error deleting insight:", error);
      setTaskError(taskId, "Failed to delete insight. Please try again.");
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
      {/* 1. Uploading overlay/spinner */}
      {isUploading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-[999]">
          <LoadingSpinner message={`Uploading files... ${uploadProgress}%`} />
        </div>
      )}

      {/* 2. Successful upload */}
      {uploadStatus === "success" && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-[999]">
          <LoadingSpinner
            isComplete
            completeMessage="Files uploaded successfully!"
            onClose={() => setUploadStatus(null)}
          />
        </div>
      )}

      {/* 3. Error during upload */}
      {uploadStatus === "error" && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-[999]">
          <LoadingSpinner
            isError
            errorMessage="Failed to upload files. Please try again."
            onClose={() => setUploadStatus(null)}
          />
        </div>
      )}

      {/* 4. Insights loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-[999]">
          <LoadingSpinner message="Loading insights..." />
        </div>
      )}

      {/* Search Bar */}
      <div className="w-full max-w-2xl">
        <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
      </div>

      {/* Drag and Drop for Admin users */}
      {isAdmin && (
        <div className="w-full max-w-2xl">
          <DragAndDrop
            message="Upload PDF Insights"
            onFilesAdded={handleFilesAdded}
            accept="application/pdf"
            onError={(error) => console.error("Drag and drop error:", error)}
            onUploadComplete={handleUpload}
          />
        </div>
      )}

      {/* Insights Grid */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-4
          w-full
          max-w-7xl
        "
      >
        {insights.length > 0 ? (
          insights.map((insight) => (
            <SummaryCard
              key={insight._id}
              insight={insight}
              isAdmin={isAdmin}
              onOpenSummaryModal={setSelectedSummary}
              onOpenUpdateModal={setSelectedInsight}
              onDelete={() => handleDelete(insight._id, insight.name)}
            />
          ))
        ) : (
          <p className="text-gray-600 text-base">No insights found.</p>
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
