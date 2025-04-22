"use client";

// Export components
export { default as TableBuilder } from './components/TableBuilder';
export { default as ConfigurableTable } from './components/ConfigurableTable';

// Export hooks
export { useTableData } from './hooks/useTableData';
export { useTableReload } from './hooks/useTableReload';
export { useResetTableOnRouteChange } from './hooks/useResetTableOnRouteChange';
export { useTableInstance } from './store/useTableStore';

// Export types
export type { TableConfig } from './utils/configs/tableConfig';
export type { ColumnConfig } from './utils/tableConfig';
export type { TableData } from './utils/tableTypes';
