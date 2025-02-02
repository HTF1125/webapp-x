"use client";

import React, { useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { MetaData } from "@/services/metadataApi";
import { useMetadata } from "./provider";
import MetadataModal from "./MetadataModal";

const MetadataPage = () => {
  const {
    metadata,
    loading,
    error,
    currentPage,
    hasMoreData,
    searchQuery,
    fetchData,
    handleDeleteMetadata,
    handleCreateMetadata,
    handleUpdateMetadata,
    setSearchQuery,
    setCurrentPage,
  } = useMetadata();

  const [isCreate, setIsCreate] = useState<boolean>(true);
  const [editingMetaData, setEditingMetaData] = useState<MetaData>({
    code: "",
    name: "",
    exchange: "",
    market: "",
    id_isin: "",
    remark: "",
    disabled: false,
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Handle search button click or Enter key press
  const handleSearch = () => {
    if (currentPage !== 1) {
      setCurrentPage(1);
      // The useEffect in the provider will trigger fetchData when currentPage changes.
    } else {
      fetchData();
    }
  };

  // Handle Enter key press in search input (using onKeyDown for better compatibility)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Open modal for creating or updating metadata
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
        id_isin: "",
        remark: "",
        disabled: false,
      });
      setIsCreate(true);
    }
    setIsModalOpen(true);
  };

  // Close modal and reset editing metadata
  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditingMetaData({
      code: "",
      name: "",
      exchange: "",
      market: "",
      id_isin: "",
      remark: "",
      disabled: false,
    });
  };

  // Pagination controls
  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (hasMoreData) setCurrentPage(currentPage + 1);
  };

  // Loading state
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-900">
        <div className="text-2xl dark:text-white">Loading...</div>
      </div>
    );

  // Error state
  if (error)
    return (
      <div className="flex justify-center items-center h-screen dark:bg-gray-900">
        <div className="text-2xl text-red-500 dark:text-red-400">{error}</div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 p-8 flex-col">
      {/* Search Bar */}
      <div className="w-full mb-8">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search by code, name, or remark..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
          />
          <button
            onClick={handleSearch}
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Metadata Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="p-4 text-left">Code</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Exchange</th>
              <th className="p-4 text-left">Market</th>
              <th className="p-4 text-left">ISIN</th>
              <th className="p-4 text-left">Remark</th>
              <th className="p-4 text-left">Disabled</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {metadata.map((meta) => (
              <tr
                key={meta.code}
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <td className="p-4">{meta.code}</td>
                <td className="p-4">{meta.name}</td>
                <td className="p-4">{meta.exchange}</td>
                <td className="p-4">{meta.market}</td>
                <td className="p-4">{meta.id_isin}</td>
                <td className="p-4">{meta.remark}</td>
                <td className="p-4">{meta.disabled ? "Yes" : "No"}</td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(meta)}
                      className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteMetadata(meta)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8 space-x-4">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50"
        >
          <FaArrowLeft />
        </button>
        <button
          onClick={goToNextPage}
          disabled={!hasMoreData}
          className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50"
        >
          <FaArrowRight />
        </button>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => openEditModal(null)}
        className="fixed bottom-8 right-8 p-4 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg"
      >
        <FaPlus size={24} />
      </button>

      {/* Modal */}
      {isModalOpen && (
        <MetadataModal
          isCreate={isCreate}
          metadata={editingMetaData}
          onChange={setEditingMetaData}
          onSave={isCreate ? handleCreateMetadata : handleUpdateMetadata}
          onClose={closeEditModal}
        />
      )}
    </div>
  );
};

export default MetadataPage;
