"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import {
  fetchMetadata,
  createMetadata,
  updateMetadata,
  deleteMetadata,
  MetaData,
} from "@/services/metadataApi"; // Adjust the import path as necessary

interface MetadataContextType {
  metadata: MetaData[];
  loading: boolean;
  error: string;
  currentPage: number;
  hasMoreData: boolean;
  searchQuery: string;
  fetchData: () => Promise<void>;
  handleDeleteMetadata: (metaData: MetaData) => Promise<void>;
  handleCreateMetadata: (metaData: MetaData) => Promise<void>;
  handleUpdateMetadata: (metaData: MetaData) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
}

const MetadataContext = createContext<MetadataContextType | undefined>(undefined);

export const MetadataProvider = ({ children }: { children: ReactNode }) => {
  const [metadata, setMetadata] = useState<MetaData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);

  const itemsPerPage = 10; // Number of items per page

  // Fetch metadata with pagination and search
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await fetchMetadata(
        (currentPage - 1) * itemsPerPage,
        itemsPerPage,
        searchQuery
      );
      if (currentPage === 1) {
        setMetadata(data); // Reset metadata if it's the first page
      } else {
        setMetadata((prev) => [...prev, ...data]); // Append new data for subsequent pages
      }
      setHasMoreData(data.length === itemsPerPage); // Check if there's more data
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch data whenever currentPage changes.
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Delete metadata
  const handleDeleteMetadata = async (metaData: MetaData) => {
    try {
      await deleteMetadata(metaData.code);
      setMetadata((prev) => prev.filter((meta) => meta.code !== metaData.code));
      alert(`Metadata with code ${metaData.code} deleted successfully`);
    } catch (err: any) {
      setError(err.message);
      alert(`Error deleting metadata: ${err.message}`);
    }
  };

  // Create metadata
  const handleCreateMetadata = async (metaData: MetaData) => {
    if (!metaData.code.trim()) {
      alert("Code is required.");
      return;
    }

    try {
      const savedMetaData = await createMetadata(metaData);
      setMetadata((prev) => [savedMetaData, ...prev]); // Add new metadata at the top
      alert(`Metadata with code ${savedMetaData.code} created successfully`);
    } catch (err: any) {
      setError(err.message);
      alert(`Error creating metadata: ${err.message}`);
    }
  };

  // Update metadata
  const handleUpdateMetadata = async (metaData: MetaData) => {
    try {
      const updatedMetaData = await updateMetadata(metaData);
      setMetadata((prev) =>
        prev.map((meta) =>
          meta.code === updatedMetaData.code ? updatedMetaData : meta
        )
      );
      alert(`Metadata with code ${updatedMetaData.code} updated successfully`);
    } catch (err: any) {
      setError(err.message);
      alert(`Error updating metadata: ${err.message}`);
    }
  };

  return (
    <MetadataContext.Provider
      value={{
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
      }}
    >
      {children}
    </MetadataContext.Provider>
  );
};

// Custom hook to use the MetadataContext
export const useMetadata = () => {
  const context = useContext(MetadataContext);
  if (!context) {
    throw new Error("useMetadata must be used within a MetadataProvider");
  }
  return context;
};
