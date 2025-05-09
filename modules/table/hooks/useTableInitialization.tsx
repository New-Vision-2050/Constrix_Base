import { useEffect, useRef } from "react";
import { useTableStore } from "@/modules/table/store//useTableStore";
import { ColumnConfig } from "@/modules/table/utils/tableConfig";
import { SearchConfig } from "@/modules/table/utils/tableTypes";
import { useTranslations } from "next-intl";
import Execution from "@/app/[locale]/(main)/companies/cells/execution";

interface TableInitializationProps {
  formConfig?: any;
  executions?: [];
  executionsConfig?: {
    canEdit?: boolean;
    canDelete?: boolean;
  };
  configColumns?: ColumnConfig[];
  availableColumnKeys?: string[]; // New: Array of column keys that should be available
  defaultVisibleColumnKeys?: string[]; // New: Array of column keys that should be visible by default
  defaultItemsPerPage: number;
  defaultSortColumn: string | null;
  defaultSortDirection: "asc" | "desc" | null;
  defaultSearchQuery: string;
  searchConfig?: SearchConfig;
  setPagination: (
    currentPage: number,
    totalPages: number,
    itemsPerPage: number
  ) => void;
  setSort: (column: string | null, direction: "asc" | "desc" | null) => void;
  setSearch: (query: string, fields?: string[]) => void;
  setColumns: (columns: ColumnConfig[]) => void;
  setVisibleColumns?: (columnKeys: string[]) => void;
  tableId?: string; // Add tableId parameter
}

export const useTableInitialization = ({
  formConfig,
  executions = [],
  executionsConfig,
  configColumns,
  availableColumnKeys,
  defaultVisibleColumnKeys,
  defaultItemsPerPage,
  defaultSortColumn,
  defaultSortDirection,
  defaultSearchQuery,
  searchConfig,
  setPagination,
  setSort,
  setSearch,
  setColumns,
  setVisibleColumns,
  tableId = "default", // Default to 'default' if not provided
}: TableInitializationProps) => {
  const t = useTranslations();

  const isInitializedRef = useRef<boolean>(false);

  // Initialize state only once
  useEffect(() => {
    if (isInitializedRef.current) return;

    isInitializedRef.current = true;

    if (process.env.NODE_ENV === "development") {
      console.log(`[TableInit] Initializing table ${tableId}`);
    }

    // Set initial pagination options
    setPagination(1, 1, defaultItemsPerPage);

    // Set initial sort state if provided
    if (defaultSortColumn && defaultSortDirection) {
      setSort(defaultSortColumn, defaultSortDirection);
    }

    // Set initial search query if provided
    if (defaultSearchQuery) {
      setSearch(defaultSearchQuery, searchConfig?.defaultFields);
    }

    // Set initial columns if provided
    if (configColumns && configColumns.length > 0) {
      console.log("--------2-2-2-2-2----", {
        configColumns,
      });
      const hasIdKey = configColumns.some((column) => column.key === "id");

      if (!hasIdKey) {
        configColumns.push({
          key: "id",
          label: t("Companies.Actions"),
          render: (_: unknown, row: any) => (
            <Execution
              row={row}
              formConfig={formConfig}
              executions={executions}
              tableName={tableId}
              buttonLabel={t("Companies.Actions")}
              showEdit={Boolean(executionsConfig?.canEdit)}
              showDelete={Boolean(executionsConfig?.canDelete)}
            />
          ),
        });
      }

      // Filter columns based on availableColumnKeys if provided
      let filteredColumns = [...configColumns];
      if (availableColumnKeys && availableColumnKeys.length > 0) {
        filteredColumns = filteredColumns.filter(col =>
          availableColumnKeys.includes(col.key)
        );
      }

      setColumns(filteredColumns);

      // Also initialize visible columns if the function is provided
      if (setVisibleColumns) {
        // Use defaultVisibleColumnKeys if provided, otherwise use all column keys
        const columnKeys = defaultVisibleColumnKeys && defaultVisibleColumnKeys.length > 0
          ? defaultVisibleColumnKeys
          : filteredColumns.map((col) => col.key);
        
        setVisibleColumns(columnKeys);
      }
    }

    // Force a single fetch after initialization
    // We use a longer timeout to ensure all state changes are applied
    setTimeout(() => {
      // Trigger a reload using the tableStore
      const tableStore = useTableStore.getState();
      if (tableStore.tables[tableId]) {
        if (process.env.NODE_ENV === "development") {
          console.log(`[TableInit] Triggering reload for table ${tableId}`);
        }

        // Set a flag to indicate this is an initialization reload
        if (typeof window !== "undefined") {
          (window as any).__tableInitReload = true;
        }

        // Trigger the reload
        tableStore.reloadTable(tableId);

        // Clear the flag after a short delay
        setTimeout(() => {
          if (typeof window !== "undefined") {
            (window as any).__tableInitReload = false;
          }
        }, 200);
      }
    }, 300); // Increased timeout to ensure all state changes are applied
  }, []);

  return { isInitialized: isInitializedRef.current };
};
