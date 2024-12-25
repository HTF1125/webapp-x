// src/components/Providers.tsx
"use client";

import React, { ReactNode } from "react";
import { AuthProvider } from "@/context/Auth/AuthContext";
import { ProgressProvider } from "@/context/Progress/ProgressContext";
import { TaskProvider } from "@/context/Task/TaskContext";

interface ProvidersProps {
  children: ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <ProgressProvider>
        <TaskProvider>{children}</TaskProvider>
      </ProgressProvider>
    </AuthProvider>
  );
};

export default Providers;
