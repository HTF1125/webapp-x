"use client";

import React, { useState } from "react";
import { useInsights } from "./provider";
import {
  FileText,
  Edit3,
  RotateCcw,
  Trash2,
  MoreVertical,
  Info,
} from "lucide-react";
import { Insight } from "./InsightApi";
import SummaryModal from "./SummaryModal";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

const InsightCard: React.FC<{
  insight: Insight;
}> = ({ insight }) => {
  const { setSelectedInsight, handleUpdateSummary, handleDelete } =
    useInsights();

  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  return (
    <div className="grid grid-cols-12 items-center gap-4 bg-black text-white border-b border-gray-700 py-2 hover:bg-gray-900 transition-colors duration-200">
      {/* Insight Name */}
      <div className="col-span-5 flex items-center gap-2 text-sm font-semibold truncate">
        <button
          className="text-white hover:text-cyan-400"
          onClick={(e) => {
            e.stopPropagation();
            setIsSummaryModalOpen(true);
          }}
        >
          <Info size={16} />
        </button>
        <span>{insight.name}</span>
      </div>

      {/* Issuer */}
      <div className="col-span-3 text-xs text-gray-500 truncate">
        {insight.issuer || "Unknown"}
      </div>

      {/* Publication Date */}
      <div className="col-span-2 text-xs text-gray-500 text-right">
        {new Date(insight.published_date).toLocaleDateString()}
      </div>

      {/* Dropdown Menu for Actions */}
      <div className="col-span-2 flex justify-end">
        <Dropdown>
          <DropdownTrigger>
            <button className="text-white hover:text-cyan-400">
              <MoreVertical size={16} />
            </button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Insight Actions"
            className="bg-black text-white"
            onAction={(key) => {
              switch (key) {
                case "pdf":
                  window.open(
                    `https://files.investment-x.app/${insight._id}.pdf`,
                    "pdfWindow",
                    "width=800,height=600,resizable,scrollbars"
                  );
                  break;
                case "edit":
                  setSelectedInsight(insight);
                  break;
                case "update":
                  handleUpdateSummary(insight);
                  break;
                case "delete":
                  handleDelete(insight);
                  break;
                default:
                  break;
              }
            }}
          >
            <DropdownItem key="pdf" startContent={<FileText size={14} />}>
              PDF
            </DropdownItem>
            <DropdownItem key="edit" startContent={<Edit3 size={14} />}>
              Edit
            </DropdownItem>
            <DropdownItem key="update" startContent={<RotateCcw size={14} />}>
              Update
            </DropdownItem>
            <DropdownItem
              key="delete"
              startContent={<Trash2 size={14} />}
              color="danger"
            >
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

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
