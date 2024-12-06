"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { FaFilePdf } from "react-icons/fa"; // Import PDF icon
import Insight from "@/api/all";
import { NEXT_PUBLIC_API_URL } from "@/config";

interface ResearchFilesListProps {
  insights: Insight[]; // List of Insight objects
}

const ResearchFilesList = ({ insights }: ResearchFilesListProps) => {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term
  const [expandedSummary, setExpandedSummary] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc"); // Sort order
  const [editingInsight, setEditingInsight] = useState<Partial<Insight> | null>(null);

  const updateInsight = async (_id: string, updates: Partial<Insight>) => {
    try {
      setError(null);
      setSuccessMessage(null);

      const endpoint = new URL(
        `api/data/insights/${encodeURIComponent(_id)}`,
        NEXT_PUBLIC_API_URL
      ).toString();

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update insight");
      }

      setSuccessMessage("Insight updated successfully.");
      setEditingInsight(null); // Close edit form
    } catch (err) {
      console.error("Error updating insight:", err);
      setError("Failed to update insight. Please try again.");
    }
  };

  const handleFileClick = (_id: string) => {
    try {
      const fileUrl = `${NEXT_PUBLIC_API_URL}/api/data/insights/${encodeURIComponent(
        _id
      )}`;
      window.open(fileUrl, "_blank");
    } catch (err) {
      console.error("Error opening file:", err);
      setError("Failed to open the file. Please try again.");
    }
  };

  const toggleSummary = (_id: string) => {
    setExpandedSummary(expandedSummary === _id ? null : _id);
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleEditClick = (insight: Insight) => {
    setEditingInsight(insight);
  };

  const handleEditSubmit = () => {
    if (editingInsight && editingInsight._id) {
      updateInsight(editingInsight._id, editingInsight);
    }
  };

  const filteredInsights = insights.filter(
    ({ issuer, name, date, summary }) => {
      const term = searchTerm.toLowerCase();
      return (
        issuer.toLowerCase().includes(term) ||
        name.toLowerCase().includes(term) ||
        (date && date.includes(term)) ||
        (summary && summary.toLowerCase().includes(term))
      );
    }
  );

  const sortedInsights = filteredInsights.sort((a, b) => {
    const dateA = new Date(a.date || "").getTime();
    const dateB = new Date(b.date || "").getTime();

    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="flex flex-col gap-4 w-full h-full text-white">
      <div className="w-full">
        <input
          type="text"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-800 text-white text-sm"
        />
      </div>

      <div className="flex-1 overflow-auto border border-gray-700 rounded bg-gray-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-700 sticky top-0 text-gray-300">
            <tr>
              <th className="px-4 py-2 border-b">Issuer</th>
              <th className="px-4 py-2 border-b">Name</th>
              <th
                className="px-4 py-2 border-b cursor-pointer"
                onClick={toggleSortOrder}
              >
                Date {sortOrder === "asc" ? "↑" : "↓"}
              </th>
              <th className="px-4 py-2 border-b">Summary</th>
              <th className="px-4 py-2 border-b">PDF</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedInsights.map((insight) => {
              const isExpanded = expandedSummary === insight._id;
              const shortSummary = insight.summary
                ? insight.summary.split("\n")[0]
                : "";

              return (
                <tr
                  key={insight._id}
                  className="hover:bg-gray-600 transition duration-150"
                >
                  <td className="px-4 py-2 border-b">{insight.issuer}</td>
                  <td className="px-4 py-2 border-b">{insight.name}</td>
                  <td className="px-4 py-2 border-b">{insight.date || "Invalid Date"}</td>
                  <td className="px-4 py-2 border-b">
                    <ReactMarkdown>
                      {isExpanded ? insight.summary : shortSummary}
                    </ReactMarkdown>
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    <FaFilePdf
                      className="text-red-500 cursor-pointer hover:scale-110"
                      onClick={() => handleFileClick(insight._id)}
                      title="Open PDF"
                      size={20}
                    />
                  </td>
                  <td className="px-4 py-2 border-b">
                    <button
                      className="text-blue-400 hover:underline"
                      onClick={() => toggleSummary(insight._id)}
                    >
                      {isExpanded ? "Show less" : "Show more"}
                    </button>
                    <button
                      className="text-green-400 hover:underline ml-2"
                      onClick={() => handleEditClick(insight)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredInsights.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-2 text-center text-gray-400 border-b"
                >
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingInsight && (
        <div className="p-4 border border-gray-700 bg-gray-800 rounded mt-4">
          <h3 className="text-white font-bold mb-2">Edit Insight</h3>
          <label className="block text-xs text-gray-400">
            Issuer
            <input
              type="text"
              value={editingInsight.issuer || ""}
              onChange={(e) =>
                setEditingInsight({
                  ...editingInsight,
                  issuer: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-600 rounded focus:outline-none bg-gray-700 text-white text-xs mt-1"
            />
          </label>
          <label className="block text-xs text-gray-400 mt-2">
            Name
            <input
              type="text"
              value={editingInsight.name || ""}
              onChange={(e) =>
                setEditingInsight({ ...editingInsight, name: e.target.value })
              }
              className="w-full p-2 border border-gray-600 rounded focus:outline-none bg-gray-700 text-white text-xs mt-1"
            />
          </label>
          <label className="block text-xs text-gray-400 mt-2">
            Date
            <input
              type="date"
              value={editingInsight.date || ""}
              onChange={(e) =>
                setEditingInsight({ ...editingInsight, date: e.target.value })
              }
              className="w-full p-2 border border-gray-600 rounded focus:outline-none bg-gray-700 text-white text-xs mt-1"
            />
          </label>
          <label className="block text-xs text-gray-400 mt-2">
            Summary
            <textarea
              value={editingInsight.summary || ""}
              onChange={(e) =>
                setEditingInsight({
                  ...editingInsight,
                  summary: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-600 rounded focus:outline-none bg-gray-700 text-white text-xs mt-1"
            />
          </label>
          <button
            className="text-green-400 hover:underline mt-2"
            onClick={handleEditSubmit}
          >
            Save
          </button>
          <button
            className="text-red-400 hover:underline mt-2 ml-4"
            onClick={() => setEditingInsight(null)}
          >
            Cancel
          </button>
        </div>
      )}

      {successMessage && (
        <div className="text-green-500 text-xs border border-green-600 p-2 rounded">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="text-red-500 text-xs border border-red-600 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default ResearchFilesList;
