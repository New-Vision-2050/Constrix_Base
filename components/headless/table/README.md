# Headless Table Component with MUI Design

A fully type-safe table compound component built with Material-UI, providing beautiful design with flexible customization options.

## Features

- ✅ **Type-safe**: Full TypeScript support with generic row types
- ✅ **Centralized State Management**: `useState` hook for managing all table state
- ✅ **Compound Component Pattern**: Use together or individually
- ✅ **Material-UI Design**: Beautiful, modern UI with MUI components
- ✅ **Sorting Support**: Optional controlled sorting with TableSortLabel
- ✅ **Skeleton Loading**: Customizable skeleton loaders with configurable row count
- ✅ **Row Selection**: Built-in checkbox selection with select all functionality
- ✅ **Built-in Pagination**: Pagination component with page size controls
- ✅ **Bulk Actions**: TopActions component for export, delete, and custom actions
- ✅ **Empty States**: Beautiful empty state designs with icons
- ✅ **Flexible Column Definitions**: Custom render functions with full access to row data
- ✅ **Modular Architecture**: Components organized in separate directories
- ✅ **Responsive**: Works great on all screen sizes
- ✅ **Accessible**: Built-in ARIA support from MUI components

## Basic Usage

### 1. Create a typed table instance

```typescript
import HeadlessTableLayout from "@/components/headless/table";

type User = {
  id: number;
  name: string;
  email: string;
};

const UserTable = HeadlessTableLayout<User>();
```

### 2. Define your columns

```typescript
const columns = [
  {
    key: "id",
    name: "ID",
    sortable: true,
    render: (row: User) => <span>#{row.id}</span>,
  },
  {
    key: "name",
    name: "Name",
    sortable: true,
    render: (row: User) => <strong>{row.name}</strong>,
  },
  {
    key: "email",
    name: "Email",
    sortable: false,
    render: (row: User) => <a href={`mailto:${row.email}`}>{row.email}</a>,
  },
];
```

### 3. Use the table

#### Option A: With State Pattern (Recommended)

```typescript
// Initialize centralized state
const state = UserTable.useState({
  data: users,
  columns,
  pagination: {
    page: 1,
    limit: 10,
    totalItems: users.length,
  },
  getRowId: (user) => user.id.toString(),
  initialSortBy: "name",
  initialSortDirection: "asc",
  loading: false,
  filtered: false,
  onExport: async (selectedRows) => {
    console.log("Exporting:", selectedRows);
  },
  onDelete: async (selectedRows) => {
    console.log("Deleting:", selectedRows);
  },
});

// Use components with state
<>
  <UserTable.TopActions state={state} />
  <UserTable.Table state={state} />
  <UserTable.Pagination state={state} />
</>;
```

#### Option B: With TableLayout (Full Compound Component)

```typescript
<UserTable
  filters={<MyFiltersComponent />}
  table={
    <UserTable.Table
      columns={columns}
      data={users}
      sortBy={sortBy}
      sort={sort}
      handleSort={handleSort}
      loading={loading}
      filtered={filtered}
    />
  }
  pagination={<MyPaginationComponent />}
/>
```

#### Option C: Standalone Table (Individual Props)

```typescript
<UserTable.Table columns={columns} data={users} />
```

## API Reference

### `HeadlessTableLayout<TRow>()`

Factory function that creates a typed table component.

**Type Parameters:**

- `TRow`: The type of your row data

**Returns:** A compound component with the following structure:

- `TableLayoutComponent`: Main wrapper component
- `TableLayoutComponent.Table`: Table component
- `TableLayoutComponent.Pagination`: Pagination component
- `TableLayoutComponent.TopActions`: Bulk actions component
- `TableLayoutComponent.useState`: State management hook

---

### `ColumnDef<TRow>`

Defines the structure of a table column.

```typescript
type ColumnDef<TRow> = {
  key: string; // Unique identifier (used for sorting)
  name: string; // Column header display name
  sortable?: boolean; // Whether column is sortable
  render: (
    row: TRow, // The row data
    index: number, // Row index
    column: ColumnDef<TRow> // Column definition itself
  ) => React.ReactNode;
};
```

---

### `TableProps<TRow>`

Props for the Table component.

