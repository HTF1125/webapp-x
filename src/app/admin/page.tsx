"use client";

import React from "react";
import MetadataPage from "./MetadataPage"; // Adjust the import path if necessary
import { MetadataProvider } from "./provider";

const AdminPage = () => {
  return (
    <div className="text-white flex flex-col items-center px-4 py-6">
      <MetadataProvider>
        <MetadataPage />
      </MetadataProvider>
    </div>
  );
};

export default AdminPage;
