// app/insights/[id]/page.tsx

import InsightContent from "./InsightContent";
import { Metadata } from "next";

interface Insight {
  _id: string;
  title: string;
  date: string;
  content: string;
  tags: string[];
}

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = params;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/data/insights/${id}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch insight");
    }

    const insight: Insight = await response.json();

    return {
      title: `${insight.title} | Insights`,
      description: insight.content.substring(0, 160),
      openGraph: {
        title: insight.title,
        description: insight.content.substring(0, 160),
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Insight",
    };
  }
}

export default async function InsightPage({ params }: PageProps) {
  const { id } = params;

  let insight: Insight | null = null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/data/insights/${id}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch insight");
    }

    insight = await response.json();
  } catch (error) {
    console.error("Error fetching insight:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-red-500">
          Unable to load insight. Please try again later.
        </p>
      </div>
    );
  }

  // Add this check to ensure 'insight' is not null
  if (!insight) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-red-500">
          Unable to load insight. Please try again later.
        </p>
      </div>
    );
  }

  return <InsightContent insight={insight} />;
}
