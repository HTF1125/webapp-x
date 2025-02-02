"use client";

import React from "react";
import { MetaData } from "@/services/metadataApi"; // Adjust the import path as necessary

interface MetadataModalProps {
  isCreate: boolean;
  metadata: MetaData;
  onChange: (meta: MetaData) => void;
  onSave: (meta: MetaData) => void;
  onClose: () => void;
}

const MetadataModal = ({
  isCreate,
  metadata,
  onChange,
  onSave,
  onClose,
}: MetadataModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-11/12 md:w-1/2 lg:w-1/3">
        <h2 className="text-2xl font-bold dark:text-white mb-4">
          {isCreate ? "Create Metadata" : "Edit Metadata"}
        </h2>
        <div className="space-y-4">
          {["code", "name", "exchange", "market", "remark", "id_isin"].map(
            (field) => (
              <div key={field}>
                <label className="block text-sm dark:text-gray-200 capitalize">
                  {field}
                </label>
                <input
                  type="text"
                  value={(metadata[field as keyof MetaData] as string) || ""}
                  onChange={(e) =>
                    onChange({ ...metadata, [field]: e.target.value })
                  }
                  className="w-full p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                />
              </div>
            )
          )}
          <div className="flex items-center">
            <label className="block text-sm dark:text-gray-200 mr-2">
              Disabled
            </label>
            <input
              type="checkbox"
              checked={metadata.disabled}
              onChange={(e) =>
                onChange({ ...metadata, disabled: e.target.checked })
              }
              className="p-2"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(metadata)}
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            {isCreate ? "Create" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetadataModal;
