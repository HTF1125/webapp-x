import React, { useEffect } from "react";
import { MetaData, Source } from "@/services/metadataApi";

interface MetadataModalProps {
  isCreate: boolean;
  metadata: MetaData;
  onChange: (meta: MetaData) => void;
  onSave: (meta: MetaData) => Promise<void> | void;
  onClose: () => void;
}

const MetadataModal = ({
  isCreate,
  metadata,
  onChange,
  onSave,
  onClose,
}: MetadataModalProps) => {
  // Add a new datasource with default values.
  const addDataSource = () => {
    onChange({
      ...metadata,
      data_sources: [
        ...metadata.data_sources,
        { field: "", s_code: "", s_field: "", source: "YAHOO" },
      ],
    });
  };

  // Update a specific field of a datasource.
  const updateDataSource = (index: number, field: keyof Source, value: string) => {
    const newDataSources = [...metadata.data_sources];
    newDataSources[index] = { ...newDataSources[index], [field]: value } as Source;
    onChange({ ...metadata, data_sources: newDataSources });
  };

  // Remove a datasource at the given index.
  const deleteDataSource = (index: number) => {
    const newDataSources = metadata.data_sources.filter((_, i) => i !== index);
    onChange({ ...metadata, data_sources: newDataSources });
  };

  // When saving, call onSave and then close the modal.
  const handleSave = async () => {
    await onSave(metadata);
    onClose();
  };

  // Close the modal if Esc is pressed.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    // Clicking on the backdrop (outer div) will close the modal.
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      {/* Stop propagation so that clicking inside the modal doesn't trigger onClose */}
      <div
        className="bg-white dark:bg-gray-800 p-4 rounded-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold dark:text-white mb-3">
          {isCreate ? "Create Metadata" : "Edit Metadata"}
        </h2>
        <div className="space-y-2">
          {["code", "name", "exchange", "market", "id_isin", "remark"].map((field) => (
            <div key={field} className="flex items-center space-x-2">
              <label className="w-24 text-sm dark:text-gray-200 capitalize">{field}</label>
              <input
                type="text"
                value={(metadata[field as keyof MetaData] as string) || ""}
                onChange={(e) =>
                  onChange({ ...metadata, [field]: e.target.value })
                }
                className="flex-1 p-1 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded"
              />
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <label className="w-24 text-sm dark:text-gray-200">Disabled</label>
            <input
              type="checkbox"
              checked={metadata.disabled}
              onChange={(e) =>
                onChange({ ...metadata, disabled: e.target.checked })
              }
              className="p-1"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold dark:text-white mb-2">Data Sources</h3>
            {metadata.data_sources.map((source, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Field"
                  value={source.field || ""}
                  onChange={(e) => updateDataSource(index, "field", e.target.value)}
                  className="w-1/4 p-1 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded"
                />
                <input
                  type="text"
                  placeholder="S_Code"
                  value={source.s_code || ""}
                  onChange={(e) => updateDataSource(index, "s_code", e.target.value)}
                  className="w-1/4 p-1 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded"
                />
                <input
                  type="text"
                  placeholder="S_Field"
                  value={source.s_field || ""}
                  onChange={(e) => updateDataSource(index, "s_field", e.target.value)}
                  className="w-1/4 p-1 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded"
                />
                <input
                  type="text"
                  placeholder="Source"
                  value={source.source || ""}
                  onChange={(e) => updateDataSource(index, "source", e.target.value)}
                  className="w-1/4 p-1 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded"
                />
                <button
                  onClick={() => deleteDataSource(index)}
                  className="p-1 bg-red-500 hover:bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              onClick={addDataSource}
              className="mt-2 p-2 bg-green-500 hover:bg-green-600 text-white rounded"
            >
              Add Data Source
            </button>
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            {isCreate ? "Create" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetadataModal;
