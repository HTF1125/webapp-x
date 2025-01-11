"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InsightSource } from "./SourceApi";

interface EditInsightSourceProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (source: InsightSource) => void;
  source: InsightSource | null;
}

const EditInsightSource: React.FC<EditInsightSourceProps> = ({
  isOpen,
  onClose,
  onSave,
  source,
}) => {
  const [formData, setFormData] = useState<InsightSource>({
    _id: source?._id || "",
    url: source?.url || "",
    name: source?.name || "",
    frequency: source?.frequency || "",
    last_visited: source?.last_visited || "",
    remark: source?.remark || "",
  });

  useEffect(() => {
    if (isOpen && source) {
      setFormData({
        _id: source._id,
        url: source.url,
        name: source.name,
        frequency: source.frequency,
        last_visited: source.last_visited || "",
        remark: source.remark || "",
      });
    } else if (isOpen) {
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
    onSave(formData);
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70 z-10">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {source ? "Edit" : "Create"} Insight Source
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="name"
              className="w-full p-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder="Source Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="url"
              className="w-full p-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder="Source URL"
              value={formData.url}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="frequency"
              className="w-full p-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder="Frequency"
              value={formData.frequency}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end space-x-4">
            <Button 
              onClick={onClose} 
              variant="outline" 
              className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {source ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default EditInsightSource;
