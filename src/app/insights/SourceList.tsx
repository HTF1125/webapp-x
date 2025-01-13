"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  InsightSource,
  fetchInsightSources,
  createInsightSource,
  updateInsightSource,
  deleteInsightSource,
} from "@/services/insightApi";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVerticalIcon } from "lucide-react";
import { FaPlus } from "react-icons/fa";
import EditInsightSource from "./EditInsightSource";

/** Format date/time for the source's last visited property */
const formatLastVisited = (date: string | null) => {
  if (!date) return "Never Visited";
  const lastVisited = new Date(date);
  return `${lastVisited.toLocaleDateString()} ${lastVisited.toLocaleTimeString()}`;
};

const SourceList: React.FC = () => {
  const [sources, setSources] = useState<InsightSource[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<InsightSource | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sourceToDelete, setSourceToDelete] = useState<InsightSource | null>(
    null
  );
  const [selectedFrequency, setSelectedFrequency] = useState<string | null>(
    null
  );

  useEffect(() => {
    fetchInsightSources()
      .then((fetchedSources) => {
        const sortedSources = fetchedSources.sort((a, b) => {
          const dateA = a.last_visited ? new Date(a.last_visited).getTime() : 0;
          const dateB = b.last_visited ? new Date(b.last_visited).getTime() : 0;
          return dateA - dateB;
        });
        setSources(sortedSources);
      })
      .catch(console.error);
  }, []);

  const handleSave = async (source: InsightSource) => {
    if (source._id) {
      try {
        const updatedSource = await updateInsightSource(source);
        setSources((prevSources) =>
          prevSources.map((item) =>
            item._id === updatedSource._id ? updatedSource : item
          )
        );
      } catch (error) {
        console.error("Error updating source:", error);
      }
    } else {
      try {
        source.last_visited = new Date().toISOString();
        const createdSource = await createInsightSource(source);
        setSources((prevSources) => [...prevSources, createdSource]);
      } catch (error) {
        console.error("Error creating source:", error);
      }
    }
  };

  const handleDelete = () => {
    if (sourceToDelete) {
      deleteInsightSource(sourceToDelete._id)
        .then(() => {
          setSources((prevSources) =>
            prevSources.filter((s) => s._id !== sourceToDelete._id)
          );
          setIsDeleteDialogOpen(false);
        })
        .catch((error) => {
          console.error("Error deleting source:", error);
        });
    }
  };

  const handleNameClick = async (url: string, source: InsightSource) => {
    window.open(url, "_blank", "noopener,noreferrer");

    const updatedSource = {
      ...source,
      last_visited: new Date().toISOString(),
    };

    const updatedSources = sources.map((s) =>
      s._id === updatedSource._id ? updatedSource : s
    );

    const sortedSources = updatedSources.sort((a, b) => {
      const dateA = a.last_visited ? new Date(a.last_visited).getTime() : 0;
      const dateB = b.last_visited ? new Date(b.last_visited).getTime() : 0;
      return dateA - dateB;
    });

    setSources(sortedSources);

    try {
      await updateInsightSource(updatedSource);
    } catch (error) {
      console.error("Error updating source last visited:", error);
    }
  };

  const filteredSources = selectedFrequency
    ? sources.filter((source) => source.frequency === selectedFrequency)
    : sources;

  return (
    <div className="bg-white text-black dark:bg-gray-900 dark:text-white flex flex-col w-full mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">Insight Sources</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your insight sources
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedSource(null);
            setIsUpdateDialogOpen(true);
          }}
          className="bg-black text-white dark:bg-white dark:text-black"
        >
          <FaPlus className="inline" />
        </Button>
      </div>

      <div className="mb-4">
        <label className="text-sm mr-2">Filter by Frequency:</label>
        <select
          className="p-2 bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded"
          value={selectedFrequency || ""}
          onChange={(e) => setSelectedFrequency(e.target.value || null)}
        >
          <option value="">All Frequencies</option>
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
        </select>
      </div>

      <ScrollArea className="h-[50rem]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSources.map((source) => (
            <div
              key={source._id}
              className="relative bg-gray-50 dark:bg-gray-800 p-3 rounded-lg flex flex-col space-y-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex items-center space-x-3 truncate">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${source.url}`}
                  alt={source.name || "No name"}
                  className="w-5 h-5 rounded flex-shrink-0"
                />
                <h3
                  className="text-xs font-semibold truncate cursor-pointer text-blue-500 dark:text-blue-400 hover:underline"
                  onClick={() => handleNameClick(source.url, source)}
                >
                  {source.name || "Unnamed Source"}
                </h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVerticalIcon className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedSource(source);
                        setIsUpdateDialogOpen(true);
                      }}
                    >
                      Update
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSourceToDelete(source);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="text-red-500"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {formatLastVisited(source.last_visited)}
                </Badge>
                {source.frequency && (
                  <Badge variant="secondary" className="text-xs">
                    {source.frequency}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <EditInsightSource
        isOpen={isDialogOpen || isUpdateDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setIsUpdateDialogOpen(false);
        }}
        onSave={handleSave}
        source={selectedSource}
      />

      {isDeleteDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-lg mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Are you sure you want to delete this source? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => setIsDeleteDialogOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SourceList;
