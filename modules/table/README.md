# Table Builder

A flexible and powerful table component for React applications with advanced features like sorting, pagination, searching, and column customization.

## Overview

The Table Builder module provides a comprehensive solution for displaying and interacting with tabular data in React applications. It offers a wide range of features including sorting, pagination, searching, column visibility control, and more, all with a clean and modern UI.

## Main Components

### TableBuilder

The primary component for rendering tables with all features enabled.

```tsx
import { TableBuilder } from '@/modules/table';

const MyTable = () => {
  return (
    <TableBuilder
      url="/api/data"
      config={tableConfig}
      tableId="my-unique-table-id"
    />
  );
};
```

#### Props

- `url`: API endpoint to fetch data from
- `config`: Table configuration object
- `onReset`: Optional callback when the table is reset
- `searchBarActions`: Optional custom actions to display in the search bar
- `tableId`: Optional unique identifier for this table instance

### ConfigurableTable

A more flexible version of TableBuilder that allows for more customization.

```tsx
import { ConfigurableTable } from '@/modules/table';

const MyCustomTable = () => {
  return (
    <ConfigurableTable
      url="/api/data"
      columns={columns}
      defaultItemsPerPage={20}
    />
  );
};
```

## Configuration

Tables are configured using a `TableConfig` object:

```tsx
import { TableConfig } from '@/modules/table';

const tableConfig: TableConfig = {
  url: '/api/users',
  columns: [
    {
      key: 'id',
      title: 'ID',
      sortable: true,
      searchable: false,
      visible: true,
    },
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      searchable: true,
      visible: true,
    },
    {
      key: 'email',
      title: 'Email',
      sortable: true,
      searchable: true,
      visible: true,
    },
  ],
  defaultItemsPerPage: 10,
  defaultSortColumn: 'name',
  defaultSortDirection: 'asc',
  enableSorting: true,
  enablePagination: true,
  enableSearch: true,
  enableColumnSearch: true,
  searchFields: ['name', 'email'],
  searchParamName: 'q',
  searchFieldParamName: 'searchField',
  allowSearchFieldSelection: true,
};
```

### TableConfig Properties

| Property | Type | Description |
|----------|------|-------------|
| `url` | `string` | API endpoint to fetch data from |
| `columns` | `ColumnConfig[]` | Array of column configurations |
| `defaultItemsPerPage` | `number` | Default number of items per page |
| `defaultSortColumn` | `string` | Default column to sort by |
| `defaultSortDirection` | `'asc' \| 'desc' \| null` | Default sort direction |
| `defaultSearchQuery` | `string` | Default search query |
| `enableSorting` | `boolean` | Whether to enable sorting |
| `enablePagination` | `boolean` | Whether to enable pagination |
| `enableSearch` | `boolean` | Whether to enable search |
| `enableColumnSearch` | `boolean` | Whether to enable per-column search |
| `dataMapper` | `(data: any) => any[]` | Function to transform API response data |
| `searchFields` | `string[]` | Fields to search in |
| `searchParamName` | `string` | Parameter name for search query |
| `searchFieldParamName` | `string` | Parameter name for search field |
| `allowSearchFieldSelection` | `boolean` | Whether to allow selecting search fields |
| `columnSearchConfig` | `ColumnSearchConfig` | Configuration for column search |
| `allSearchedFields` | `any[]` | Additional search fields for advanced filtering |

### Column Configuration

Columns are configured using a `ColumnConfig` object:

```tsx
interface ColumnConfig {
  key: string;
  title: string;
  sortable?: boolean;
  searchable?: boolean;
  visible?: boolean;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
}
```

## Hooks

### useTableData

The core hook that manages table data, state, and actions.

```tsx
import { useTableData } from '@/modules/table';

const MyComponent = () => {
  const {
    data,
    columns,
    loading,
    error,
    sortState,
    searchQuery,
    currentPage,
    totalPages,
    handleSort,
    handleSearch,
    handlePageChange,
    resetTable,
  } = useTableData('/api/data', columns, 10);
  
  // Use these values and functions to build a custom table UI
};
```

### useTableReload

A hook for reloading table data after form submissions or other actions. This hook uses the `_forceRefetch` mechanism to ensure the table data is refreshed even if the query parameters haven't changed.

```tsx
import { useTableReload } from '@/modules/table';

const MyComponent = () => {
  const { reloadTable } = useTableReload('my-table-id');
  
  const handleFormSuccess = () => {
    // After a successful form submission, reload the table
    // This will force a refetch even if the query parameters haven't changed
    reloadTable();
  };
};
```

The `reloadTable` function works by setting a unique timestamp in the `_forceRefetch` property of the table state, which triggers a new fetch operation regardless of whether other parameters have changed. This is particularly useful after operations like:

- Form submissions that create or update data
- Delete operations
- Import/export operations
- Any action that modifies the data on the server

The hook automatically handles setting the loading state during the reload and clearing it after completion.

### useResetTableOnRouteChange

A hook that automatically resets table state when the route changes.

```tsx
import { useResetTableOnRouteChange } from '@/modules/table';

const MyTable = () => {
  // Reset table state when the route changes
  useResetTableOnRouteChange('my-table-id');
  
  // Rest of your component
};
```

## Features

