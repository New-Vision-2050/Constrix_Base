"use client";
import { useState, useCallback, useEffect } from "react";
import { FormConfig } from "../types/formTypes";
import { useSheetForm } from "./useSheetForm";
import { useTableReload } from "@/modules/table";

interface UseSheetFormWithTableReloadProps {
  config: FormConfig;
  onSuccess?: (values: Record<string, any>) => void;
  onCancel?: () => void;
  autoReloadTable?: boolean; // Option to control whether to auto-reload the table
}

/**
 * Enhanced version of useSheetForm that automatically reloads the table after successful form submission
 */
export function useSheetFormWithTableReload({
  config,
  onSuccess,
  onCancel,
  autoReloadTable = true, // Default to true
}: UseSheetFormWithTableReloadProps) {
  // Get the table reload function
  const { reloadTable } = useTableReload();
  
  // Create a wrapped onSuccess callback that reloads the table
  const handleSuccess = useCallback(
    (values: Record<string, any>) => {
      // If autoReloadTable is enabled, reload the table
      if (autoReloadTable) {
        reloadTable();
      }
      
      // Call the original onSuccess callback if provided
      if (onSuccess) {
        onSuccess(values);
      }
    },
    [onSuccess, reloadTable, autoReloadTable]
  );
  
  // Use the original useSheetForm hook with our wrapped onSuccess callback
  const formHook = useSheetForm({
    config,
    onSuccess: handleSuccess,
    onCancel,
  });
  
  return {
    ...formHook,
    reloadTable, // Also expose the reloadTable function for manual reloading
  };
}