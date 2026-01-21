# Column Visibility Feature

This feature allows users to show/hide table columns with state persisted in localStorage (when a prefix is provided).

## Features

- ✅ Toggle individual columns on/off
- ✅ Show/Hide all columns at once
- ✅ Reset to default (all visible)
- ✅ Persists state in localStorage (when prefix provided)
- ✅ Visual indicator showing hidden column count
- ✅ Only available when table has a unique prefix

## Usage

### 1. Create table with prefix (required for column visibility)

```typescript
const WarehousesTable = HeadlessTableLayout<WarehouseRow>("warehouses");
```

### 2. Use the column visibility hook

```typescript
const params = WarehousesTable.useTableParams({
  initialPage: 1,
  initialLimit: 10,
});

// Add column visibility hook
const columnVisibility = WarehousesTable.useColumnVisibility(columns);
```

### 3. Pass columnVisibility to useTableState

```typescript
const state = WarehousesTable.useTableState({
  data,
  columns,
  totalPages,
  totalItems,
  params,
  selectable: true,
  searchable: true,
  columnVisibility, // Add this
  getRowId: (row) => row.id,
  loading: isLoading,
});
```

### 4. The TopActions component automatically shows the column button

```typescript
<WarehousesTable.TopActions state={state} />
```

## Complete Example

```typescript
import { HeadlessTableLayout } from "@/components/headless/table";

const WarehousesTable = HeadlessTableLayout<WarehouseRow>("warehouses");

export function WarehousesTableV2() {
  // 1. Table params
  const params = WarehousesTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  // 2. Define columns
  const columns = [
    {
      key: "id",
      name: "ID",
      sortable: true,
      render: (row) => row.id,
    },
    {
      key: "name",
      name: "Name",
      sortable: true,
      render: (row) => row.name,
    },
    {
      key: "location",
      name: "Location",
      sortable: true,
      render: (row) => row.location,
    },
  ];

  // 3. Column visibility hook
  const columnVisibility = WarehousesTable.useColumnVisibility(columns);

  // 4. Fetch data
  const { data, isLoading } = useQuery({
    queryKey: ["warehouses", params.page, params.limit],
    queryFn: () => fetchWarehouses(params),
  });

  // 5. Table state with column visibility
  const state = WarehousesTable.useTableState({
    data: data?.data || [],
    columns,
    totalPages: data?.totalPages || 0,
    totalItems: data?.totalItems || 0,
    params,
    selectable: true,
    searchable: true,
    columnVisibility, // Include column visibility
    getRowId: (row) => row.id,
    loading: isLoading,
  });

  return (
    <WarehousesTable>
      <WarehousesTable.TopActions state={state} />
      <WarehousesTable.Table state={state} />
      <WarehousesTable.Pagination state={state} />
    </WarehousesTable>
  );
}
```

## How It Works

1. **localStorage Key**: `table-{prefix}-column-visibility`
2. **Default State**: All columns visible by default
3. **Button Visibility**: Column button only appears when `columnVisibility` is provided to state
4. **Visual Indicator**: Shows `(visible/total)` when columns are hidden
5. **Dialog**: Opens when clicking the "Columns" button with checkboxes for each column

## API Reference

### useColumnVisibility Hook

Returns an object with:

```typescript
{
  columnVisibility: Record<string, boolean>;
  toggleColumn: (columnKey: string) => void;
  showAllColumns: () => void;
  hideAllColumns: () => void;
  resetColumnVisibility: () => void;
  visibleColumns: ColumnDef<TRow>[];
  visibleCount: number;
  totalCount: number;
  hasHiddenColumns: boolean;
}
```

### State Access

Access column visibility from state:

```typescript
state.columnVisibility?.visibleColumns; // Array of visible columns
state.columnVisibility?.hasHiddenColumns; // Boolean
state.columnVisibility?.visibleCount; // Number of visible columns
```

## Notes

- Column visibility is **only available** when the table has a unique prefix
- Without a prefix, the feature is disabled and the button won't appear
- State is persisted per-table based on the prefix
- The table automatically renders only visible columns
