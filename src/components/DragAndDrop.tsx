import React, { useState, DragEvent, FC } from "react";

interface DragAndDropProps {
  onFilesAdded?: (files: File[]) => void;
  onError?: (message: string) => void;
  accept?: string;
  message?: string; // Message to display inside the drop area
  draggingClassName?: string; // Custom Tailwind classes when dragging
  defaultClassName?: string; // Custom Tailwind classes when not dragging
  containerClassName?: string; // Additional Tailwind classes for the container
  onUploadComplete?: () => void; // Callback when upload is complete
}

const DragAndDrop: FC<DragAndDropProps> = ({
  onFilesAdded,
  onError,
  accept,
  message = "Drag and drop files here",
  draggingClassName = "border-blue-500 bg-gray-800 text-blue-200",
  defaultClassName = "border-gray-600 bg-gray-900 text-gray-300",
  containerClassName = "",
  onUploadComplete,
}) => {
  const [dragging, setDragging] = useState(false);
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false); // Track uploading state

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

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
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
      setDroppedFiles(validFiles);
      onFilesAdded?.(validFiles);
    } else {
      setDroppedFiles(files);
      onFilesAdded?.(files);
    }
  };

  // Trigger file select dialog if no files are dropped
  const handleSelectFiles = () => {
    if (droppedFiles.length === 0) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = accept || "*/*"; // Set accepted file types
      input.multiple = true;
      input.click();

      input.onchange = (e) => {
        const selectedFiles = Array.from((e.target as HTMLInputElement).files || []);
        setDroppedFiles(selectedFiles);
        onFilesAdded?.(selectedFiles);
      };
    }
  };

  // Start file upload
  const handleUpload = async () => {
    if (!droppedFiles.length) {
      onError?.("No files selected for upload.");
      return;
    }

    setIsUploading(true);
    // Simulate upload process with a timeout
    setTimeout(() => {
      onUploadComplete?.(); // Call the callback after upload is complete
      setDroppedFiles([]); // Clear files after upload
      setIsUploading(false); // Reset uploading state
    }, 2000); // Simulated 2-second upload
  };

  // Reset dropped files after upload
  const handleResetFiles = () => {
    setDroppedFiles([]); // Clear the files list after upload
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 rounded-lg p-6 text-center transition-all duration-200 cursor-pointer max-w-4xl w-full mx-auto ${
        dragging ? draggingClassName : defaultClassName
      } ${containerClassName}`}
      onClick={handleSelectFiles} // Trigger file select when clicked and no files present
    >
      <p>{dragging ? "Drop the files here..." : message}</p>
      <p className="text-sm">
        {accept
          ? `Accepted file types: ${accept}`
          : "Any file type is accepted"}
      </p>
      <ul className="mt-4 text-sm">
        {droppedFiles.length > 0 ? (
          droppedFiles.map((file, index) => (
            <li key={index} className="truncate">
              {file.name}
            </li>
          ))
        ) : (
          <p className="text-gray-500">No files uploaded.</p>
        )}
      </ul>
      <div className="mt-4 space-x-4">
        {droppedFiles.length > 0 && (
          <>
            <button
              onClick={handleUpload}
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-all"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
            <button
              onClick={handleResetFiles}
              className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition-all"
            >
              Clear Files
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DragAndDrop;
