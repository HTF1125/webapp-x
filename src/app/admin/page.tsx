"use client";

import React from "react";
import MetadataPage from "./MetadataPage"; // Adjust the import if your file is named differently
import { MetadataProvider } from "./provider";

const InsightPage = () => {
  return (
    <div className="text-white flex flex-col items-center px-4 py-6">
      <MetadataProvider>
        <MetadataPage />
      </MetadataProvider>
    </div>
  );
};

export default InsightPage;
