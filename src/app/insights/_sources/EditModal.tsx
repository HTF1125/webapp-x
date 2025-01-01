"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InsightSource } from "./api";

// Props type for the EditInsightSource component
interface EditInsightSourceProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (source: InsightSource) => void; // Callback to save the source (passed from the parent)
  source: InsightSource | null; // The source to update (optional, used for update mode)
}

const EditModal: React.FC<EditInsightSourceProps> = ({
  isOpen,
  onClose,
  onSave,
  source,
}) => {
  // Initialize state based on whether we're editing or creating
  const [formData, setFormData] = useState<InsightSource>({
    _id: source?._id || "", // Empty ID when creating a new source
    url: source?.url || "",
    name: source?.name || "",
    frequency: source?.frequency || "",
    last_visited: source?.last_visited || "", // Default empty string for new source
    remark: source?.remark || "",
  });

  useEffect(() => {
    // If the dialog is open and a source is provided (for updating), fill the form with source data
    if (isOpen && source) {
      setFormData({
        _id: source._id,
        url: source.url,
        name: source.name,
        frequency: source.frequency,
        last_visited: source.last_visited || "", // Ensure last_visited is a string
        remark: source.remark || "",
      });
    } else if (isOpen) {
      // Reset the form for creating a new source
      setFormData({
        _id: "",
        url: "",
        name: "",
        frequency: "",
        last_visited: "",
        remark: "",
      });
    }
  }, [isOpen, source]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pass the data to the parent component's onSave function
    onSave(formData); // The parent will handle saving the source and updating the state
    onClose(); // Close the dialog after save
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-gray-900 p-6 rounded-lg w-96">
        <h3 className="text-lg text-white mb-4">{source ? "Edit" : "Create"} Insight Source</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="name"
              className="w-full p-2 bg-gray-700 text-white rounded"
              placeholder="Source Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="url"
              className="w-full p-2 bg-gray-700 text-white rounded"
              placeholder="Source URL"
              value={formData.url}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="frequency"
              className="w-full p-2 bg-gray-700 text-white rounded"
              placeholder="Frequency"
              value={formData.frequency}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end space-x-4">
            <Button onClick={onClose} variant="outline" className="text-white">
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 text-white">
              {source ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default EditModal;
