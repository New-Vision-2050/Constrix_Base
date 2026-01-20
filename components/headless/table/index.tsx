import { createTableComponent } from "./components/table-component";
import { TableLayoutComponent } from "./components/table-layout";
import { createTableParamsHook } from "./components/table-params";
import { createTableStateV2Hook } from "./components/table-state-v2";
import { createPaginationComponent } from "./components/pagination";
import { createTopActionsComponent } from "./components/top-actions";
import { createSearchComponent } from "./components/search";

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

// ============================================================================
// Headless Table Factory
// ============================================================================

export function HeadlessTableLayout<TRow>() {
  const TableComponent = createTableComponent<TRow>();
  const PaginationComponent = createPaginationComponent<TRow>();
  const SearchComponent = createSearchComponent();
  const useTableParams = createTableParamsHook();
  const useTableState = createTableStateV2Hook<TRow>();
  const TopActionsComponent = createTopActionsComponent<TRow>(SearchComponent);
  const Layout = TableLayoutComponent;

  const LayoutWithComponents = Layout as typeof Layout & {
    Table: typeof TableComponent;
    Pagination: typeof PaginationComponent;
    TopActions: typeof TopActionsComponent;
    Search: typeof SearchComponent;
    useTableParams: typeof useTableParams;
    useTableState: typeof useTableState;
  };

  LayoutWithComponents.Table = TableComponent;
  LayoutWithComponents.Pagination = PaginationComponent;
  LayoutWithComponents.TopActions = TopActionsComponent;
  LayoutWithComponents.Search = SearchComponent;
  LayoutWithComponents.useTableParams = useTableParams;
  LayoutWithComponents.useTableState = useTableState;

  return LayoutWithComponents;
}

// ============================================================================
// Exports
// ============================================================================

export default HeadlessTableLayout;
