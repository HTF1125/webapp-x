// app/insights/add/page.tsx

import AddInsightForm from "./AddInsightForm";

export default function AddInsightPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Add New Insight</h1>
      <AddInsightForm />
    </div>
  );
}
