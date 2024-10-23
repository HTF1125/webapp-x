// app/insights/[id]/page.tsx

import { fetchInsightDetails } from '../api';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Insight } from '../types';

export default async function InsightPage({ params }: { params: { id: string } }) {
  try {
    const insight: Insight = await fetchInsightDetails(params.id);

    if (!insight) {
      notFound();
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/insights" className="text-blue-500 hover:underline mb-4 inline-block">
          &larr; Back to Insights
        </Link>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">{insight.title}</h1>
          <p className="text-sm text-gray-500 mb-2">Date: {insight.date}</p>
          <div className="prose max-w-none">
            <ReactMarkdown>{insight.content}</ReactMarkdown>
          </div>
          <div className="mt-4">
            {insight.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return <div className="text-red-500">Error loading insight</div>;
  }
}
