# Table Hooks

This directory contains hooks for working with the table module.

## useTableReload

The `useTableReload` hook provides a simple way to reload table data after form submissions or other actions that modify data.

### Usage

```tsx
import { useTableReload } from '@/modules/table';

function MyComponent() {
  const { reloadTable } = useTableReload();
  
  // Use the reloadTable function in callbacks, event handlers, etc.
  const handleFormSuccess = () => {
    // After a successful form submission, reload the table
    reloadTable();
  };
  
  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
}
```

### Integration with Form Builder

You can integrate the table reload functionality with the form builder module in two ways:

#### Method 1: Manual Integration

```tsx
import { SheetFormBuilder, useSheetForm, FormConfig } from '@/modules/form-builder';
import { TableBuilder, useTableReload, TableConfig } from '@/modules/table';

function FormAndTablePage() {
  // Get the table reload function
  const { reloadTable } = useTableReload();

  // Initialize the form with the reload function in the onSuccess callback
  const formHook = useSheetForm({
    config: yourFormConfig,
    onSuccess: () => {
      // Reload the table after successful form submission
      reloadTable();
    },
  });

  return (
    <div>
      {/* Form component */}
      <SheetFormBuilder
        config={yourFormConfig}
        onSuccess={() => reloadTable()}
      />
      
      {/* Table component */}
      <TableBuilder config={yourTableConfig} />
    </div>
  );
}
```

#### Method 2: Automatic Integration (Recommended)

For a more seamless integration, you can use the `useSheetFormWithTableReload` hook which automatically reloads the table after a successful form submission:

```tsx
import { SheetFormBuilder, useSheetFormWithTableReload, FormConfig } from '@/modules/form-builder';
import { TableBuilder, TableConfig } from '@/modules/table';

function FormAndTablePage() {
  // Initialize the form with automatic table reload
  const formHook = useSheetFormWithTableReload({
    config: yourFormConfig,
    // The table will automatically reload after successful form submission
    // No need to manually call reloadTable in onSuccess
  });

  return (
    <div>
      {/* Form component */}
      <SheetFormBuilder
        config={yourFormConfig}
      />
      
      {/* Table component */}
      <TableBuilder config={yourTableConfig} />
    </div>
  );
}
```

### How It Works

The `useTableReload` hook works by temporarily setting the table's loading state to `true`, which triggers the table's data fetching mechanism. This ensures that the table displays the most up-to-date data after a form submission or other data-modifying action.

The `useSheetFormWithTableReload` hook combines the functionality of `useSheetForm` and `useTableReload` to provide a seamless integration between forms and tables. It automatically reloads the table after a successful form submission, eliminating the need to manually call `reloadTable` in the `onSuccess` callback.