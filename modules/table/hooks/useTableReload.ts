"use client";
import { useCallback } from 'react';
import { useTableStore } from '@/modules/table/store/useTableStore';

/**
 * Custom hook that provides a method to reload the table data
 * This can be used after form submissions or other actions that modify data
 *
 * How it works:
 * 1. The hook uses the table store's setLoading method to trigger a loading state
 * 2. When loading state changes, the useTableFetchEffect hook in useTableData will
 *    detect the change and refetch the data from the server
 * 3. This ensures the table displays the most up-to-date data after form submissions
 *    or other actions that modify data
 */
export const useTableReload = () => {
  const { setLoading } = useTableStore();
  
  /**
   * Reload the table data by triggering a refetch
   * This works by temporarily setting loading to true, which will cause
   * the useTableFetchEffect to refetch the data
   */
  const reloadTable = useCallback(() => {
    // Set loading to true to trigger a refetch
    setLoading(true);
    
    // After a short delay, set loading back to false
    // This ensures the loading state is visible to the user
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, [setLoading]);

  return { reloadTable };
};