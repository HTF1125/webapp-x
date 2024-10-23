import React from "react";
import StrategyDetails from "./StrategyDetails";
import { fetchStrategyById } from "../api";
import Link from "next/link";

// Define the type for the params
interface Params {
  id: string;
}

const StrategyPage = async ({ params }: { params: Params }) => {
  try {
    const strategy = await fetchStrategyById(params.id);
    return (
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/strategies"
          className="text-blue-500 hover:underline mb-4 inline-block"
        >
          &larr; Back to Strategies
        </Link>

        <StrategyDetails strategy={strategy} />
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch strategy:", error);
    return (
      <div className="w-full min-h-screen px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Handle error state */}
        <p>Error loading strategy details.</p>
      </div>
    );
  }
};

export default StrategyPage;
