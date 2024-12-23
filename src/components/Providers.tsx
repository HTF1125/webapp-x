// src/components/Providers.tsx
"use client";

import React, { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { ProgressProvider } from "@/context/Progress/ProgressContext";
interface ProvidersProps {
  children: ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <ProgressProvider>{children}</ProgressProvider>
    </AuthProvider>
  );
};

export default Providers;
