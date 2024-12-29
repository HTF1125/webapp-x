"use client"

import { NEXT_PUBLIC_API_URL } from "@/config";
import { useEffect, useState } from "react";

interface DataSource {
  field: string;
  s_code: string;
  s_field: string;
  source: string;
}

interface MetaData {
  code: string;
  name: string | null;
  exchange: string | null;
  market: string | null;
  remark: string | null;
  disabled: boolean;
  data_sources: DataSource[];
}

const MetadataPage = () => {
  const [metadata, setMetadata] = useState<MetaData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [editingMetaData, setEditingMetaData] = useState<MetaData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Fetch the data from the API
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const endpoint = new URL("/api/metadatas", NEXT_PUBLIC_API_URL);

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
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

  // Delete a metadata item
  const deleteMetadata = async (metaData: MetaData) => {
    try {
      const endpoint = new URL(`/api/metadata`, NEXT_PUBLIC_API_URL);

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metaData), // Send the MetaData object as the request body
      });

      if (!response.ok) {
        throw new Error("Failed to delete metadata");
      }

      // Filter out the deleted item from the local state
      setMetadata(metadata.filter((meta) => meta.code !== metaData.code));

      alert(`Metadata with code ${metaData.code} deleted successfully`);
    } catch (err: any) {
      setError(err.message);
      alert(`Error deleting metadata: ${err.message}`);
    }
  };

  // Open the update modal and set the data for editing
  const openEditModal = (metaData: MetaData) => {
    setEditingMetaData(metaData);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditingMetaData(null);
  };

  // Update the metadata
  const updateMetadata = async () => {
    if (!editingMetaData) return;

    try {
      const endpoint = new URL(`/api/metadata`, NEXT_PUBLIC_API_URL);

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingMetaData), // Send the updated MetaData object
      });

      if (!response.ok) {
        throw new Error("Failed to update metadata");
      }

      // Update the metadata in the local state
      setMetadata(
        metadata.map((meta) =>
          meta.code === editingMetaData.code ? editingMetaData : meta
        )
      );

      alert(`Metadata with code ${editingMetaData.code} updated successfully`);
      closeEditModal();
    } catch (err: any) {
      setError(err.message);
      alert(`Error updating metadata: ${err.message}`);
    }
  };

  // Handle changes to DataSource fields in the modal
  const handleDataSourceChange = (index: number, field: string, value: string) => {
    if (!editingMetaData) return;

    const updatedDataSources = [...editingMetaData.data_sources];
    updatedDataSources[index] = {
      ...updatedDataSources[index],
      [field]: value,
    };

    setEditingMetaData({ ...editingMetaData, data_sources: updatedDataSources });
  };

  // Add a new DataSource to the metadata
  const addDataSource = () => {
    if (!editingMetaData) return;

    const newDataSource: DataSource = {
      field: "",
      s_code: "",
      s_field: "",
      source: "YAHOO", // default value, can be changed
    };

    setEditingMetaData({
      ...editingMetaData,
      data_sources: [...editingMetaData.data_sources, newDataSource],
    });
  };

  // Remove a DataSource from the metadata
  const removeDataSource = (index: number) => {
    if (!editingMetaData) return;

    const updatedDataSources = [...editingMetaData.data_sources];
    updatedDataSources.splice(index, 1);

    setEditingMetaData({ ...editingMetaData, data_sources: updatedDataSources });
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold p-5">Metadata List</h1>
      <table className="table-auto w-full border-collapse text-left p-5">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="px-4 py-2">Code</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Exchange</th>
            <th className="px-4 py-2">Market</th>
            <th className="px-4 py-2">Remark</th>
            <th className="px-4 py-2">Disabled</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {metadata.map((meta) => (
            <tr key={meta.code} className="border-b border-gray-700">
              <td className="px-4 py-2">{meta.code}</td>
              <td className="px-4 py-2">{meta.name || "N/A"}</td>
              <td className="px-4 py-2">{meta.exchange || "N/A"}</td>
              <td className="px-4 py-2">{meta.market || "N/A"}</td>
              <td className="px-4 py-2">{meta.remark || "N/A"}</td>
              <td className="px-4 py-2">{meta.disabled ? "Yes" : "No"}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => openEditModal(meta)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  Update
                </button>
                <button
                  onClick={() => deleteMetadata(meta)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && editingMetaData && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <div className="bg-gray-800 p-6 rounded-lg w-1/2">
            <h2 className="text-2xl font-bold mb-4">Edit Metadata</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm">Code:</label>
                <input
                  type="text"
                  value={editingMetaData.code || ""}
                  readOnly
                  className="w-full p-2 mt-1 bg-gray-700 text-white rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm">Name:</label>
                <input
                  type="text"
                  value={editingMetaData.name || ""}
                  onChange={(e) =>
                    setEditingMetaData({ ...editingMetaData, name: e.target.value })
                  }
                  className="w-full p-2 mt-1 bg-gray-700 text-white rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm">Exchange:</label>
                <input
                  type="text"
                  value={editingMetaData.exchange || ""}
                  onChange={(e) =>
                    setEditingMetaData({ ...editingMetaData, exchange: e.target.value })
                  }
                  className="w-full p-2 mt-1 bg-gray-700 text-white rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm">Market:</label>
                <input
                  type="text"
                  value={editingMetaData.market || ""}
                  onChange={(e) =>
                    setEditingMetaData({ ...editingMetaData, market: e.target.value })
                  }
                  className="w-full p-2 mt-1 bg-gray-700 text-white rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm">Remark:</label>
                <input
                  type="text"
                  value={editingMetaData.remark || ""}
                  onChange={(e) =>
                    setEditingMetaData({ ...editingMetaData, remark: e.target.value })
                  }
                  className="w-full p-2 mt-1 bg-gray-700 text-white rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm">Disabled:</label>
                <input
                  type="checkbox"
                  checked={editingMetaData.disabled}
                  onChange={(e) =>
                    setEditingMetaData({
                      ...editingMetaData,
                      disabled: e.target.checked,
                    })
                  }
                  className="mt-1"
                />
              </div>
            </div>

            <h3 className="text-xl font-semibold mt-4">Data Sources</h3>
            {editingMetaData.data_sources?.map((dataSource, index) => (
              <div key={index} className="mt-2">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm">Field:</label>
                    <input
                      type="text"
                      value={dataSource.field}
                      onChange={(e) =>
                        handleDataSourceChange(index, "field", e.target.value)
                      }
                      className="w-full p-2 mt-1 bg-gray-700 text-white rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Code:</label>
                    <input
                      type="text"
                      value={dataSource.s_code}
                      onChange={(e) =>
                        handleDataSourceChange(index, "s_code", e.target.value)
                      }
                      className="w-full p-2 mt-1 bg-gray-700 text-white rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Field Code:</label>
                    <input
                      type="text"
                      value={dataSource.s_field}
                      onChange={(e) =>
                        handleDataSourceChange(index, "s_field", e.target.value)
                      }
                      className="w-full p-2 mt-1 bg-gray-700 text-white rounded-md"
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeDataSource(index)}
                  className="text-red-500 hover:text-red-700 mt-2"
                >
                  Remove DataSource
                </button>
                <hr className="my-3" />
              </div>
            ))}
            <button
              onClick={addDataSource}
              className="w-full p-2 bg-green-500 hover:bg-green-700 text-white rounded-md mt-4"
            >
              Add DataSource
            </button>

            <button
              onClick={updateMetadata}
              className="mt-4 w-full p-2 bg-blue-500 hover:bg-blue-700 text-white rounded-md"
            >
              Update
            </button>
            <button
              onClick={closeEditModal}
              className="mt-2 w-full p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetadataPage;
