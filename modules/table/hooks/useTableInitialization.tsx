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
  deleteConfirmMessage?: string; // Add deleteConfirmMessage parameter
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
  deleteConfirmMessage,
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
      const hasIdKey = configColumns.some((column) => column.key === "id");

      // Create a new array with action column to avoid mutating the original
      let columnsWithActions = [...configColumns];
      
      // Check if we should add action column (if there are any actions available)
      const shouldAddActionColumn = !hasIdKey && (
        Boolean(executionsConfig?.canEdit) ||
        Boolean(executionsConfig?.canDelete) ||
        (executions && executions.length > 0)
      );
      
      if (shouldAddActionColumn) {
        columnsWithActions.push({
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
              deleteConfirmMessage={deleteConfirmMessage}
            />
          ),
        });
      }

      // Filter columns based on availableColumnKeys if provided
      let filteredColumns = [...columnsWithActions];
      if (availableColumnKeys && availableColumnKeys.length > 0) {
        filteredColumns = filteredColumns.filter(col =>
          availableColumnKeys.includes(col.key) ||
          (col.key === "id" && shouldAddActionColumn) // Always include action column if it should be added
        );
      }
      
      setColumns(filteredColumns);

      // Also initialize visible columns if the function is provided
      if (setVisibleColumns) {
        // Use defaultVisibleColumnKeys if provided, otherwise use all column keys
        let columnKeys = defaultVisibleColumnKeys && defaultVisibleColumnKeys.length > 0
          ? defaultVisibleColumnKeys
          : filteredColumns.map((col) => col.key);
        
        // Always include action column in visible columns if it should be added and exists
        if (shouldAddActionColumn && !columnKeys.includes("id")) {
          columnKeys = [...columnKeys, "id"];
        }
        
        console.log("👁️ Visible columns being set:", columnKeys);
        
        setVisibleColumns(columnKeys);
      }
    }

    // Don't trigger an additional reload here as useTableFetchEffect will handle the initial fetch
    // This prevents the double request issue
    if (process.env.NODE_ENV === "development") {
      console.log(`[TableInit] Table ${tableId} initialized, letting useTableFetchEffect handle the initial fetch`);
    }
  }, []);

  return { isInitialized: isInitializedRef.current };
};
