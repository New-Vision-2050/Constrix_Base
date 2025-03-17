"use client";
import { useCallback } from "react";
import { FormConfig } from "../types/formTypes";
import { useSheetForm } from "./useSheetForm";
import { useTableStore } from "@/modules/table/store/useTableStore";

interface UseFormWithTableReloadProps {
  config: FormConfig;
  tableId: string;
  onSuccess?: (values: Record<string, any>) => void;
  onCancel?: () => void;
  formId?: string;
}

/**
 * Hook that combines form functionality with table reloading
 * This is useful when a form submission should trigger a table reload
 */
export const useFormWithTableReload = ({
  config,
  tableId,
  onSuccess,
  onCancel,
  formId,
}: UseFormWithTableReloadProps) => {
  // Use formId from config if provided, otherwise use the prop or default
  const actualFormId = config.formId || formId || 'form-with-table-reload';
  // Get the form functionality
  const form = useSheetForm({
    config,
    formId: actualFormId,
    onSuccess: (data) => {
      // Call the original onSuccess if provided
      if (onSuccess) {
        onSuccess(data);
      }
      
      // Reload the table
      reloadTable();
    },
    onCancel,
  });

  // Function to reload the table
  const reloadTable = useCallback(() => {
    // Get the table store
    const tableStore = useTableStore.getState();
    
    // Set loading state
    tableStore.setLoading(tableId, true);
    
    // Use a small timeout to ensure the loading state is applied
    setTimeout(() => {
      tableStore.setLoading(tableId, false);
    }, 100);
  }, [tableId]);

  return {
    ...form,
    reloadTable,
  };
};