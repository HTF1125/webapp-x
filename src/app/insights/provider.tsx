"use client";

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { useProgress } from "@/context/Progress/ProgressContext";
import {
  Insight,
  fetchInsights,
  deleteInsight,
  updateInsight,
  updateSummary,
  createInsightWithPDF,
} from "./InsightApi";

// Create context to share state across components
interface InsightsContextType {
  allInsights: Insight[];
  insights: Insight[];
  searchTerm: string;
  isLoadingMore: boolean;
  selectedSummary: string | null;
  selectedInsight: Insight | null;
  isHandlingFiles: boolean;
  isSourceListVisible: boolean;
  handleSearch: (term: string) => void;
  handleLoadMore: () => Promise<void>;
  handleDelete: (insight: Insight) => Promise<void>;
  handleUpdateSummary: (insight: Insight) => Promise<void>;
  handleUpdateInsight: (insight: Insight) => Promise<void>;
  handleFilesAdded: (files: File[]) => Promise<void>;
  setIsSourceListVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedSummary: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedInsight: React.Dispatch<React.SetStateAction<Insight | null>>;
}

const InsightsContext = createContext<InsightsContextType | null>(null);

export const useInsights = () => {
  const context = useContext(InsightsContext);
  if (!context) {
    throw new Error("useInsights must be used within an InsightsProvider");
  }
  return context;
};

