"use client";

import React from "react";
import InsightTable from "./InsightTable";
import SourceList from "./SourceSheet";

const Page = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-6">
      <InsightTable />
      <SourceList />
    </div>
  );
};

export default Page;
