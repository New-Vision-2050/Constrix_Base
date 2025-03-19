"use client";
import { useTableInstance } from '@/modules/table/store/useTableStore';

/**
 * Custom hook that provides a method to reload the table data
 * This can be used after form submissions or other actions that modify data
 *
 * How it works:
 * 1. The hook uses the reloadTable method from the table instance
 * 2. This method is implemented in the TableStore and handles all the
 *    complexity of forcing a refetch by manipulating the search query
 * 3. This ensures the table displays the most up-to-date data after form submissions,
 *    deletions, or other actions that modify data, even if already on page 1
 */
export const useTableReload = (tableId: string = 'default') => {
  // Get the table instance for the specified tableId
  // which now includes the reloadTable method
  const { reloadTable } = useTableInstance(tableId);
  
  // Simply return the reloadTable method from the table instance
  return { reloadTable };
};