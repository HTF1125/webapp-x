"use client";

import React, { useState } from "react";
import { useInsights } from "./provider";
import { FileText, Edit3, RotateCcw, Trash2 } from "lucide-react";
import { Insight } from "./InsightApi";
import SummaryModal from "./SummaryModal";

const InsightCard: React.FC<{
  insight: Insight;
  isAdmin: boolean;
}> = ({ insight, isAdmin }) => {
  const { setSelectedInsight, handleUpdateSummary, handleDelete } = useInsights();
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 py-4 px-6 border-b border-divider bg-background text-sm hover:bg-muted transition-colors">
      <div className="flex-grow space-y-2 md:space-y-0 md:grid md:grid-cols-12 md:gap-4 w-full">
        <div className="md:col-span-3">
          <h3
            className="font-semibold text-foreground cursor-pointer hover:text-cyan-400 truncate"
            onClick={() => setIsSummaryModalOpen(true)}
          >
            {insight.name}
          </h3>
        </div>
        <div className="md:col-span-2">
          <p
            className="text-muted truncate"
            title={insight.issuer || "Unknown"}
          >
            {insight.issuer || "Unknown"}
          </p>
        </div>
        <div className="md:col-span-2">
          <p className="text-muted">
            {new Date(insight.published_date).toLocaleDateString()}
          </p>
        </div>
        <div className="md:col-span-5">
          <p
            className="text-muted truncate"
            title={insight.summary || "No summary available."}
          >
            {insight.summary
              ? insight.summary.substring(0, 100) + "..."
              : "No summary available"}
          </p>
        </div>
      </div>
      {isAdmin && (
        <div className="flex justify-end gap-3 mt-3 md:mt-0">
          <button
            className="text-muted hover:text-cyan-400 transition-colors"
            onClick={() => handleUpdateSummary(insight)}
            title="Update Summary"
          >
            <RotateCcw size={18} />
          </button>
          <button
            className="text-muted hover:text-cyan-400 transition-colors"
            onClick={() => {
              window.open(
                `https://files.investment-x.app/${insight._id}.pdf`,
                "_blank"
              );
            }}
            title="View PDF"
          >
            <FileText size={18} />
          </button>
          <button
            className="text-muted hover:text-cyan-400 transition-colors"
            onClick={() => setSelectedInsight(insight)}
            title="Edit"
          >
            <Edit3 size={18} />
          </button>
          <button
            className="text-muted hover:text-red-500 transition-colors"
            onClick={() => handleDelete(insight)}
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}

      {/* Summary Modal */}
      {isSummaryModalOpen && (
        <SummaryModal
          isOpen={isSummaryModalOpen}
          onClose={() => setIsSummaryModalOpen(false)}
          summary={insight.summary || "No summary available."}
        />
      )}
    </div>
  );
};

export default InsightCard;
