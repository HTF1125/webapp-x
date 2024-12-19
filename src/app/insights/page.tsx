"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // For client-side navigation
import { fetchInsights, createInsight, deleteInsight } from "./api";
import DragAndDrop from "@/components/DragAndDrop";
import LoadingSpinner from "@/components/LoadingSpinner";
import SearchBar from "@/components/SearchBar";
import SummaryModal from "./SummaryModal";
import { FaFilePdf, FaEdit, FaTrash } from "react-icons/fa";
import Insight from "@/api/all";
import { fetchAdmin } from "@/api/login";
import UpdateModal from "./UpdateModal";

const Page = () => {
  const router = useRouter();
  const [allInsights, setAllInsights] = useState<Insight[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // Track admin status
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedSummary, setSelectedSummary] = useState<string | null>(null); // Store the selected summary
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<"success" | "error" | null>(null);
  const [deleteStatus, setDeleteStatus] = useState<"success" | "error" | null>(null);
  const [files, setFiles] = useState<File[]>([]); // Track selected files
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null); // Track selected insight for editing

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("No token found. Redirecting to /sign-in.");
        router.push("/sign-in");
        return;
      }

      setIsAuthenticated(true);

      try {
        // Fetch insights
        const fetchedInsights = await fetchInsights();
        console.log("Fetched insights:", fetchedInsights);

        if (Array.isArray(fetchedInsights)) {
          setAllInsights(fetchedInsights);
          setInsights(fetchedInsights);
        } else {
          console.warn("Unexpected data format from fetchInsights:", fetchedInsights);
        }

        // Check admin status
        const adminStatus = await fetchAdmin(token);
        console.log("Admin status:", adminStatus);
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error("Error fetching insights or admin status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleSearch = (value: string) => {
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
  };

  const handleSelectSuggestion = (snippet: string) => {
    const filtered = allInsights.filter((insight) =>
      snippet.includes(`${insight.issuer} : ${insight.name}`)
    );
    setInsights(filtered);
  };

  const handleFilesAdded = (addedFiles: File[]) => {
    setFiles(addedFiles); // Set selected files to display names
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setUploadStatus("error");
      return; // Don't proceed if no files are selected
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus(null);

    const convertPdfToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result && typeof reader.result === "string") {
            resolve(reader.result.split(",")[1]); // Extract Base64 content
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
        const fileName = file.name;

        // Regex to match file name format YYYYMMDD_ISSUER_NAME.pdf
        const regex = /^(\d{8})_(.*?)_(.*?)\.pdf$/;
        const match = fileName.match(regex);

        if (!match) {
          console.error(`Invalid file format: ${fileName}`);
          continue; // Skip invalid files
        }

        const [, date, issuer, name] = match;

        const base64Content = await convertPdfToBase64(file);

        const payload = {
          published_date: `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`,
          issuer: issuer.replace(/_/g, " "),
          name: name.replace(/_/g, " "),
          summary: "Uploaded via drag and drop",
          content: base64Content,
        };

        const createdInsight = await createInsight(payload);

        setAllInsights((prev) => [createdInsight, ...prev]);
        setInsights((prev) => [createdInsight, ...prev]);

        console.log(`Insight created successfully for file: ${fileName}`);
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      setUploadStatus("success");
      setFiles([]); // Clear file names after upload
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    setDeleteStatus(null);

    try {
      await deleteInsight(id);
      setAllInsights((prev) => prev.filter((insight) => insight._id !== id));
      setInsights((prev) => prev.filter((insight) => insight._id !== id));
      setDeleteStatus("success");
    } catch (error) {
      console.error("Error deleting insight:", error);
      setDeleteStatus("error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenUpdateModal = (insight: Insight) => {
    setSelectedInsight(insight); // Set the selected insight to be edited
  };

  const handleCloseUpdateModal = () => {
    setSelectedInsight(null); // Close the modal when canceling
  };

  const handleOpenSummaryModal = (summary: string) => {
    setSelectedSummary(summary); // Set selected summary for displaying in modal
  };

  const handleCloseSummaryModal = () => {
    setSelectedSummary(null); // Close the summary modal
  };

  const handleCloseUploadStatus = () => {
    setUploadStatus(null);
  };

  const handleCloseDeleteStatus = () => {
    setDeleteStatus(null);
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center p-6 space-y-8 relative">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <LoadingSpinner message="Loading insights..." />
        </div>
      )}

      {isAuthenticated ? (
        <>
          <SearchBar
            searchTerm={searchTerm}
            suggestions={allInsights.map((insight) => ({
              issuer: insight.issuer,
              name: insight.name,
            }))}
            filterBy={["issuer", "name"]}
            displayAttributes={["issuer", "name"]}
            onSearch={handleSearch}
            onSelect={handleSelectSuggestion}
          />

          {/* Show Drag and Drop only for admins */}
          {isAdmin && (
            <DragAndDrop
              message="Upload PDF Insights Format : YYYYMMDD_Issuer_Name.pdf"
              onFilesAdded={handleFilesAdded}
              accept="application/pdf"
              onError={(error) => console.error("Drag and drop error:", error)}
              onUploadComplete={handleUpload}
            />
          )}

          {isUploading && (
            <LoadingSpinner
              message="Uploading files..."
              progress={uploadProgress}
            />
          )}

          {uploadStatus === "success" && (
            <LoadingSpinner
              isComplete
              completeMessage="Files uploaded successfully!"
              onClose={handleCloseUploadStatus}
            />
          )}

          {uploadStatus === "error" && (
            <LoadingSpinner
              isError
              errorMessage="Failed to upload files. Please try again."
              onClose={handleCloseUploadStatus}
            />
          )}

          {isDeleting && <LoadingSpinner message="Deleting insight..." />}

          {deleteStatus === "success" && (
            <LoadingSpinner
              isComplete
              completeMessage="Insight deleted successfully!"
              onClose={handleCloseDeleteStatus}
            />
          )}

          {deleteStatus === "error" && (
            <LoadingSpinner
              isError
              errorMessage="Failed to delete insight. Please try again."
              onClose={handleCloseDeleteStatus}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
            {insights.length > 0 ? (
              insights.map((insight) => (
                <div
                  key={insight._id}
                  className="p-6 bg-gray-800 border border-gray-700 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                  onClick={() => handleOpenSummaryModal(insight.summary || "No summary available.")}
                >
                  {/* Top Row: Issuer and Date */}
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-blue-300">{insight.issuer}</h2>
                      <p className="text-sm text-gray-400">
                        {new Date(insight.published_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Middle Row: Name */}
                  <div className="mb-4 text-lg font-semibold text-gray-100">
                    {insight.name}
                  </div>

                  {/* Bottom Row: Buttons */}
                  {isAdmin && (
                    <div className="flex items-center space-x-4 mt-4">
                      <button
                        className="text-blue-500 hover:text-blue-400"
                        onClick={() => handleOpenUpdateModal(insight)}
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        className={`text-red-500 hover:text-red-400 ${
                          isDeleting ? "opacity-50 pointer-events-none" : ""
                        }`}
                        onClick={() => handleDelete(insight._id)}
                        disabled={isDeleting}
                      >
                        <FaTrash size={20} />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-400"
                        onClick={() =>
                          window.open(
                            `https://files.investment-x.app/${insight._id}.pdf`,
                            "_blank"
                          )
                        }
                      >
                        <FaFilePdf size={20} />
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No insights found.</p>
            )}
          </div>

          {selectedInsight && (
            <UpdateModal
              isOpen={!!selectedInsight}
              onClose={handleCloseUpdateModal}
              currentInsight={selectedInsight}
              onSaveComplete={(updatedInsight) => {
                const updatedInsights = insights.map((insight) =>
                  insight._id === updatedInsight._id ? updatedInsight : insight
                );
                setInsights(updatedInsights);
              }}
            />
          )}

          {selectedSummary && (
            <SummaryModal
              isOpen={!!selectedSummary}
              onClose={handleCloseSummaryModal}
              summary={selectedSummary}
            />
          )}
        </>
      ) : (
        <p className="text-gray-500">You need to be logged in to view insights.</p>
      )}
    </div>
  );
};

export default Page;
