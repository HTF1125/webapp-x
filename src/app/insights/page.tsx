// app/insights/page.tsx

import { fetchFinancialInsights } from './api';
import { InsightHeader } from './types';
import InsightsList from './InsightsList';

export default async function InsightsPage() {
  const insightHeaders: InsightHeader[] = await fetchFinancialInsights();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Financial Insights</h1>
      <InsightsList insightHeaders={insightHeaders} />
    </div>
  );
}
