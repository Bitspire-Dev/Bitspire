"use client";

import React from "react";
import { useTina } from "tinacms/dist/react";

interface AdminPreviewProviderProps<TData> {
  query: string;
  variables: Record<string, unknown>;
  data: TData;
  render: (data: TData) => React.ReactNode;
}

/**
 * Thin wrapper around useTina to keep preview wiring in one place.
 * Server should provide query + variables + initial data.
 */
export function AdminPreviewProvider<TData>({ query, variables, data, render }: AdminPreviewProviderProps<TData>) {
  const { data: liveData } = useTina({ query, variables, data: data as object });
  return <>{render(liveData as TData)}</>;
}