```typescript
type TableProps<TRow> = {
  columns: ColumnDef<TRow>[]; // Column definitions
  data: TRow[]; // Table data
  sortBy?: string; // Key of column to sort by
  sort?: "asc" | "desc"; // Sort direction
  handleSort?: (key: string) => void; // Sort handler callback
  filtered?: boolean; // Whether filters are active
  loading?: boolean; // Loading state
  loadingOptions?: LoadingOptions; // Loading state customization
  selectable?: SelectionConfig<TRow>; // Enable row selection
};
```

**Props Details:**

- **`columns`** (required): Array of column definitions
- **`data`** (required): Array of row data
- **`sortBy`** (optional): The `key` of the column currently being sorted
- **`sort`** (optional): Sort direction ('asc' or 'desc')
- **`handleSort`** (optional): Callback triggered when a sortable column header is clicked. Receives the column's `key` as argument.
- **`filtered`** (optional): Affects empty state message
  - `false` or `undefined` + empty data → "No data"
  - `true` + empty data → "No results found"
- **`loading`** (optional): When `true`, shows skeleton loading state
- **`loadingOptions`** (optional): Customize loading state appearance
- **`selectable`** (optional): Enable row selection with checkboxes

---

### `TableStateOptions<TRow>`

Configuration options for the `useState` hook.

```typescript
type TableStateOptions<TRow> = {
  // Data (required)
  data: TRow[];
  columns: ColumnDef<TRow>[];

  // Pagination (optional)
  pagination?: {
    page?: number; // Initial page (default: 1)
    limit?: number; // Items per page (default: 10)
    totalItems?: number; // Total items (default: data.length)
  };

  // Selection (optional)
  getRowId?: (row: TRow) => string;

  // Sorting (optional)
  initialSortBy?: string;
  initialSortDirection?: "asc" | "desc";

  // States (optional)
  loading?: boolean;
  filtered?: boolean;

  // Actions (optional)
  onExport?: (selectedRows: TRow[]) => void | Promise<void>;
  onDelete?: (selectedRows: TRow[]) => void | Promise<void>;
};
```

---

### `TableState<TRow>`

The state object returned by `useState` hook.

```typescript
type TableState<TRow> = {
  // Table state
  table: {
    columns: ColumnDef<TRow>[];
    data: TRow[]; // Paginated data
    sortBy?: string;
    sortDirection?: "asc" | "desc";
    loading: boolean;
    filtered: boolean;
    handleSort: (key: string) => void;
  };

  // Pagination state
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    canNextPage: boolean;
    canPrevPage: boolean;
    paginatedData: TRow[];
  };

  // Selection state
  selection: {
    selectedRows: TRow[];
    setSelectedRows: (rows: TRow[]) => void;
    clearSelection: () => void;
    selectAll: () => void;
    hasSelection: boolean;
    selectedCount: number;
    isRowSelected: (row: TRow) => boolean;
    toggleRow: (row: TRow) => void;
  };

  // Actions
  actions: {
    onExport?: () => void | Promise<void>;
    onDelete?: () => void | Promise<void>;
    canExport: boolean;
    canDelete: boolean;
  };
};
```

---

### `LoadingOptions`

Customize the loading state appearance.

```typescript
type LoadingOptions = {
  rows?: number; // Number of skeleton rows to display (default: 5)
};
```

---

### `SelectionConfig<TRow>`

Configuration for row selection functionality.

```typescript
type SelectionConfig<TRow> = {
  selectedRows: TRow[]; // Array of selected row objects
  onSelectionChange: (selectedRows: TRow[]) => void; // Callback when selection changes
  getRowId?: (row: TRow) => string; // Function to get unique ID from row (default: uses index)
};
```

**Props Details:**

- **`selectedRows`** (required): Array of currently selected rows
- **`onSelectionChange`** (required): Callback invoked when selection changes. Receives the new array of selected rows.
- **`getRowId`** (optional): Function to extract a unique identifier from a row. If not provided, uses array index.

---

### `TableLayoutProps`

Props for the TableLayout wrapper component.

```typescript
type TableLayoutProps = {
  filters?: React.ReactNode; // Filters component/element
  table: React.ReactNode; // Table component (required)
  pagination?: React.ReactNode; // Pagination component/element
};
```

## Examples

### Example 1: Simple Table

```typescript
const UserTable = HeadlessTableLayout<User>();

const columns = [
  {
    key: "name",
    name: "Name",
    sortable: false,
    render: (row: User) => row.name,
  },
];

<UserTable.Table columns={columns} data={users} />;
```

### Example 2: With Sorting

