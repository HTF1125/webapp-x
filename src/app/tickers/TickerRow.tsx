"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { TickerInfo } from "@/api/all";

export default function TickerRow({ ticker }: { ticker: TickerInfo }) {
  const router = useRouter();

  const handleRowClick = () => {
    router.push(`/tickers/${ticker.code}`);
  };

  return (
    <tr
      onClick={handleRowClick}
      className="hover:bg-gray-800 cursor-pointer transition-all duration-150"
    >
      <td className="px-4 py-2">{ticker.code}</td>
      <td className="px-4 py-2">{ticker.name || "N/A"}</td>
      <td className="px-4 py-2">{ticker.exchange || "N/A"}</td>
      <td className="px-4 py-2">{ticker.market || "N/A"}</td>
      <td className="px-4 py-2">{ticker.source || "N/A"}</td>
    </tr>
  );
}
