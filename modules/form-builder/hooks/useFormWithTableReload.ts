"use client";
import { FormConfig } from "../types/formTypes";
import { useSheetForm } from "./useSheetForm";
import { useTableInstance } from "@/modules/table/store/useTableStore";

interface UseFormWithTableReloadProps {
  config: FormConfig;
  tableId: string;
  onSuccess?: (values: Record<string, any>) => void;
  onCancel?: () => void;
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
}: UseFormWithTableReloadProps) => {
  // Get the reloadTable function from the table instance
  const { reloadTable } = useTableInstance(tableId);

  // Get the form functionality
  const form = useSheetForm({
    config,
    onSuccess: (data) => {
      // Call the original onSuccess if provided
      if (onSuccess) {
        onSuccess(data);
      }
      
      // Reload the table using the centralized method from TableStore
      reloadTable();
    },
    onCancel,
  });

  return {
    ...form,
    reloadTable,
  };
};