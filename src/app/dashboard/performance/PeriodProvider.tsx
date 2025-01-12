"use client";

import React, { createContext, useContext, useState } from "react";
import { Period } from "@/services/perfApi";

interface PeriodContextProps {
  currentPeriod: Period;
  setCurrentPeriod: (period: Period) => void;
}

const PeriodContext = createContext<PeriodContextProps | undefined>(undefined);

export const PeriodProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentPeriod, setCurrentPeriod] = useState<Period>("ytd");

  return (
    <PeriodContext.Provider value={{ currentPeriod, setCurrentPeriod }}>
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
