"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { FaFilePdf, FaEdit, FaTrash, FaSort, FaPlus } from "react-icons/fa";
import { NEXT_PUBLIC_API_URL } from "@/config";
import Insight from "@/api/all";

const ResearchFilesList = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentInsight, setCurrentInsight] = useState<Partial<Insight> | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [expandedSummaries, setExpandedSummaries] = useState<string[]>([]);

  useEffect(() => {
    async function fetchInsights() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${NEXT_PUBLIC_API_URL}/api/data/insights/`
        );
        if (response.ok) {
          const data = await response.json();
          setInsights(data);
        } else {
          throw new Error("Failed to fetch insights");
        }
      } catch (error) {
        console.error("Error fetching insights:", error);
        setError("Unable to fetch insights.");
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, []);

  const openModal = (insight: Partial<Insight> | null = null) => {
    setCurrentInsight(insight);
    setFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentInsight(null);
    setFile(null);
    setIsModalOpen(false);
  };

  const convertPdfToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const arrayBuffer = event.target.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);

          // Use a more memory-efficient approach to create the Base64 string
          const binaryString = uint8Array.reduce(
            (acc, byte) => acc + String.fromCharCode(byte),
            ""
          );

          const base64String = btoa(binaryString);
          resolve(base64String);
        } else {
          reject(new Error("Failed to read file"));
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(file); // Read the file as ArrayBuffer
    });
  };

  const handleSaveInsight = async () => {
    try {
      setError(null);
      setSuccessMessage(null);

      let serializedPdf = null;

      if (file) {
        // Convert the PDF file to Base64
        serializedPdf = await convertPdfToBase64(file);
      }

      const payload = {
        issuer: currentInsight?.issuer || "",
        name: currentInsight?.name || "",
        published_date: currentInsight?.published_date
          ? new Date(currentInsight.published_date).toISOString().split("T")[0]
          : "",
        summary: currentInsight?.summary || "",
        content: serializedPdf, // Add the Base64 PDF string here
      };

      const endpoint = currentInsight?._id
        ? `${NEXT_PUBLIC_API_URL}/api/data/insights/update/${currentInsight._id}`
        : `${NEXT_PUBLIC_API_URL}/api/data/insights/new`;

      const method = currentInsight?._id ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Send JSON with the Base64 PDF content
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to save insight");
      }

      const updatedInsight = await response.json();
      if (currentInsight?._id) {
        setInsights((prev) =>
          prev.map((i) => (i._id === updatedInsight._id ? updatedInsight : i))
        );
      } else {
        setInsights((prev) => [updatedInsight, ...prev]);
      }

      setSuccessMessage(
        currentInsight?._id
          ? "Insight updated successfully."
          : "Insight added successfully."
      );
      closeModal();
    } catch (err) {
      console.error("Error saving insight:", err);
      setError("Failed to save insight. Please try again.");
    }
  };

  const handleDeleteInsight = async (id: string) => {
    try {
      setError(null);
      setSuccessMessage(null);

      const response = await fetch(
        `${NEXT_PUBLIC_API_URL}/api/data/insights/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete insight");
      }

      setInsights((prev) => prev.filter((i) => i._id !== id));
      setSuccessMessage("Insight deleted successfully.");
    } catch (err) {
      console.error("Error deleting insight:", err);
      setError("Failed to delete insight. Please try again.");
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const toggleSummary = (id: string) => {
    setExpandedSummaries((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const filteredInsights = (insights || []).filter(
    ({ issuer, name, published_date, summary }) => {
      const term = searchTerm.toLowerCase();
      return (
        issuer.toLowerCase().includes(term) ||
        name.toLowerCase().includes(term) ||
        (published_date && published_date.includes(term)) ||
        (summary && summary.toLowerCase().includes(term))
      );
    }
  );

  const sortedInsights = filteredInsights.sort((a, b) => {
    const dateA = new Date(a.published_date || "").getTime();
    const dateB = new Date(b.published_date || "").getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  if (loading) return <div className="text-white">Loading insights...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col gap-4 w-full h-full text-white">
      {/* Search and Add Section */}
      <div className="flex items-center gap-4 w-full">
        <input
          type="text"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-800 text-white text-sm"
        />
        <button
          onClick={toggleSortOrder}
          className="flex items-center gap-2 p-2 text-white bg-gray-700 rounded hover:bg-gray-600"
        >
          <FaSort />
          Sort ({sortOrder === "asc" ? "↑" : "↓"})
        </button>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 p-2 text-white bg-green-700 rounded hover:bg-green-600"
        >
          <FaPlus />
          Add Insight
        </button>
      </div>

      {/* Success/Error Messages */}
      {successMessage && <div className="text-green-500">{successMessage}</div>}
      {error && <div className="text-red-500">{error}</div>}

      {/* Insights Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {sortedInsights.map((insight) => {
          const isExpanded = expandedSummaries.includes(insight._id);
          return (
            <div
              key={insight._id}
              className="p-4 bg-gray-800 border border-gray-700 rounded-lg hover:shadow-lg transition relative"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="px-2 py-1 bg-blue-700 rounded text-sm font-semibold">
                  {insight.issuer}
                </div>
                <div className="px-2 py-1 bg-gray-700 rounded text-sm font-semibold">
                  {insight.published_date || "Invalid Date"}
                </div>
              </div>
              <h2 className="text-lg font-bold mb-2">{insight.name}</h2>
              <div className="text-sm text-gray-300 mb-4">
                <ReactMarkdown>
                  {isExpanded
                    ? insight.summary || "No summary available."
                    : (insight.summary?.substring(0, 100) ||
                        "No summary available") +
                      ((insight.summary?.length ?? 0) > 100 ? "..." : "")}
                </ReactMarkdown>
                {insight.summary && insight.summary.length > 100 && (
                  <button
                    onClick={() => toggleSummary(insight._id)}
                    className="mt-2 text-blue-400 text-xs hover:underline"
                  >
                    {isExpanded ? "Show Less" : "Show More"}
                  </button>
                )}
              </div>
              <div className="flex justify-between items-center">
                <FaFilePdf
                  className="text-red-500 cursor-pointer hover:scale-110"
                  onClick={() => {
                    const pdfUrl = `${NEXT_PUBLIC_API_URL}/api/data/insights/${insight._id}`;
                    console.log("Opening PDF:", pdfUrl);
                    window.open(pdfUrl, "_blank");
                  }}
                  title="Open PDF"
                  size={24}
                />
                <button
                  className="text-green-400 hover:underline"
                  onClick={() => openModal(insight)}
                >
                  <FaEdit className="inline-block mr-2" />
                  Edit
                </button>
                <button
                  className="text-red-400 hover:underline"
                  onClick={() => handleDeleteInsight(insight._id)}
                >
                  <FaTrash className="inline-block mr-2" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Add/Edit Insight */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4">
          <div className="bg-gray-800 p-8 rounded-lg max-w-4xl w-full min-h-[400px]">
            <h3 className="text-white font-bold mb-6 text-xl">
              {currentInsight?._id ? "Edit Insight" : "Add New Insight"}
            </h3>
            <div className="mb-6">
              <label className="block text-gray-400 text-sm">Issuer</label>
              <input
                type="text"
                value={currentInsight?.issuer || ""}
                onChange={(e) =>
                  setCurrentInsight({
                    ...currentInsight,
                    issuer: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 text-sm">Name</label>
              <input
                type="text"
                value={currentInsight?.name || ""}
                onChange={(e) =>
                  setCurrentInsight({ ...currentInsight, name: e.target.value })
                }
                className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 text-sm">Date</label>
              <input
                type="date"
                value={currentInsight?.published_date || ""}
                onChange={(e) =>
                  setCurrentInsight({
                    ...currentInsight,
                    published_date: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 text-sm">Summary</label>
              <textarea
                value={currentInsight?.summary || ""}
                onChange={(e) =>
                  setCurrentInsight({
                    ...currentInsight,
                    summary: e.target.value,
                  })
                }
                className="w-full p-4 border border-gray-600 rounded bg-gray-700 text-white text-lg"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 text-sm">PDF File</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white"
              />
            </div>
            <div className="flex justify-between">
              <button
                className="text-green-400 hover:underline"
                onClick={handleSaveInsight}
              >
                {currentInsight?._id ? "Update" : "Add"}
              </button>
              <button
                className="text-red-400 hover:underline"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchFilesList;