### Sorting

Tables support sorting by clicking on column headers. The sort state is managed automatically and sent to the API as query parameters.

### Pagination

Tables include pagination controls with options to change the number of items per page.

### Searching

The search bar allows users to search across all searchable columns or specific columns if configured.

### Column Search

Individual column search allows for more precise filtering of data.

### Column Visibility

Users can toggle the visibility of columns using the column visibility dropdown.

### Data Transformation

The `dataMapper` function allows you to transform API response data before it's displayed in the table.

### Error Handling

Tables display error messages when API requests fail and provide retry options.

### Loading States

Loading indicators are displayed during data fetching.

### Optimized Data Fetching

The table uses several optimization techniques to prevent unnecessary API calls:

- **Debounce mechanism**: Rapid state changes are batched together to trigger only one fetch
- **Fetch tracking**: Prevents duplicate fetches with identical parameters
- **Force refetch capability**: Allows explicit data refresh when needed (e.g., after form submissions)
- **Concurrent fetch prevention**: Ensures only one fetch operation happens at a time

## Integration with Other Components

### Integration with Form Builder

The Table Builder module can be integrated with the Form Builder module to automatically reload table data after form submissions.

#### Manual Integration

```tsx
import { SheetFormBuilder } from '@/modules/form-builder';
import { TableBuilder, useTableReload } from '@/modules/table';

function FormAndTablePage() {
  const { reloadTable } = useTableReload();

  return (
    <div>
      <SheetFormBuilder
        config={formConfig}
        onSuccess={() => reloadTable()}
      />
      
      <TableBuilder config={tableConfig} />
    </div>
  );
}
```

#### Automatic Integration

For a more seamless integration, you can use the `useFormWithTableReload` hook from the Form Builder module:

```tsx
import { SheetFormBuilder, useFormWithTableReload } from '@/modules/form-builder';
import { TableBuilder } from '@/modules/table';

function FormAndTablePage() {
  const formHook = useFormWithTableReload({
    config: formConfig,
    // The table will automatically reload after successful form submission
  });

  return (
    <div>
      <SheetFormBuilder config={formConfig} />
      <TableBuilder config={tableConfig} />
    </div>
  );
}
```

### Integration with DeleteConfirmationDialog

The Table Builder module can be integrated with the DeleteConfirmationDialog component to automatically reload table data after successful deletion operations.

```tsx
import { useTableInstance } from '@/modules/table/store/useTableStore';
import DeleteConfirmationDialog from '@/components/shared/DeleteConfirmationDialog';
import { useModal } from '@/hooks/use-modal';

const DeleteButton = ({ id }) => {
  const [isOpen, handleOpen, handleClose] = useModal();
  
  // Get the reloadTable method directly from the table instance
  const { reloadTable } = useTableInstance("my-table-id");

  return (
    <>
      <Button onClick={handleOpen}>Delete</Button>
      
      <DeleteConfirmationDialog
        deleteUrl={`/api/items/${id}`}
        onClose={handleClose}
        open={isOpen}
        onSuccess={() => {
          // Reload the table after successful deletion
          reloadTable();
        }}
      />
    </>
  );
};
```

This integration ensures that the table data is refreshed immediately after a successful deletion operation, without requiring a manual page refresh. The `reloadTable` method uses the optimized fetch mechanism to ensure only one network request is made.

## Example Usage

### Basic Table

```tsx
import { TableBuilder } from '@/modules/table';

const UsersTable = () => {
  const tableConfig = {
    url: '/api/users',
    columns: [
      { key: 'id', title: 'ID', sortable: true },
      { key: 'name', title: 'Name', sortable: true, searchable: true },
      { key: 'email', title: 'Email', sortable: true, searchable: true },
      { key: 'role', title: 'Role', sortable: true, searchable: true },
      {
        key: 'actions',
        title: 'Actions',
        render: (_, row) => (
          <div className="flex space-x-2">
            <button onClick={() => handleEdit(row.id)}>Edit</button>
            <button onClick={() => handleDelete(row.id)}>Delete</button>
          </div>
        ),
      },
    ],
  };

  return <TableBuilder config={tableConfig} />;
};
```

### Table with Custom Data Mapping

```tsx
import { TableBuilder } from '@/modules/table';

const ProductsTable = () => {
  const tableConfig = {
    url: '/api/products',
    columns: [
      { key: 'id', title: 'ID', sortable: true },
      { key: 'name', title: 'Product Name', sortable: true, searchable: true },
      { key: 'price', title: 'Price', sortable: true },
      { key: 'category', title: 'Category', sortable: true, searchable: true },
    ],
    dataMapper: (response) => {
      // Transform API response data
      return response.data.map(item => ({
        ...item,
        price: `$${item.price.toFixed(2)}`,
      }));
    },
  };

  return <TableBuilder config={tableConfig} />;
};
```

### Table with Custom Search Bar Actions

```tsx
import { TableBuilder } from '@/modules/table';
import { Button } from '@/components/ui/button';

const CustomActionsTable = () => {
  const handleExport = () => {
    // Export table data
  };

  return (
    <TableBuilder
      url="/api/data"
      config={tableConfig}
      searchBarActions={
        <Button onClick={handleExport}>Export</Button>
      }
    />
  );
};