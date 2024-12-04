"use client";

import React, { useState } from "react";
import { fetchResearchFileByCode } from "@/api/all";

interface ResearchFilesListProps {
  researchFiles: string[]; // List of file codes from the API
}

const ResearchFilesList = ({ researchFiles }: ResearchFilesListProps) => {
  const [error, setError] = useState<string | null>(null);

  const handleFileClick = async (code: string) => {
    try {
      setError(null);
      const file = await fetchResearchFileByCode(code); // Fetch raw binary data

      // Create a Blob URL for the PDF file
      const blob = new Blob([file], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);

      // Open the Blob URL in a new tab
      window.open(blobUrl, "_blank");
    } catch (err) {
      console.error("Error fetching or opening file:", err);
      setError("Failed to open PDF. Please try again.");
    }
  };

  // Process researchFiles to split and extract issuer, name, and date
  const processedFiles = researchFiles.map((file) => {
    const [issuer, name, dateWithExt] = file.split("_");
    const date = dateWithExt.replace(".pdf", ""); // Remove .pdf extension
    return { code: file, issuer, name, date };
  });

  return (
    <div className="flex flex-col items-center gap-4 p-4 text-white">
      <h1 className="text-xl font-semibold">Research Files</h1>
      <table className="table-auto w-full max-w-3xl text-left border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Issuer</th>
            <th className="px-4 py-2 border-b">Name</th>
            <th className="px-4 py-2 border-b">Date</th>
            <th className="px-4 py-2 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {processedFiles.map(({ code, issuer, name, date }) => (
            <tr key={code} className="hover:bg-gray-800">
              <td className="px-4 py-2 border-b">{issuer}</td>
              <td className="px-4 py-2 border-b">{name}</td>
              <td className="px-4 py-2 border-b">{date}</td>
              <td className="px-4 py-2 border-b">
                <button
                  onClick={() => handleFileClick(code)}
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Read
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default ResearchFilesList;
