import { createTableComponent } from "./components/table-component";
import { TableLayoutComponent } from "./components/table-layout";

// Re-export types for backward compatibility
export type {
  ColumnDef,
  TableProps,
  LoadingOptions,
  SelectionConfig,
} from "./components/table-component/types";
export type { TableLayoutProps } from "./components/table-layout/types";

// ============================================================================
// Headless Table Factory
// ============================================================================

export function HeadlessTableLayout<TRow>() {
  const TableComponent = createTableComponent<TRow>();
  const Layout = TableLayoutComponent;

  const LayoutWithTable = Layout as typeof Layout & {
    Table: typeof TableComponent;
  };
  LayoutWithTable.Table = TableComponent;

  return LayoutWithTable;
}

// ============================================================================
// Exports
// ============================================================================

export default HeadlessTableLayout;
