"use client";

import { useState, useCallback, useRef } from "react";
import {
  fetchInsights,
  deleteInsight,
  updateInsight,
  updateSummary,
  createInsightWithPDF,
} from "./InsightApi";
import { Insight } from "./InsightApi";
import { useProgress } from "@/context/Progress/ProgressContext";

export const useInsights = () => {
  const [allInsights, setAllInsights] = useState<Insight[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [selectedSummary, setSelectedSummary] = useState<string | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);

  const { addTask, updateTask, removeTask, setTaskError } = useProgress();
  const isFetchingRef = useRef<boolean>(false);

  const initializeInsights = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    const taskId = addTask("Fetching insights");
    try {
      const data = await fetchInsights({ skip: 0, limit: 100 });
      setAllInsights(data);
      setInsights(data);
      updateTask(taskId, true);
    } catch (error) {
      console.error("Error fetching insights:", error);
      setTaskError(taskId, "Failed to fetch insights");
    } finally {
      isFetchingRef.current = false;
      removeTask(taskId);
    }
  }, [addTask, updateTask, setTaskError]); // Removed removeTask from dependencies

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
    try {
      const moreInsights = await fetchInsights({
        skip: allInsights.length,
        limit: 100,
      });
      const newAllInsights = [...allInsights, ...moreInsights];
      setAllInsights(newAllInsights);

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
      removeTask(taskId);
    }
  }, [addTask, updateTask, setTaskError, allInsights, isLoadingMore, searchTerm]); // Removed removeTask from dependencies

  const handleDelete = useCallback(
    async (insight: Insight) => {
      if (!insight._id) {
        console.error("Insight _id is undefined.");
        return;
      }
      const taskId = addTask(`Deleting ${insight.name}`);
      try {
        await deleteInsight(insight._id);
        setAllInsights((prev) => prev.filter((item) => item._id !== insight._id));
        setInsights((prev) => prev.filter((item) => item._id !== insight._id));
        updateTask(taskId, true);
      } catch (error) {
        console.error("Error deleting insight:", error);
        setTaskError(taskId, "Failed to delete insight");
      }
    },
    [addTask, updateTask, setTaskError] // Removed removeTask from dependencies
  );

  const handleUpdateSummary = useCallback(
    async (insight: Insight) => {
      if (!insight._id) {
        console.error("Insight _id is undefined.");
        return;
      }

      const taskId = addTask(`Updating ${insight.name}`);
      try {
        const updatedSummary = await updateSummary(insight._id);
        const updateInsightState = (prev: Insight[]) =>
          prev.map((item) =>
            item._id === insight._id ? { ...item, summary: updatedSummary } : item
          );
        setAllInsights(updateInsightState);
        setInsights(updateInsightState);
        updateTask(taskId, true);
      } catch (error) {
        console.error("Error updating insight summary:", error);
        setTaskError(taskId, "Failed to update summary");
      }
    },
    [addTask, updateTask, setTaskError] // Removed removeTask from dependencies
  );

  const handleCreateInsightWithPDF = useCallback(
    async (name: string, base64Content: string) => {
      const taskId = addTask(`Creating new insight: ${name}`);
      try {
        const newInsight = await createInsightWithPDF(base64Content);
        setAllInsights((prev) => [newInsight, ...prev]);
        setInsights((prev) => [newInsight, ...prev]);
        updateTask(taskId, true);
      } catch (error) {
        setTaskError(taskId, "Failed to create new insight");
      }
    },
    [addTask, updateTask, setTaskError] // Removed removeTask from dependencies
  );

  const handleUpdateInsight = useCallback(
    async (insight: Insight) => {
      if (!insight._id) {
        console.error("Insight _id is undefined.");
        return;
      }
      const taskId = addTask(`Updating insight: ${insight.name}`);
      try {
        const updatedInsight = await updateInsight(insight);
        const updateInsightState = (prev: Insight[]) =>
          prev.map((item) =>
            item._id === updatedInsight._id ? updatedInsight : item
          );
        setAllInsights(updateInsightState);
        setInsights(updateInsightState);
        updateTask(taskId, true);
      } catch (error) {
        console.error("Error updating insight:", error);
        setTaskError(taskId, "Failed to update insight");
      }
    },
    [addTask, updateTask, setTaskError] // Removed removeTask from dependencies
  );

  return {
    insights,
    allInsights,
    searchTerm,
    isLoadingMore,
    selectedSummary,
    selectedInsight,
    initializeInsights,
    handleSearch,
    handleLoadMore,
    handleDelete,
    handleUpdateSummary,
    handleCreateInsightWithPDF,
    handleUpdateInsight,
    setSelectedSummary,
    setSelectedInsight,
  };
};
