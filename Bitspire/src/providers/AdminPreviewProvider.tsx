"use client";

import React from "react";
import { useEditState, useTina } from "tinacms/dist/react";

type AdminPreviewContextValue = unknown;

const AdminPreviewContext = React.createContext<AdminPreviewContextValue | null>(null);

export function useAdminPreviewData<TData>(): TData {
  const value = React.useContext(AdminPreviewContext);
  if (value === null) {
    throw new Error("useAdminPreviewData must be used within AdminPreviewProvider");
  }
  return value as TData;
}

interface AdminPreviewProviderProps<TData> {
  query: string;
  variables: Record<string, unknown>;
  data: TData;
  children: React.ReactNode;
}

/**
 * Thin wrapper around useTina to keep preview wiring in one place.
 * Server should provide query + variables + initial data.
 */
export function AdminPreviewProvider<TData>({ query, variables, data, children }: AdminPreviewProviderProps<TData>) {
  const { edit } = useEditState();
  const { data: liveData } = useTina({ query, variables, data: data as object });
  return (
    <AdminPreviewContext.Provider value={liveData as TData}>
      <div data-tina-edit-mode={edit ? "true" : "false"}>{children}</div>
    </AdminPreviewContext.Provider>
  );
}
