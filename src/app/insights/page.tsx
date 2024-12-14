"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import InsightCard from "./InsightCard";
import UpdateModal from "./UpdateModal";
import { fetchInsights } from "./api";
import { useLogin } from "@/components/LoginProvider";
import { fetchAdmin } from "@/api/login";
import Insight from "@/api/all";

export default function Page() {
  const { logout } = useLogin();
  const router = useRouter();

  const [allInsights, setAllInsights] = useState<Insight[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const isInitialized = useRef(false);

  // Memoized handleLogout function
  const handleLogout = useCallback(async () => {
    try {
      localStorage.removeItem("token");
      setAllInsights([]);
      setInsights([]);
      setSearchTerm("");
      setSelectedInsight(null);
      setIsAdmin(false);
      logout();
      router.push("/sign-in");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, [logout, router]);

  // Initialize Page Data
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const initializePage = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        handleLogout();
        return;
      }

      try {
        const [adminStatus, fetchedInsights] = await Promise.all([
          fetchAdmin(token),
          fetchInsights(""),
        ]);

        setIsAdmin(adminStatus);
        setAllInsights(fetchedInsights);
        setInsights(fetchedInsights);
      } catch (error) {
        console.error("Error initializing page:", error);
        handleLogout();
      }
    };

    initializePage();

    return () => {
      setAllInsights([]);
      setInsights([]);
    };
  }, [handleLogout]);

  // Handle Search Functionality
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term) {
      const filtered = allInsights.filter((insight) =>
        ["name", "issuer", "published_date"].some((key) =>
          insight[key as keyof Insight]?.toString()?.toLowerCase().includes(term.toLowerCase())
        )
      );
      setInsights(filtered);
    } else {
      setInsights(allInsights);
    }
  };

  // Handle Modify Insight
  const handleModify = (insight: Insight) => {
    setSelectedInsight(insight);
    setIsModalOpen(true);
  };

  // Handle Select from SearchBar
  const handleSelect = (selectedSnippet: string) => {
    const filtered = allInsights.filter((insight) => {
      const snippet = `${insight.issuer} - ${insight.name} - ${insight.published_date}`;
      return snippet === selectedSnippet;
    });
    setInsights(filtered);
  };

  return (
    <div className="flex flex-col items-center p-3 space-y-3 bg-gray-900 text-gray-200 min-h-screen">
      <div className="w-full max-w-4xl space-y-4">
        {/* Search Bar */}
        <SearchBar
          searchTerm={searchTerm}
          suggestions={allInsights.map((insight) => ({
            name: insight.name,
            issuer: insight.issuer,
            published_date: insight.published_date,
          }))}
          filterBy={["name", "issuer", "published_date"]}
          displayAttributes={["issuer", "name", "published_date"]}
          onSearch={handleSearch}
          onSelect={handleSelect}
        />

        {/* Insights Count and Add Button */}
        <div className="flex justify-between items-center text-xs text-gray-400 mt-3">
          <div>
            Showing {insights.length} out of {allInsights.length} insights
          </div>
          {isAdmin && (
            <button
              className="bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600"
              onClick={() => {
                setSelectedInsight({
                  _id: "",
                  issuer: "",
                  name: "",
                  published_date: "",
                  summary: "",
                });
                setIsModalOpen(true);
              }}
            >
              Add Insight
            </button>
          )}
        </div>

        {/* Insight Cards */}
        <div className="grid grid-cols-1 gap-2">
          {insights.length > 0 ? (
            insights.map((insight) => (
              <InsightCard
                key={insight._id}
                insight={insight}
                selectedInsight={selectedInsight}
                onSelectInsight={setSelectedInsight}
                isAdmin={isAdmin}
                onModify={handleModify}
              />
            ))
          ) : (
            <p className="text-gray-500">No results found.</p>
          )}
        </div>
      </div>

      {/* Add Insight Modal */}
      {isModalOpen && (
        <UpdateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentInsight={selectedInsight || {}}
          onSaveComplete={(updatedInsight) => {
            if (updatedInsight._id) {
              setAllInsights((prev) =>
                prev.map((item) =>
                  item._id === updatedInsight._id ? updatedInsight : item
                )
              );
              setInsights((prev) =>
                prev.map((item) =>
                  item._id === updatedInsight._id ? updatedInsight : item
                )
              );
            } else {
              setAllInsights((prev) => [updatedInsight, ...prev]);
              setInsights((prev) => [updatedInsight, ...prev]);
            }
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
