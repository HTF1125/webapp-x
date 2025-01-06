"use client";

import React, { useState, DragEvent } from "react";
import { useInsights } from "./provider"; // Import the context hook

interface DragAndDropProps {
  onError?: (message: string) => void;
  accept?: string;
  message?: string; // Message to display inside the drop area
  draggingClassName?: string; // Custom Tailwind classes when dragging
  defaultClassName?: string; // Custom Tailwind classes when not dragging
  containerClassName?: string; // Additional Tailwind classes for the container
}

const DragAndDrop: React.FC<DragAndDropProps> = ({
  onError,
  accept,
  message = "Drag and drop files here",
  draggingClassName = "border-blue-500 bg-gray-800 text-blue-200",
  defaultClassName = "border-gray-600 bg-gray-900 text-gray-300",
  containerClassName = "",
}) => {
  const { handleFilesAdded } = useInsights(); // Use context to upload files
  const [dragging, setDragging] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const files = Array.from(e.dataTransfer.files);

    // Validate file types if accept prop is passed
    if (accept) {
      const validFiles = files.filter((file) =>
        accept.split(",").includes(file.type)
      );
      if (validFiles.length === 0) {
        onError?.("No valid files dropped.");
        return;
      }
      await handleFilesAdded(validFiles); // Upload files instantly
    } else {
      await handleFilesAdded(files); // Upload files instantly
    }
  };

  // Trigger file select dialog if no files are dropped
  const handleSelectFiles = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept || "*/*"; // Set accepted file types
    input.multiple = true;
    input.click();

    input.onchange = async (e) => {
      const selectedFiles = Array.from((e.target as HTMLInputElement).files || []);
      await handleFilesAdded(selectedFiles); // Upload files instantly
    };
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 rounded-lg p-6 text-center transition-all duration-200 cursor-pointer max-w-4xl w-full mx-auto ${
        dragging ? draggingClassName : defaultClassName
      } ${containerClassName}`}
      onClick={handleSelectFiles} // Trigger file select when clicked
    >
      <p>{dragging ? "Drop the files here..." : message}</p>
      <p className="text-sm">
        {accept
          ? `Accepted file types: ${accept}`
          : "Any file type is accepted"}
      </p>
    </div>
  );
};

export default DragAndDrop;
