"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  InsightSource,
  fetchInsightSources,
  createInsightSource,
  updateInsightSource,
  deleteInsightSource,
} from "./SourceApi";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVerticalIcon } from "lucide-react";
import { FaPlus } from "react-icons/fa"; // Import the "+" icon for the button
import EditInsightSource from "./EditInsightSource"; // Import the new EditInsightSource component

/** Format date/time for the source's last visited property */
const formatLastVisited = (date: string | null) => {
  if (!date) return "Never Visited";
  const lastVisited = new Date(date);
  return `${lastVisited.toLocaleDateString()} ${lastVisited.toLocaleTimeString()}`;
};

const SourceList: React.FC = () => {
  const [sources, setSources] = useState<InsightSource[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Track dialog state for creating a new source
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false); // Track dialog state for updating a source
  const [selectedSource, setSelectedSource] = useState<InsightSource | null>(null); // Track the selected source for update
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Track delete confirmation dialog state
  const [sourceToDelete, setSourceToDelete] = useState<InsightSource | null>(null); // Store the source to delete
  const [selectedFrequency, setSelectedFrequency] = useState<string | null>(null); // State to store the selected frequency filter

  /** Load sources when the component mounts */
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
      // If source has an ID, update it
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
      // If source doesn't have an ID, create it
      try {
        source.last_visited = new Date().toISOString()
        const createdSource = await createInsightSource(source);
        setSources((prevSources) => [...prevSources, createdSource]);
      } catch (error) {
        console.error("Error creating source:", error);
      }
    }
  };

  const handleDelete = () => {
    if (sourceToDelete) {
      // Proceed with deleting the selected source
      deleteInsightSource(sourceToDelete._id)
        .then(() => {
          setSources((prevSources) => prevSources.filter((s) => s._id !== sourceToDelete._id));
          setIsDeleteDialogOpen(false); // Close the delete confirmation dialog
        })
        .catch((error) => {
          console.error("Error deleting source:", error);
        });
    }
  };

  const handleNameClick = async (url: string, source: InsightSource) => {
    // Open the URL in a new window
    window.open(url, "_blank", "noopener,noreferrer");

    // Update the last visited date
    const updatedSource = {
      ...source,
      last_visited: new Date().toISOString(),
    };

    // Optimistically update the state
    const updatedSources = sources.map((s) =>
      s._id === updatedSource._id ? updatedSource : s
    );

    // Re-sort the sources after updating the last_visited date
    const sortedSources = updatedSources.sort((a, b) => {
      const dateA = a.last_visited ? new Date(a.last_visited).getTime() : 0;
      const dateB = b.last_visited ? new Date(b.last_visited).getTime() : 0;
      return dateA - dateB;
    });

    setSources(sortedSources);

    // Update the backend with the new last visited date
    try {
      await updateInsightSource(updatedSource);
    } catch (error) {
      console.error("Error updating source last visited:", error);
    }
  };

  // Filter sources by selected frequency
  const filteredSources = selectedFrequency
    ? sources.filter((source) => source.frequency === selectedFrequency)
    : sources;

  return (
    <div className="bg-black text-white flex flex-col w-full mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Insight Sources</h2>
          <p className="text-sm text-gray-400">Manage your insight sources</p>
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedSource(null); // Set the selected source for update
            setIsUpdateDialogOpen(true); // Open the update dialog
          }}
          className="text-white bg-black"
        >
          <FaPlus className="inline" />
        </Button>
      </div>

      {/* Frequency Filter */}
      <div className="mb-4">
        <label className="text-white text-sm mr-2">Filter by Frequency:</label>
        <select
          className="p-2 bg-gray-700 text-white rounded"
          value={selectedFrequency || ""}
          onChange={(e) => setSelectedFrequency(e.target.value || null)}
        >
          <option value="">All Frequencies</option>
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
        </select>
      </div>

      {/* Scrollable Area for sources */}
      <ScrollArea className="h-[50rem]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSources.map((source) => (
            <div
              key={source._id}
              className="relative bg-gray-900 p-3 rounded-lg flex flex-col space-y-2 border border-white hover:bg-gray-800"
            >
              <div className="flex items-center space-x-3 truncate">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${source.url}`}
                  alt={source.name || "No name"}
                  className="w-5 h-5 rounded flex-shrink-0"
                />
                <h3
                  className="text-xs font-semibold truncate cursor-pointer text-blue-400 hover:underline flex-1"
                  onClick={() => handleNameClick(source.url, source)} // Handle the click on the source name
                >
                  {source.name || "Unnamed Source"}
                </h3>
                {/* Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-white">
                      <MoreVerticalIcon className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSource(source); // Set the selected source for update
                        setIsUpdateDialogOpen(true); // Open the update dialog
                      }}
                    >
                      Update
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setSourceToDelete(source); // Set the source to delete
                        setIsDeleteDialogOpen(true); // Open the delete confirmation dialog
                      }}
                      className="text-red-500"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex space-x-2">
                <Badge
                  variant="secondary"
                  className="bg-gray-800 text-xs text-gray-300"
                >
                  {formatLastVisited(source.last_visited)}
                </Badge>
                {source.frequency && (
                  <Badge
                    variant="secondary"
                    className="bg-gray-800 text-xs text-gray-300"
                  >
                    {source.frequency}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Dialog for creating or updating an insight source */}
      <EditInsightSource
        isOpen={isDialogOpen || isUpdateDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setIsUpdateDialogOpen(false);
        }}
        onSave={handleSave}
        source={selectedSource}
      />

      {/* Custom Confirmation Dialog for Deletion */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-gray-900 p-6 rounded-lg w-96">
            <h3 className="text-lg text-white mb-4">Confirm Deletion</h3>
            <p className="text-sm text-gray-400 mb-4">
              Are you sure you want to delete this source? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => setIsDeleteDialogOpen(false)}
                variant="outline"
                className="text-white"
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
