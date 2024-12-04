"use client";

import React, { useState } from "react";

interface ResearchFilesListProps {
  researchFiles: string[]; // List of file codes from the API
}

const ResearchFilesList = ({ researchFiles }: ResearchFilesListProps) => {
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Track search input

  // Helper to parse and format date from YYYYMMDD to YYYY-MM-DD
  const parseAndFormatDate = (dateStr: string): string | null => {
    if (!/^\d{8}$/.test(dateStr)) return null; // Validate format
    const year = dateStr.slice(0, 4);
    const month = dateStr.slice(4, 6);
    const day = dateStr.slice(6, 8);
    return `${year}-${month}-${day}`;
  };

  // Process researchFiles to split and extract issuer, name, and date
  const processedFiles = researchFiles.map((file) => {
    const [issuer, name, dateWithExt] = file.split("_");
    const rawDate = dateWithExt.replace(".pdf", "").trim();
    const formattedDate = parseAndFormatDate(rawDate); // Parse date
    return { code: file, issuer, name, date: formattedDate, rawDate };
  });

  // Handle search and filtering
  const filteredFiles = processedFiles.filter(({ issuer, name, date }) => {
    const term = searchTerm.toLowerCase();
    return (
      issuer.toLowerCase().includes(term) ||
      name.toLowerCase().includes(term) ||
      (date && date.includes(term))
    );
  });

  const handleFileClick = (code: string) => {
    try {
      setError(null);

      // Generate the direct URL for the file
      const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/data/research_file/${encodeURIComponent(
        code
      )}`;

      // Open the file directly in a new tab
      window.open(fileUrl, "_blank");
    } catch (err) {
      console.error("Error opening file:", err);
      setError("Failed to open the file. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4  text-white w-full h-full max-w-4xl">
      <div className="w-full max-w-2xl">
        <input
          type="text"
          placeholder="Search Files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white text-sm"
          />
      </div>

      {/* Table Container */}
      <div className="w-full max-w-2xl overflow-auto h-60 border border-gray-700 rounded bg-gray-800">
        <table className="table-auto w-full text-left text-xs">
          <thead className="sticky top-0 bg-gray-700">
            <tr>
              <th className="px-4 py-2 border-b w-1/4">Issuer</th>
              <th className="px-4 py-2 border-b w-1/2">Name</th>
              <th className="px-4 py-2 border-b w-1/4">Date</th>
            </tr>
          </thead>
          <tbody className="min-h-[5rem]">
            {filteredFiles.map(({ code, issuer, name, date }) => (
              <tr key={code} className="hover:bg-gray-600">
                <td className="px-4 py-2 border-b">{issuer}</td>
                <td
                  className="px-4 py-2 border-b text-blue-400 cursor-pointer hover:underline"
                  onClick={() => handleFileClick(code)}
                >
                  {name}
                </td>
                <td className="px-4 py-2 border-b">
                  {date ? date : "Invalid Date"}
                </td>
              </tr>
            ))}
            {filteredFiles.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-2 text-center text-gray-400 border-b"
                >
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Error Message */}
      {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
    </div>
  );
};

export default ResearchFilesList;
