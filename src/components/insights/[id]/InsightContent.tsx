// app/insights/[id]/InsightContent.tsx
"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { FaCalendar, FaTags, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

interface Insight {
  _id: string;
  title: string;
  date: string;
  content: string;
  tags: string[];
}

interface InsightContentProps {
  insight: Insight;
}

const InsightContent: React.FC<InsightContentProps> = ({ insight }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Back to Insights Link */}
        <Link
          href="/insights"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200 mb-6"
          aria-label="Back to Insights"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back to Insights</span>
        </Link>

        {/* Insight Article */}
        <article className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          {/* Insight Header */}
          <header className="bg-gray-700 p-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              {insight.title}
            </h1>
            <div className="flex items-center text-gray-400 text-sm">
              <FaCalendar className="mr-1" />
              <time dateTime={insight.date}>
                {new Date(insight.date).toLocaleDateString()}
              </time>
            </div>
          </header>

          {/* Insight Content */}
          <div className="p-6">
            <div className="prose prose-invert max-w-none mb-6">
              <ReactMarkdown skipHtml={true}>
                {insight.content}
              </ReactMarkdown>
            </div>

            {/* Insight Footer with Tags */}
            <footer className="mt-8 pt-4 border-t border-gray-700">
              <div className="flex items-center">
                <FaTags className="text-gray-500 mr-2" />
                <div className="flex flex-wrap">
                  {insight.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-600 text-white rounded-full px-3 py-1 text-sm font-medium mr-2 mb-2"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </footer>
          </div>
        </article>
      </div>
    </div>
  );
};

export default InsightContent;