// Helper function to convert a file (PDF) to base64
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        const result = reader.result as string;
        resolve(result.split(",")[1]);
      } else {
        reject("File reading result is null.");
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

interface InsightsProviderProps {
  children: ReactNode;
}

const InsightsProvider: React.FC<InsightsProviderProps> = ({ children }) => {
  const { addTask, updateTask, removeTask, setTaskError } = useProgress();
  const [allInsights, setAllInsights] = useState<Insight[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [selectedSummary, setSelectedSummary] = useState<string | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [isHandlingFiles, setIsHandlingFiles] = useState<boolean>(false);
  const [isSourceListVisible, setIsSourceListVisible] =
    useState<boolean>(false);

  const isFetchingRef = useRef<boolean>(false);
  const [skip, setSkip] = useState<number>(0);
  const [limit] = useState<number>(100);

  const initialized = useRef(false);

  const initializeInsights = useCallback(async () => {
    if (isFetchingRef.current || initialized.current) return;
    isFetchingRef.current = true;

    const taskId = addTask("Fetching insights");

    try {
      const data = await fetchInsights({ skip: 0, limit });
      setAllInsights(data);
      setInsights(data);
      setSkip(data.length);
      initialized.current = true;
      updateTask(taskId, true);
    } catch (error) {
      console.error("Error fetching insights:", error);
      setTaskError(taskId, "Failed to fetch insights");
    } finally {
      isFetchingRef.current = false;
      removeTask(taskId);
    }
  }, [addTask, updateTask, removeTask, setTaskError, limit]);

  useEffect(() => {
    if (!initialized.current) {
      initializeInsights();
    }
  }, [initializeInsights]);

  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);
      const filteredData = term
        ? allInsights.filter((insight) =>
            ["name", "issuer"].some((key) =>
              insight[key as keyof Insight]
                ?.toString()
                .toLowerCase()
                .includes(term.toLowerCase())
            )
          )
        : allInsights;
      setInsights(filteredData);
    },
    [allInsights]
  );

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || isFetchingRef.current) return;

    const taskId = addTask("Loading more insights");
    setIsLoadingMore(true);
    isFetchingRef.current = true;

    try {
      const moreInsights = await fetchInsights({ skip, limit });
      const newAllInsights = [...allInsights, ...moreInsights];
      setAllInsights(newAllInsights);
      setSkip(newAllInsights.length);

      const filteredData = searchTerm
        ? newAllInsights.filter((insight) =>
            ["name", "issuer"].some((key) =>
              insight[key as keyof Insight]
                ?.toString()
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            )
          )
        : newAllInsights;

      setInsights(filteredData);
      updateTask(taskId, true);
    } catch (error) {
      console.error("Error loading more insights:", error);
      setTaskError(taskId, "Failed to load more insights");
    } finally {
      setIsLoadingMore(false);
      isFetchingRef.current = false;
      removeTask(taskId);
    }
  }, [
    addTask,
    updateTask,
    removeTask,
    setTaskError,
    allInsights,
    isLoadingMore,
    searchTerm,
    skip,
    limit,
  ]);

  const handleDelete = useCallback(
    async (insight: Insight) => {
      if (!insight._id) {
        console.error("Insight _id is undefined.");
        return;
      }

      const isConfirmed = window.confirm(
        `Are you sure you want to delete "${insight.name}"?`
      );
      if (!isConfirmed) return;

      const taskId = addTask(`Deleting ${insight.name}`);
      try {
        await deleteInsight(insight._id);
        setAllInsights((prev) =>
          prev.filter((item) => item._id !== insight._id)
        );
        setInsights((prev) => prev.filter((item) => item._id !== insight._id));
        updateTask(taskId, true);
      } catch (error) {
        console.error("Error deleting insight:", error);
        setTaskError(taskId, "Failed to delete insight");
      }
    },
    [addTask, updateTask, setTaskError]
  );

  const handleUpdateSummary = useCallback(
    async (insight: Insight) => {
      if (!insight._id) {
        console.error("Insight _id is undefined.");
        return;
      }

      const taskId = addTask(`Updating summary for ${insight.name}`);
      try {
        const updatedSummary = await updateSummary(insight._id);
        const updateInsightState = (prev: Insight[]) =>
          prev.map((item) =>
            item._id === insight._id
              ? { ...item, summary: updatedSummary }
              : item
          );
        setAllInsights(updateInsightState);
        setInsights(updateInsightState);
        updateTask(taskId, true);
      } catch (error) {
        console.error("Error updating insight summary:", error);
        setTaskError(taskId, "Failed to update summary");
      }
    },
    [addTask, updateTask, setTaskError]
  );

  const handleFilesAdded = useCallback(
    async (files: File[]) => {
      if (!files.length) return;

      setIsHandlingFiles(true);

      try {
        for (const file of files) {
          // Create a unique task for each file
          const taskId = addTask(`Uploading ${file.name}...`);

          try {
            // Convert file to Base64
            const base64Content = await convertFileToBase64(file);

            // Pass the filename to createInsightWithPDF
            const updatedInsight = await createInsightWithPDF(
              base64Content,
              file.name
            );

            // Update insights
            setAllInsights((prev) => [updatedInsight, ...prev]);
            setInsights((prev) => [updatedInsight, ...prev]);

            // Mark task as completed
            updateTask(taskId, true);

            handleUpdateSummary(updatedInsight);
          } catch (error) {
            console.error(`Error uploading file ${file.name}:`, error);

            // Mark task as failed
            setTaskError(taskId, `Failed to upload ${file.name}`);
          }
        }
      } finally {
        setIsHandlingFiles(false);
      }
    },
    [addTask, updateTask, setTaskError]
  );

  // Add the handleUpdateInsight function
  const handleUpdateInsight = useCallback(
    async (updatedInsight: Insight) => {
      if (!updatedInsight._id) {
        console.error("Insight _id is undefined.");
        return;
      }

      const taskId = addTask(`Updating ${updatedInsight.name}`);
      try {
        await updateInsight(updatedInsight);
        const updateInsightState = (prev: Insight[]) =>
          prev.map((item) =>
            item._id === updatedInsight._id
              ? { ...item, ...updatedInsight }
              : item
          );

        setAllInsights(updateInsightState);
        setInsights(updateInsightState);
        updateTask(taskId, true);
      } catch (error) {
        console.error("Error updating insight:", error);
        setTaskError(taskId, "Failed to update insight");
      } finally {
        removeTask(taskId);
      }
    },
    [addTask, updateTask, setTaskError]
  );

  // Update the context provider
  return (
    <InsightsContext.Provider
      value={{
        allInsights,
        insights,
        searchTerm,
        isLoadingMore,
        selectedSummary,
        selectedInsight,
        isHandlingFiles,
        isSourceListVisible,
        handleSearch,
        handleLoadMore,
        handleDelete,
        handleUpdateSummary,
        handleUpdateInsight,
        handleFilesAdded,
        setIsSourceListVisible,
        setSelectedSummary,
        setSelectedInsight,
      }}
    >
      {children}
    </InsightsContext.Provider>
  );
};
export default InsightsProvider;
