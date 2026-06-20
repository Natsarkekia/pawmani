"use client";

import { createContext, useContext, useTransition } from "react";

const BrowseContext = createContext<{
  startFilterTransition: (fn: () => void) => void;
  isFilterPending: boolean;
}>({ startFilterTransition: (fn) => fn(), isFilterPending: false });

export function BrowseProvider({ children }: { children: React.ReactNode }) {
  const [isFilterPending, startFilterTransition] = useTransition();
  return (
    <BrowseContext.Provider value={{ startFilterTransition, isFilterPending }}>
      {children}
    </BrowseContext.Provider>
  );
}

export function useBrowse() {
  return useContext(BrowseContext);
}
