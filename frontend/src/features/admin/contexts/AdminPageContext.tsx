"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface AdminPageContextType {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  selectedPageId: string | null;
  setSelectedPageId: (id: string | null) => void;
}

const AdminPageContext = createContext<AdminPageContextType | undefined>(
  undefined,
);

export function AdminPageProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

  return (
    <AdminPageContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedPageId,
        setSelectedPageId,
      }}
    >
      {children}
    </AdminPageContext.Provider>
  );
}

export function useAdminPage() {
  const context = useContext(AdminPageContext);
  if (context === undefined) {
    throw new Error("useAdminPage must be used within an AdminPageProvider");
  }
  return context;
}
