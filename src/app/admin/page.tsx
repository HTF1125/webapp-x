"use client";

import { NEXT_PUBLIC_API_URL } from "@/config";
import { useEffect, useState } from "react";

interface MetaData {
  code: string;
  name: string | null;
  exchange: string | null;
  market: string | null;
  remark: string | null;
  disabled: boolean;
}

const MetadataPage = () => {
  const [isCreate, setIsCreate] = useState<boolean>(true);
  const [metadata, setMetadata] = useState<MetaData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [editingMetaData, setEditingMetaData] = useState<MetaData>({
    code: "",
    name: "",
    exchange: "",
    market: "",
    remark: "",
    disabled: false,
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const endpoint = new URL("/api/metadatas", NEXT_PUBLIC_API_URL);
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setMetadata(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  const deleteMetadata = async (metaData: MetaData) => {
    try {
      const endpoint = new URL(`/api/metadata`, NEXT_PUBLIC_API_URL);
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metaData),
      });

      if (!response.ok) throw new Error("Failed to delete metadata");

      setMetadata(metadata.filter((meta) => meta.code !== metaData.code));
      alert(`Metadata with code ${metaData.code} deleted successfully`);
    } catch (err: any) {
      setError(err.message);
      alert(`Error deleting metadata: ${err.message}`);
    }
  };

  const openEditModal = (metaData: MetaData | null) => {
    if (metaData) {
      setEditingMetaData(metaData);
      setIsCreate(false);
    } else {
      setEditingMetaData({
        code: "",
        name: "",
        exchange: "",
        market: "",
        remark: "",
        disabled: false,
      });
      setIsCreate(true);
    }
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditingMetaData({
      code: "",
      name: "",
      exchange: "",
      market: "",
      remark: "",
      disabled: false,
    });
  };

  const saveMetadata = async () => {
    if (isCreate && !editingMetaData.code.trim()) {
      alert("Code is required.");
      return;
    }

    const method = isCreate ? "POST" : "PUT";
    const endpoint = new URL(`/api/metadata`, NEXT_PUBLIC_API_URL);

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingMetaData),
      });

      if (!response.ok)
        throw new Error(`Failed to ${isCreate ? "create" : "update"} metadata`);

      if (isCreate) {
        setMetadata([...metadata, editingMetaData]);
      } else {
        setMetadata(
          metadata.map((meta) =>
            meta.code === editingMetaData.code ? editingMetaData : meta
          )
        );
      }

      alert(
        `Metadata with code ${editingMetaData.code} ${
          isCreate ? "created" : "updated"
        } successfully`
      );
      closeEditModal();
    } catch (err: any) {
      setError(err.message);
      alert(
        `Error ${isCreate ? "creating" : "updating"} metadata: ${err.message}`
      );
    }
  };

  if (loading)
    return <div className="text-white text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-10">Error: {error}</div>;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-5">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Metadata List</h1>
        <button
          onClick={() => openEditModal(null)}
          className="w-full sm:w-auto p-2 bg-green-500 hover:bg-green-600 text-white rounded-md mb-6"
        >
          Create New Metadata
        </button>
        <MetadataTable
          metadata={metadata}
          onEdit={openEditModal}
          onDelete={deleteMetadata}
        />
      </div>

      {isModalOpen && (
        <MetadataModal
          isCreate={isCreate}
          metadata={editingMetaData}
          onChange={setEditingMetaData}
          onSave={saveMetadata}
          onClose={closeEditModal}
        />
      )}
    </div>
  );
};

const MetadataTable = ({
  metadata,
  onEdit,
  onDelete,
}: {
  metadata: MetaData[];
  onEdit: (meta: MetaData) => void;
  onDelete: (meta: MetaData) => void;
}) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
      <thead className="bg-gray-700">
        <tr>
          <th className="px-4 py-3 text-left">Code</th>
          <th className="px-4 py-3 text-left">Name</th>
          <th className="px-4 py-3 text-left">Exchange</th>
          <th className="px-4 py-3 text-left">Market</th>
          <th className="px-4 py-3 text-left">Disabled</th>
          <th className="px-4 py-3 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {metadata.map((meta) => (
          <tr
            key={meta.code}
            className="border-b border-gray-700 hover:bg-gray-750"
          >
            <td className="px-4 py-3">{meta.code}</td>
            <td className="px-4 py-3">{meta.name || "N/A"}</td>
            <td className="px-4 py-3">{meta.exchange || "N/A"}</td>
            <td className="px-4 py-3">{meta.market || "N/A"}</td>
            <td className="px-4 py-3">{meta.disabled ? "Yes" : "No"}</td>
            <td className="px-4 py-3">
              <button
                onClick={() => onEdit(meta)}
                className="text-blue-400 hover:text-blue-300 mr-3"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(meta)}
                className="text-red-400 hover:text-red-300"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const MetadataModal = ({
  isCreate,
  metadata,
  onChange,
  onSave,
  onClose,
}: {
  isCreate: boolean;
  metadata: MetaData;
  onChange: (meta: MetaData) => void;
  onSave: () => void;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-gray-800 p-6 rounded-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">
        {isCreate ? "Create New Metadata" : "Edit Metadata"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["code", "name", "exchange", "market", "remark"].map((field) => (
          <div key={field}>
            <label htmlFor={field} className="block text-sm capitalize mb-1">
              {field}:
            </label>
            <input
              id={field}
              type="text"
              value={metadata[field as keyof MetaData] as string || ""}
              onChange={(e) =>
                onChange({ ...metadata, [field]: e.target.value })
              }
              className="w-full p-2 bg-gray-700 text-white rounded-md"
              placeholder={`Enter ${field}`}
              title={`Enter the ${field} for this metadata`}
            />
          </div>
        ))}
        <div className="flex items-center">
          <label htmlFor="disabled" className="block text-sm mr-2">
            Disabled:
          </label>
          <input
            id="disabled"
            type="checkbox"
            checked={metadata.disabled}
            onChange={(e) =>
              onChange({ ...metadata, disabled: e.target.checked })
            }
            className="mt-1"
            title="Toggle to enable or disable this metadata"
          />
        </div>
      </div>
      <button
        onClick={onSave}
        className="mt-4 w-full p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
      >
        {isCreate ? "Create" : "Update"}
      </button>
      <button
        onClick={onClose}
        className="mt-2 w-full p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
      >
        Cancel
      </button>
    </div>
  </div>
);

export default MetadataPage;
