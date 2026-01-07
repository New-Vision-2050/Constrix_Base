# Headless Table Component with MUI Design

A fully type-safe table compound component built with Material-UI, providing beautiful design with flexible customization options.

## Features

- ✅ **Type-safe**: Full TypeScript support with generic row types
- ✅ **Compound Component Pattern**: Use together or individually
- ✅ **Material-UI Design**: Beautiful, modern UI with MUI components
- ✅ **Sorting Support**: Optional controlled sorting with TableSortLabel
- ✅ **Skeleton Loading**: Customizable skeleton loaders with configurable row count
- ✅ **Row Selection**: Built-in checkbox selection with select all functionality
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

#### Option A: With TableLayout (Full Compound Component)

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

#### Option B: Standalone Table

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

### Example 7: Full Featured Table

```typescript
const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
const [sortBy, setSortBy] = useState<string>("name");
const [sort, setSort] = useState<"asc" | "desc">("asc");

<UserTable.Table
  columns={columns}
  data={sortedUsers}
  sortBy={sortBy}
  sort={sort}
  handleSort={handleSort}
  loading={isLoading}
  loadingOptions={{ rows: 5 }}
  filtered={hasFilters}
  selectable={{
    selectedRows: selectedUsers,
    onSelectionChange: setSelectedUsers,
    getRowId: (user) => user.id.toString(),
  }}
/>;
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
│   └── table-layout/
│       ├── index.tsx          # Layout wrapper component
│       └── types.ts           # TableLayoutProps
├── index.tsx                  # Main entry point
├── example.tsx                # Usage examples
└── README.md                  # Documentation
```

## Design Decisions

1. **Modular Architecture**: Components split into separate directories with co-located types
2. **Type-safe**: Generic type ensures your columns and data are always in sync
3. **Controlled Sorting**: Parent manages sorting logic and state
4. **Controlled Selection**: Parent manages selected rows state
5. **Compound Pattern**: Components work together but can be used independently
6. **Column Key**: Used for sorting identification, not data access (use in render function)
7. **Skeleton Loading**: Better UX than spinners, shows table structure while loading

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

- [ ] Pagination component
- [x] Row selection with checkboxes
- [x] Skeleton loading states
- [ ] Column resizing
- [ ] Column reordering
- [ ] Customizable empty/loading states
- [ ] Sticky headers
- [ ] Virtual scrolling for large datasets
- [ ] Row actions menu
- [ ] Bulk actions for selected rows

## See Also

- `example.tsx` - Comprehensive usage examples
- `index.tsx` - Main entry point
- `components/table-component/` - Table rendering logic
- `components/table-layout/` - Layout wrapper component
