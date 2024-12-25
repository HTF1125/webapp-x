import React, { useEffect, useState } from "react";
import {
  fetchInsightSources,
  InsightSource,
  createInsightSource,
  updateInsightSource,
  deleteInsightSource,
  UrlData,
} from "./api"; // Adjust path as needed
import { FaTimes } from "react-icons/fa"; // Import the "X" icon for the delete button
import Image from "next/image";  // Import Image from next/image for optimization

const InsightSourceList: React.FC = () => {
  const [sources, setSources] = useState<InsightSource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<InsightSource | null>(null); // Track the selected source
  const [newSourceUrl, setNewSourceUrl] = useState<string>(""); // New URL input state
  const [newSourceName, setNewSourceName] = useState<string>(""); // New name input state
  const [formError, setFormError] = useState<string | null>(null); // Form validation error

  useEffect(() => {
    const loadSources = async () => {
      try {
        const data = await fetchInsightSources();
        // Sort by `last_visited` ascending
        const sortedData = data.sort(
          (a, b) =>
            new Date(a.last_visited).getTime() - new Date(b.last_visited).getTime()
        );
        setSources(sortedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSources();
  }, []);

  if (loading) {
    return <p style={{ color: "#bbb" }}>Loading insight sources...</p>;
  }

  if (error) {
    return <p style={{ color: "#f44336" }}>Error: {error}</p>;
  }

  // Format the last visited date to show date (YYYY-MM-DD) and time (HH:mm)
  const formatLastVisited = (date: string) => {
    const lastVisitedDate = new Date(date);

    // Format the date part (YYYY-MM-DD)
    const formattedDate = lastVisitedDate.toLocaleDateString([], {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    // Format the time part (HH:mm)
    const formattedTime = lastVisitedDate.toLocaleString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Optional: to use 24-hour format
    });

    return `${formattedDate} ${formattedTime}`;
  };

  const handleOpenLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Handle the form submission to create a new InsightSource
  const handleCreateSource = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null); // Clear previous errors

    // Basic validation for URL
    if (!newSourceUrl) {
      setFormError("URL is required.");
      return;
    }

    const urlData: UrlData = { url: newSourceUrl, name: newSourceName || undefined };

    try {
      const createdSource = await createInsightSource(urlData);
      setSources((prevSources) => [...prevSources, createdSource]); // Add the new source to the list
      setNewSourceUrl(""); // Clear input fields
      setNewSourceName("");
    } catch (err) {
      setFormError("Failed to create the insight source.");
    }
  };

  // Handle the update of the last_visited field when an InsightSource is clicked
  const handleSourceClick = async (source: InsightSource) => {
    const updatedData = {
      ...source,
      last_visited: new Date().toISOString(), // Update last_visited to current time
      name: source.name || undefined, // Ensure name is either string or undefined
      remark: source.remark || undefined, // Ensure remark is either string or undefined
    };

    try {
      const updatedSource = await updateInsightSource(source._id, updatedData);

      // After the update, open the URL in a new window
      handleOpenLink(source.url);

      // Move the clicked source to the backend of the list
      setSources((prevSources) => {
        // Remove the clicked source from the list and add it to the end
        const updatedList = prevSources.filter((s) => s._id !== source._id);
        updatedList.push(updatedSource);
        return updatedList;
      });
    } catch (err) {
      setFormError("Failed to update last visited timestamp.");
    }
  };

  // Handle the update of a selected InsightSource
  const handleUpdateSource = async (id: string) => {
    const updatedData = {
      name: newSourceName || undefined,
    };

    try {
      const updatedSource = await updateInsightSource(id, updatedData);
      setSources((prevSources) =>
        prevSources.map((source) =>
          source._id === updatedSource._id ? updatedSource : source
        )
      );
      setSelectedSource(null); // Close the update form
      setNewSourceName(""); // Clear input fields
    } catch (err) {
      setFormError("Failed to update the insight source.");
    }
  };

  // Handle the deletion of a selected InsightSource
  const handleDeleteSource = async (id: string) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this source? This action cannot be undone."
    );
    if (!userConfirmed) return;

    try {
      await deleteInsightSource(id);
      setSources((prevSources) => prevSources.filter((source) => source._id !== id));
    } catch (err) {
      setFormError("Failed to delete the insight source.");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "transparent", // Remove the background color
        color: "#fff",
      }}
    >
      <h2
        style={{
          color: "#bbb",
          marginBottom: "20px",
          textAlign: "center",
          fontSize: "24px",
        }}
      >
        Insight Sources
      </h2>

      {/* Form to add a new insight source */}
      <form onSubmit={handleCreateSource} style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <input
            type="url"
            placeholder="Enter URL"
            value={newSourceUrl}
            onChange={(e) => setNewSourceUrl(e.target.value)}
            style={{
              padding: "10px",
              marginRight: "10px",
              backgroundColor: "#333",
              color: "#fff",
              border: "1px solid #444",
              borderRadius: "8px",
              width: "300px",
            }}
          />
          <input
            type="text"
            placeholder="Enter Name (optional)"
            value={newSourceName}
            onChange={(e) => setNewSourceName(e.target.value)}
            style={{
              padding: "10px",
              backgroundColor: "#333",
              color: "#fff",
              border: "1px solid #444",
              borderRadius: "8px",
              width: "300px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#444",
              color: "#fff",
              border: "1px solid #444",
              borderRadius: "8px",
              cursor: "pointer",
              marginLeft: "10px",
            }}
          >
            Add Source
          </button>
        </div>
        {formError && (
          <p style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
            {formError}
          </p>
        )}
      </form>

      {/* Display source cards as favorites in a scrollable list */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "16px",
          maxHeight: "500px", // Set a max height
          overflowY: "auto", // Make the list scrollable vertically
          paddingRight: "20px", // Add right padding for scroll
        }}
      >
        {sources.map((source) => (
          <div
            key={source._id}
            style={{
              border: "1px solid #444",
              borderRadius: "8px",
              padding: "10px",
              cursor: "pointer",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              position: "relative",
            }}
            onClick={() => handleSourceClick(source)} // Update last_visited and open the URL
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 4px 8px rgba(255, 255, 255, 0.2)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            {/* Favicon - Using Next.js Image component */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start", // Align favicon to the left
                marginBottom: "8px", // Reduced margin
              }}
            >
              <Image
                src={`https://www.google.com/s2/favicons?domain=${source.url}`}
                alt={source.name || "No name"}
                width={20}  // Set width for the favicon
                height={20} // Set height for the favicon
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* Other content remains unchanged */}
            <h3
              style={{
                color: "#fff",
                fontSize: "0.9em", // Smaller font size
                textAlign: "center",
                marginBottom: "6px", // Reduced margin
                fontWeight: "bold",
                wordWrap: "break-word",
              }}
            >
              {source.name || "No name available"}
            </h3>

            {/* Last visited time */}
            <p
              style={{
                fontSize: "0.75em", // Smaller font size for last visited
                color: "#bbb",
                marginBottom: "6px", // Reduced margin
                textAlign: "center",
              }}
            >
              <strong>Last Visited:</strong>{" "}
              {formatLastVisited(source.last_visited)}
            </p>

            {/* Delete Button positioned at the top right */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent the card click action
                handleDeleteSource(source._id);
              }}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                padding: "6px 6px",
                backgroundColor: "#e74c3c",
                color: "#fff",
                border: "1px solid #e74c3c",
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>

      {/* Show details of the selected source */}
      {selectedSource && (
        <div
          style={{
            border: "1px solid #444",
            borderRadius: "8px",
            padding: "16px",
            marginTop: "32px",
            backgroundColor: "#1e1e1e",
          }}
        >
          <h3 style={{ color: "#bbb" }}>
            {selectedSource.name || "No name available"}
          </h3>
          <p>
            <strong>Last Visited:</strong>{" "}
            {formatLastVisited(selectedSource.last_visited)}
          </p>
          <p>
            <strong>Remark:</strong>{" "}
            {selectedSource.remark || "No remarks available"}
          </p>
          <form onSubmit={() => handleUpdateSource(selectedSource._id)}>
            <input
              type="text"
              placeholder="Update Name"
              value={newSourceName}
              onChange={(e) => setNewSourceName(e.target.value)}
              style={{
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#333",
                color: "#fff",
                border: "1px solid #444",
                borderRadius: "8px",
                width: "100%",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "#444",
                color: "#fff",
                border: "1px solid #444",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Update Source
            </button>
          </form>

          {/* Delete Button */}
          <button
            onClick={() => handleDeleteSource(selectedSource._id)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#e74c3c",
              color: "#fff",
              border: "1px solid #e74c3c",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default InsightSourceList;
