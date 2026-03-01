import { createTableComponent } from "./components/table-component";
import { TableLayoutComponent } from "./components/table-layout";
import type { TableLayoutProps } from "./components/table-layout/types";
import { createTableParamsHook } from "./components/table-params";
import { createTableStateV2Hook } from "./components/table-state-v2";
import { createPaginationComponent } from "./components/pagination";
import { createTopActionsComponent } from "./components/top-actions";
import { createSearchComponent } from "./components/search";
import { createColumnVisibilityHook } from "./components/column-visibility";

// Re-export types
export type {
  ColumnDef,
  TableProps,
  LoadingOptions,
  SelectionConfig,
} from "./components/table-component/types";
export type { TableLayoutProps } from "./components/table-layout/types";
export type {
  TableParams,
  TableParamsOptions,
} from "./components/table-params/types";
export type {
  TableStateV2 as TableState,
  TableStateV2Options as TableStateOptions,
} from "./components/table-state-v2/types";
export type { SearchProps } from "./components/search/types";
export type { ColumnVisibilityState } from "./components/column-visibility";

// ============================================================================
// Headless Table Factory
// ============================================================================

export function HeadlessTableLayout<TRow>(prefix?: string) {
  const TableComponent = createTableComponent<TRow>();
  const PaginationComponent = createPaginationComponent<TRow>();
  const useTableParams = createTableParamsHook(prefix);
  const SearchComponent = createSearchComponent();
  const useTableState = createTableStateV2Hook<TRow>(prefix);
  const useColumnVisibility = createColumnVisibilityHook<TRow>(prefix);
  const TopActionsComponent = createTopActionsComponent<TRow>(SearchComponent);

  // Create a new Layout component instance for each call
  const Layout = Object.assign(
    function TableLayout(props: TableLayoutProps) {
      return TableLayoutComponent(props);
    },
    {
      Table: TableComponent,
      Pagination: PaginationComponent,
      TopActions: TopActionsComponent,
      Search: SearchComponent,
      useTableParams: useTableParams,
      useTableState: useTableState,
      useColumnVisibility: useColumnVisibility,
    },
  );

  return Layout as typeof TableLayoutComponent & {
    Table: typeof TableComponent;
    Pagination: typeof PaginationComponent;
    TopActions: typeof TopActionsComponent;
    Search: typeof SearchComponent;
    useTableParams: typeof useTableParams;
    useTableState: typeof useTableState;
    useColumnVisibility: typeof useColumnVisibility;
  };
}

// ============================================================================
// Exports
// ============================================================================

export default HeadlessTableLayout;