```typescript
const [sortBy, setSortBy] = useState<string>("name");
const [sort, setSort] = useState<"asc" | "desc">("asc");

const handleSort = (key: string) => {
  if (sortBy === key) {
    setSort(sort === "asc" ? "desc" : "asc");
  } else {
    setSortBy(key);
    setSort("asc");
  }
};

// Sort your data
const sortedData = [...users].sort((a, b) => {
  // Your sorting logic here
});

<UserTable.Table
  columns={columns}
  data={sortedData}
  sortBy={sortBy}
  sort={sort}
  handleSort={handleSort}
/>;
```

### Example 3: Full Layout with All Features

```typescript
<UserTable
  filters={
    <div>
      <input placeholder="Search..." />
      <button>Filter</button>
    </div>
  }
  table={
    <UserTable.Table
      columns={columns}
      data={filteredAndSortedData}
      sortBy={sortBy}
      sort={sort}
      handleSort={handleSort}
      loading={isLoading}
      filtered={hasActiveFilters}
    />
  }
  pagination={
    <div>
      <button>Previous</button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button>Next</button>
    </div>
  }
/>
```

### Example 4: Custom Render with Index

```typescript
{
  key: 'actions',
  name: 'Actions',
  sortable: false,
  render: (row: User, index: number, column: ColumnDef<User>) => (
    <div>
      <button onClick={() => handleEdit(row)}>Edit</button>
      <button onClick={() => handleDelete(row)}>Delete</button>
      <span>Row #{index + 1}</span>
    </div>
  ),
}
```

### Example 5: With Skeleton Loading

```typescript
<UserTable.Table
  columns={columns}
  data={users}
  loading={isLoading}
  loadingOptions={{ rows: 8 }} // Show 8 skeleton rows
/>
```

### Example 6: With Row Selection

```typescript
const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

<UserTable.Table
  columns={columns}
  data={users}
  selectable={{
    selectedRows: selectedUsers,
    onSelectionChange: setSelectedUsers,
    getRowId: (user) => user.id.toString(), // Use unique ID
  }}
/>;

// Access selected rows
console.log("Selected:", selectedUsers);
```

### Example 7: Full Featured Table with State Pattern

```typescript
const state = UserTable.useState({
  data: users,
  columns,
  pagination: {
    page: 1,
    limit: 10,
    totalItems: users.length,
  },
  getRowId: (user) => user.id.toString(),
  initialSortBy: "name",
  initialSortDirection: "asc",
  loading: isLoading,
  filtered: hasFilters,
  onExport: async (selectedRows) => {
    // Export logic
    await exportToCSV(selectedRows);
  },
  onDelete: async (selectedRows) => {
    // Delete logic
    await deleteUsers(selectedRows.map((u) => u.id));
  },
});

<Box>
  <UserTable.TopActions state={state} />
  <UserTable.Table state={state} loadingOptions={{ rows: 5 }} />
  <UserTable.Pagination state={state} />
</Box>;

// Access state values
console.log("Selected:", state.selection.selectedCount);
console.log("Current page:", state.pagination.page);
```

### Example 8: Custom Actions with TopActions

```typescript
<UserTable.TopActions
  state={state}
  customActions={
    <>
      <Button onClick={() => console.log("Custom action")}>
        Custom Action
      </Button>
    </>
  }
/>
```

## States

### Loading State

When `loading={true}`, displays skeleton loaders:

- Shows configurable number of skeleton rows (default: 5)
- Skeleton cells match the column count
- Includes skeleton checkbox if `selectable` is enabled
- Uses MUI's `Skeleton` component with wave animation

### Empty States

- **No filters applied** (`filtered={false}`): "No data"
- **Filters applied** (`filtered={true}`): "No results found"

### Selection States

When `selectable` is provided:

- **Select All Checkbox**: In header, selects/deselects all rows
- **Indeterminate State**: Shows when some (but not all) rows are selected
- **Row Highlight**: Selected rows are visually highlighted
- **Disabled State**: Checkboxes disabled during loading or when no data

## Styling

This component uses **Material-UI** for beautiful, consistent design out of the box. The component leverages:

- `Table`, `TableBody`, `TableCell`, `TableContainer`, `TableHead`, `TableRow` for table structure
- `TableSortLabel` for sorting indicators
- `Checkbox` for row selection
- `Paper` for elevation and borders
- `Box`, `Typography` for layout and text
- `Skeleton` for loading states
- `InboxOutlined`, `SearchOff` icons for empty states

