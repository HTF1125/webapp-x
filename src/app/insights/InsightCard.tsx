// app/insights/InsightCard.tsx
"use client";

import React from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { FaCalendar, FaTag, FaArrowRight } from "react-icons/fa";

interface Insight {
  _id: string;
  title: string;
  date: string;
  content: string;
  tags: string[];
}

const InsightCard: React.FC<{ insight: Insight }> = ({ insight }) => {
  const formattedDate = new Date(insight.date).toLocaleDateString();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          {insight.title}
        </h2>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
          <FaCalendar className="mr-1" />
          <span>{formattedDate}</span>
        </div>
        <div className="prose dark:prose-dark max-w-none mb-2">
          <ReactMarkdown skipHtml={true}>
            {insight.content.substring(0, 200) + "..."}
          </ReactMarkdown>
        </div>
        <div className="flex flex-wrap gap-1 mb-2">
          {insight.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded dark:bg-blue-200 dark:text-blue-800 flex items-center"
            >
              <FaTag className="inline mr-1" />
              {tag}
            </span>
          ))}
        </div>
        <Link
          href={`/insights/${insight._id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Read more
          <FaArrowRight className="ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default InsightCard;
