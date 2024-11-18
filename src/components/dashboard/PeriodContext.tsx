"use client"; // Add this at the very top

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Period } from "./types";

interface PeriodContextProps {
  currentPeriod: Period;
  setPeriod: (period: Period) => void;
}

const PeriodContext = createContext<PeriodContextProps | undefined>(undefined);

export const PeriodProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPeriod, setPeriod] = useState<Period>("1w");

  return (
    <PeriodContext.Provider value={{ currentPeriod, setPeriod }}>
      {children}
    </PeriodContext.Provider>
  );
};

export const usePeriod = () => {
  const context = useContext(PeriodContext);
  if (!context) {
    throw new Error("usePeriod must be used within a PeriodProvider");
  }
  return context;
};