You can customize the styling by:

1. Using MUI's `sx` prop on wrapper components
2. Applying custom theme via MUI ThemeProvider
3. Overriding component styles globally in your theme

## Component Structure

The table component is organized into modular directories:

```
components/headless/table/
├── components/
│   ├── table-component/
│   │   ├── index.tsx          # Table rendering component
│   │   └── types.ts           # ColumnDef, TableProps, LoadingOptions, SelectionConfig
│   ├── table-layout/
│   │   ├── index.tsx          # Layout wrapper component
│   │   └── types.ts           # TableLayoutProps
│   ├── table-state/
│   │   ├── index.tsx          # State management hook
│   │   └── types.ts           # TableState, TableStateOptions
│   ├── pagination/
│   │   └── index.tsx          # Pagination component
│   └── top-actions/
│       └── index.tsx          # Bulk actions component
├── index.tsx                  # Main entry point
├── example.tsx                # Usage examples (individual props)
├── example-with-state.tsx     # Usage examples (state pattern)
└── README.md                  # Documentation
```

## State Management Pattern

The new `useState` hook provides centralized state management:

### Benefits

1. **Single Source of Truth**: All table state in one place
2. **Less Boilerplate**: No need to manage multiple useState hooks
3. **Built-in Pagination**: Automatic data slicing and page management
4. **Integrated Selection**: Selection state managed automatically
5. **Sticky Selection**: Selected rows stay visible at the top when changing pages
6. **Action Handlers**: Export/delete actions with selected rows
7. **Type-safe**: Full TypeScript support with generics

### State Structure

The state is organized into logical sections:

- **`table`**: Data, columns, sorting, loading states
- **`pagination`**: Page, limit, navigation, computed values
- **`selection`**: Selected rows, selection actions
- **`actions`**: Export, delete, and custom action handlers

### Sticky Selection Feature

When using the state pattern, selected rows remain visible at the top of the table even when navigating to different pages:

- **Selected rows from other pages** appear at the top with a blue left border
- **Current page rows** appear below the sticky rows
- **Visual distinction**: Sticky rows have a subtle background color and colored border
- **Persistent selection**: Selection is maintained across page changes, sorting, and limit changes
- **Better UX**: Users can always see what they've selected without losing context

### Performance

The state hook uses React's `useMemo` and `useCallback` for optimal performance:

- Paginated data is memoized
- Action handlers are memoized
- No unnecessary re-renders
- Sticky selection computed efficiently

## Design Decisions

1. **Modular Architecture**: Components split into separate directories with co-located types
2. **Type-safe**: Generic type ensures your columns and data are always in sync
3. **Centralized State**: Optional useState hook for managing all table state
4. **Sticky Selection**: Selected rows stay visible at top across pagination
5. **Backward Compatible**: Old prop-based pattern still works
6. **Controlled Sorting**: Parent manages sorting logic and state
7. **Controlled Selection**: Parent manages selected rows state
8. **Compound Pattern**: Components work together but can be used independently
9. **Column Key**: Used for sorting identification, not data access (use in render function)
10. **Skeleton Loading**: Better UX than spinners, shows table structure while loading

## TypeScript Tips

```typescript
// ✅ Good: Full type safety
const UserTable = HeadlessTableLayout<User>();

// ✅ Good: Type inference works
const columns: ColumnDef<User>[] = [...];

// ✅ Good: Render function is fully typed
render: (row: User, index: number, column: ColumnDef<User>) => {
  return <div>{row.name}</div>; // row.name is autocompleted!
}
```

## Future Enhancements

- [x] Pagination component
- [x] Row selection with checkboxes
- [x] Skeleton loading states
- [x] Centralized state management
- [x] Bulk actions (export, delete)
- [ ] Column resizing
- [ ] Column reordering
- [ ] Customizable empty/loading states
- [ ] Sticky headers
- [ ] Virtual scrolling for large datasets
- [ ] Row actions menu
- [ ] Server-side pagination support
- [ ] Advanced filtering UI

## See Also

- `example.tsx` - Usage examples with individual props
- `example-with-state.tsx` - Usage examples with state pattern (recommended)
- `index.tsx` - Main entry point
- `components/table-component/` - Table rendering logic
- `components/table-layout/` - Layout wrapper component
- `components/table-state/` - State management hook
- `components/pagination/` - Pagination component
- `components/top-actions/` - Bulk actions component
