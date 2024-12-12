"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InsightCard from "./InsightCard";
import { fetchInsights } from "./api";
import SearchBar from "@/components/SearchBar";
import { useLogin } from "@/components/LoginProvider";
import Insight from "@/api/all";
import { fetchAdmin } from "@/api/login";
import AddInsightModal from "./AddInsightModal";

export default function Page({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const { isAuthenticated, logout } = useLogin();
  const router = useRouter();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams?.search || "");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const initializePage = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        logout();
        router.push("/sign-in");
        return;
      }

      try {
        const adminStatus = await fetchAdmin(token);
        setIsAdmin(adminStatus);

        const fetchedInsights = await fetchInsights(searchTerm);
        setInsights(fetchedInsights);
      } catch (error) {
        console.error("Error initializing page:", error);
        logout();
        router.push("/sign-in");
      } finally {
        setIsCheckingAuth(false);
        setIsLoading(false);
      }
    };

    initializePage();
  }, [searchTerm, logout, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-5xl space-y-6">
        {/* Add Insight Button */}
        {isAdmin && (
          <div className="flex justify-end">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              onClick={() => setIsModalOpen(true)}
            >
              Add Insight
            </button>
          </div>
        )}

        {/* Search Bar */}
        <SearchBar
          searchTerm={searchTerm}
          suggestions={insights.map((insight) => ({
            name: insight.name,
            issuer: insight.issuer,
            date: new Date(insight.published_date).toISOString().split("T")[0],
          }))}
          filterBy={["name", "issuer", "date"]}
          displayAttributes={["issuer", "name", "date"]}
          onSearch={(value) => setSearchTerm(value)}
        />

        {/* Insights List */}
        <div className="bg-gray-800 rounded-lg shadow-md p-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-6">
              <p className="text-gray-400 text-sm">Loading insights...</p>
            </div>
          ) : insights.length === 0 ? (
            <div className="flex justify-center items-center py-6">
              <p className="text-gray-400 text-sm">
                No insights found matching your search.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {insights.map((insight) => (
                <InsightCard key={insight._id} insight={insight} />
              ))}
            </div>
          )}
        </div>

        {/* Add Insight Modal */}
        {isModalOpen && (
          <AddInsightModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={async (newInsight, file) => {
              try {
                const token = localStorage.getItem("token");
                if (!token) {
                  throw new Error("You need to log in to perform this action.");
                }

                const formData = new FormData();
                formData.append("insight", JSON.stringify(newInsight));
                if (file) formData.append("file", file);

                const response = await fetch("/api/insights", {
                  method: "POST",
                  headers: { Authorization: `Bearer ${token}` },
                  body: formData,
                });

                if (!response.ok) {
                  throw new Error("Failed to save the new insight.");
                }

                const updatedInsights = await fetchInsights(searchTerm);
                setInsights(updatedInsights);
                setIsModalOpen(false);
              } catch (error) {
                console.error("Error saving insight:", error);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
