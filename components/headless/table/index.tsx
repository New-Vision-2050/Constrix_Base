import { createTableComponent } from "./components/table-component";
import { TableLayoutComponent } from "./components/table-layout";
import { createTableStateHook } from "./components/table-state";
import { createPaginationComponent } from "./components/pagination";
import { createTopActionsComponent } from "./components/top-actions";

// Re-export types for backward compatibility
export type {
  ColumnDef,
  TableProps,
  LoadingOptions,
  SelectionConfig,
} from "./components/table-component/types";
export type { TableLayoutProps } from "./components/table-layout/types";
export type {
  TableState,
  TableStateOptions,
  PaginationConfig,
} from "./components/table-state/types";

// ============================================================================
// Headless Table Factory
// ============================================================================

export function HeadlessTableLayout<TRow>() {
  const TableComponent = createTableComponent<TRow>();
  const PaginationComponent = createPaginationComponent<TRow>();
  const TopActionsComponent = createTopActionsComponent<TRow>();
  const useTableState = createTableStateHook<TRow>();
  const Layout = TableLayoutComponent;

  const LayoutWithComponents = Layout as typeof Layout & {
    Table: typeof TableComponent;
    Pagination: typeof PaginationComponent;
    TopActions: typeof TopActionsComponent;
    useState: typeof useTableState;
  };

  LayoutWithComponents.Table = TableComponent;
  LayoutWithComponents.Pagination = PaginationComponent;
  LayoutWithComponents.TopActions = TopActionsComponent;
  LayoutWithComponents.useState = useTableState;

  return LayoutWithComponents;
}

// ============================================================================
// Exports
// ============================================================================

export default HeadlessTableLayout;
