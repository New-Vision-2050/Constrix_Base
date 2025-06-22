# Codebase Documentation for LLMs and AI Code Editors

This document provides a comprehensive overview of the key modules in this codebase, designed to be easily understood by LLMs and AI code editors. It covers the `table` module for generating data tables, the `form-builder` module for creating forms, and the approach to generating widgets.

## Table of Contents

1. [Table Module](#table-module)
2. [Form Builder Module](#form-builder-module)
3. [Widget Generation](#widget-generation)
4. [Shared Components](#shared-components)
5. [Integration Patterns](#integration-patterns)

## Table Module

The `table` module provides a powerful and flexible solution for creating data tables in this React application. It is built around a `TableBuilder` component that uses a JSON-based configuration to define the table's structure, behavior, and appearance.

### Key Components

- **`TableBuilder`**: The primary component for rendering tables with all features enabled
- **`ConfigurableTable`**: A more flexible version that allows for more customization

### Key Hooks

- **`useTableData`**: Core hook that manages table data, state, and actions
- **`useTableReload`**: Hook for reloading table data after form submissions or other actions
- **`useResetTableOnRouteChange`**: Automatically resets table state when the route changes
- **`useTableInstance`**: Access table instance for advanced operations like row selection

### Key Features

- **JSON-Based Configuration**: Tables are defined using a `TableConfig` object, making it easy to create and manage complex tables with minimal code
- **Data Fetching**: The module handles data fetching from a specified API endpoint, including support for pagination, sorting, and searching
- **Customizable Columns**: Columns can be easily configured with options for sorting, searching, visibility, and custom rendering
- **Row Selection & Export**: Built-in row selection with export functionality (CSV/JSON)
- **Column Visibility Control**: Users can toggle column visibility and set default visible columns
- **Advanced Search**: Global search and per-column search capabilities
- **Optimized Performance**: Debounced requests, fetch tracking, and duplicate prevention

### Configuration Structure

```typescript
interface TableConfig {
  url: string;                          // API endpoint to fetch data from
  tableId?: string;                     // Unique identifier for the table instance
  apiParams?: Record<string, string>;   // Additional API parameters
  columns?: ColumnConfig[];             // Column configurations
  availableColumnKeys?: string[];       // Filter available columns
  defaultVisibleColumnKeys?: string[];  // Set default visible columns
  defaultItemsPerPage?: number;         // Default pagination size
  defaultSortColumn?: string;           // Default sort column
  defaultSortDirection?: "asc" | "desc" | null;
  enableSorting?: boolean;              // Enable/disable sorting
  enablePagination?: boolean;           // Enable/disable pagination
  enableSearch?: boolean;               // Enable/disable global search
  enableRowSelection?: boolean;         // Enable/disable row selection
  enableColumnSearch?: boolean;         // Enable/disable per-column search
  dataMapper?: (data: any) => any[];    // Transform API response data
  searchFields?: string[];              // Fields to search in
  deleteConfirmMessage?: string;        // Custom delete confirmation message
}

interface ColumnConfig {
  key: string;                          // Column data key
  title: string;                        // Column header title
  sortable?: boolean;                   // Enable sorting for this column
  searchable?: boolean;                 // Include in global search
  visible?: boolean;                    // Default visibility
  width?: string;                       // Column width
  render?: (value: any, row: any) => React.ReactNode; // Custom cell renderer
}
```

### Usage Examples

#### Basic Table

```tsx
import { TableBuilder } from '@/modules/table';

const basicTableConfig = {
  url: '/api/users',
  columns: [
    { key: 'id', title: 'ID', sortable: true },
    { key: 'name', title: 'Name', sortable: true, searchable: true },
    { key: 'email', title: 'Email', searchable: true },
    { key: 'status', title: 'Status', render: (value) => <Badge>{value}</Badge> },
  ],
  defaultItemsPerPage: 10,
  enableSorting: true,
  enableSearch: true,
  enableRowSelection: true,
};

const UsersTable = () => {
  return <TableBuilder config={basicTableConfig} tableId="users-table" />;
};
```

#### Advanced Table with Column Control

```tsx
const advancedTableConfig = {
  url: '/api/employees',
  availableColumnKeys: ['id', 'name', 'email', 'department', 'salary', 'status'],
  defaultVisibleColumnKeys: ['name', 'email', 'department', 'status'],
  columns: [
    { key: 'id', title: 'Employee ID', sortable: true },
    { key: 'name', title: 'Full Name', sortable: true, searchable: true },
    { key: 'email', title: 'Email', searchable: true },
    { key: 'department', title: 'Department', sortable: true },
    { key: 'salary', title: 'Salary', sortable: true },
    { key: 'status', title: 'Status', sortable: true },
  ],
  enableColumnSearch: true,
  searchFields: ['name', 'email', 'department'],
  defaultSortColumn: 'name',
  defaultSortDirection: 'asc',
};
```

## Form Builder Module

The `form-builder` module simplifies the process of creating forms by using a declarative, JSON-based approach. It supports a wide range of field types, validation rules, and advanced features like multi-step forms and conditional logic.

### Key Components

- **`SheetFormBuilder`**: Sheet-based form component (dialog/modal)
- **`ReactHookSheetFormBuilder`**: Sheet-based form using React Hook Form (Note: Available but not recommended for general use)

### Key Hooks

- **`useSheetForm`**: Manages sheet form state and actions
- **`useFormStore`** & **`useFormInstance`**: Form state management
- **`useFormReload`** & **`useFormReloadWithDelay`**: Form data reloading
- **`useFormWithTableReload`**: Integration with table reloading
- **`useFormData`**: Form data management
- **`useFormEdit`**: Edit mode functionality

### Supported Field Types

The form builder supports 18+ field types:

- **Text Fields**: `text`, `textarea`, `email`, `password`, `phone`
- **Selection Fields**: `select`, `multiSelect`, `radio`, `checkbox`, `checkboxGroup`
- **Date/Time**: `date` (with Hijri calendar support)
- **File Handling**: `image`, `file` (with upload capabilities)
- **Advanced**: `search` (with autocomplete), `dynamicRows`, `hiddenObject`
- **Numeric**: `number`

### Field Configuration Structure

```typescript
interface FieldConfig {
  type: "text" | "textarea" | "email" | "password" | "number" | "date" | 
        "checkbox" | "checkboxGroup" | "radio" | "select" | "multiSelect" | 
        "phone" | "search" | "image" | "file" | "dynamicRows" | "hiddenObject";
  name: string;                         // Field identifier
  label: string;                        // Field label
  placeholder?: string;                 // Placeholder text
  required?: boolean;                   // Required field
  disabled?: boolean;                   // Disabled state
  readOnly?: boolean;                   // Read-only state
  hidden?: boolean;                     // Hidden field
  validation?: ValidationRule[];        // Validation rules
  condition?: (values: Record<string, any>) => boolean; // Conditional display
  onChange?: (newValue: any, values: Record<string, any>) => void;
  
  // Field-specific configurations
  options?: DropdownOption[];           // Static options for select/radio
  dynamicOptions?: DynamicDropdownConfig; // Dynamic options from API
  imageConfig?: ImageUploadConfig;      // Image upload settings
  fileConfig?: FileUploadConfig;        // File upload settings
  dynamicRowOptions?: DynamicRowOptions; // Dynamic rows configuration
  
  // Layout and styling
  className?: string;                   // Custom CSS class
  width?: string;                       // Field width
  gridArea?: number;                    // Grid area span
}
```

### Validation System

```typescript
interface ValidationRule {
  type: "required" | "min" | "max" | "minLength" | "maxLength" | 
        "pattern" | "email" | "phone" | "url" | "custom" | "apiValidation";
  value?: any;                          // Validation value (for min/max/etc.)
  message: string | React.ReactNode;    // Error message
  validator?: (value: any, formValues?: Record<string, any>) => boolean;
  apiConfig?: {                         // API validation configuration
    url: string;
    method?: "GET" | "POST" | "PUT";
    debounceMs?: number;
    paramName?: string;
    headers?: Record<string, string>;
    successCondition?: (response: any) => boolean;
  };
}
```

### Form Configuration Structure

```typescript
interface FormConfig {
  formId?: string;                      // Unique form identifier
  title?: string;                       // Form title
  description?: string;                 // Form description
  sections: FormSection[];              // Form sections
  
  // Button configuration
  showReset?: boolean;                  // Show reset button
  showCancelButton?: boolean;           // Show cancel button
  submitButtonText?: string;            // Submit button text
  
  // Form modes
  wizard?: boolean;                     // Enable wizard mode
  accordion?: boolean;                  // Enable accordion mode
  wizardOptions?: WizardOptions;        // Wizard configuration
  
  // API integration
  apiUrl?: string;                      // Submit endpoint
  apiMethod?: "POST" | "PUT" | "PATCH" | "DELETE";
  apiHeaders?: Record<string, string>;  // Custom headers
  
  // Edit mode
  isEditMode?: boolean;                 // Edit mode flag
  editValues?: Record<string, any>;     // Edit values
  editApiUrl?: string;                  // Edit endpoint
  editApiMethod?: "POST" | "PUT" | "PATCH";
  
  // Event handlers
  onSubmit?: (values: Record<string, any>) => Promise<FormSubmitResult>;
  onSuccess?: (values: Record<string, any>, result: FormSubmitResult) => void;
  onError?: (values: Record<string, any>, error: FormError) => void;
  onCancel?: () => void;
}
```

### Usage Examples

#### Basic Form

```tsx
import { SheetFormBuilder, FormConfig } from '@/modules/form-builder';

const userFormConfig: FormConfig = {
  title: 'Add User',
  sections: [
    {
      title: 'Personal Information',
      fields: [
        {
          type: 'text',
          name: 'firstName',
          label: 'First Name',
          required: true,
          validation: [{ type: 'required', message: 'First name is required' }],
        },
        {
          type: 'text',
          name: 'lastName',
          label: 'Last Name',
          required: true,
        },
        {
          type: 'email',
          name: 'email',
          label: 'Email Address',
          required: true,
          validation: [
            { type: 'required', message: 'Email is required' },
            { type: 'email', message: 'Please enter a valid email' },
          ],
        },
      ],
    },
  ],
  apiUrl: '/api/users',
  apiMethod: 'POST',
};

const AddUserForm = () => {
  return (
    <SheetFormBuilder
      config={userFormConfig}
      trigger={<Button>Add User</Button>}
      onSuccess={() => console.log('User added successfully')}
    />
  );
};
```

#### Multi-Step Wizard Form

```tsx
const wizardFormConfig: FormConfig = {
  title: 'Employee Registration',
  wizard: true,
  wizardOptions: {
    showStepIndicator: true,
    showStepTitles: true,
    validateStepBeforeNext: true,
    nextButtonText: 'Continue',
    prevButtonText: 'Back',
    finishButtonText: 'Complete Registration',
  },
  sections: [
    {
      title: 'Step 1: Personal Details',
      fields: [
        { type: 'text', name: 'firstName', label: 'First Name', required: true },
        { type: 'text', name: 'lastName', label: 'Last Name', required: true },
        { type: 'date', name: 'birthDate', label: 'Date of Birth' },
      ],
    },
    {
      title: 'Step 2: Contact Information',
      fields: [
        { type: 'email', name: 'email', label: 'Email', required: true },
        { type: 'phone', name: 'phone', label: 'Phone Number' },
        { type: 'textarea', name: 'address', label: 'Address' },
      ],
    },
    {
      title: 'Step 3: Employment Details',
      fields: [
        {
          type: 'select',
          name: 'department',
          label: 'Department',
          dynamicOptions: {
            url: '/api/departments',
            valueField: 'id',
            labelField: 'name',
          },
        },
        { type: 'date', name: 'startDate', label: 'Start Date', required: true },
      ],
    },
  ],
};
```

#### Dynamic and Conditional Fields

```tsx
const dynamicFormConfig: FormConfig = {
  title: 'Product Order',
  sections: [
    {
      fields: [
        {
          type: 'select',
          name: 'category',
          label: 'Product Category',
          options: [
            { value: 'electronics', label: 'Electronics' },
            { value: 'clothing', label: 'Clothing' },
            { value: 'books', label: 'Books' },
          ],
        },
        {
          type: 'select',
          name: 'product',
          label: 'Product',
          condition: (values) => !!values.category,
          dynamicOptions: {
            url: '/api/products',
            valueField: 'id',
            labelField: 'name',
            dependsOn: 'category',
            filterParam: 'category',
          },
        },
        {
          type: 'checkbox',
          name: 'hasDiscount',
          label: 'Apply Discount Code',
        },
        {
          type: 'text',
          name: 'discountCode',
          label: 'Discount Code',
          condition: (values) => values.hasDiscount,
          validation: [
            {
              type: 'apiValidation',
              message: 'Invalid discount code',
              apiConfig: {
                url: '/api/validate-discount',
                method: 'POST',
                paramName: 'code',
                debounceMs: 500,
              },
            },
          ],
        },
      ],
    },
  ],
};
```

## Widget Generation

Unlike the `table` and `form-builder` modules, this codebase does not have a centralized "widget builder" module that uses a JSON-based configuration. Instead, widgets are implemented as individual, custom components within their respective modules.

### Widget Architecture

- **Data-Driven**: Widgets fetch their content from specific API endpoints (e.g., `/api/companies/widget`, `/api/users/widgets`)
- **Custom Components**: Each widget is a custom React component tailored to its specific purpose
- **Module-Specific**: Widgets are located within the modules where they are used
- **Reusable Patterns**: Common widget patterns are implemented in shared components

### Shared Widget Components

#### StatisticsRow Component

A reusable component for displaying statistics widgets:

```tsx
// Located at: /components/shared/layout/statistics-row.tsx
interface Config {
  url: string;                          // API endpoint for widget data
  icons: React.ReactNode[];             // Icons for each statistic
}

const StatisticsRow = ({ config }: { config: Config }) => {
  // Fetches data from the provided URL
  // Displays statistics in a responsive grid layout
  // Includes loading states and error handling
};
```

### Widget Implementation Patterns

#### 1. Profile Widgets (User Profile Module)

```typescript
// Types: /modules/user-profile/types/profile-widgets.ts
export type ProfileWidgetData = {
  contract: ProfileWidgetContract;
};

// Hook: /modules/user-profile/hooks/useProfileWidgetData.tsx
export default function useProfileWidgetData(id: string) {
  return useQuery({
    queryKey: [`user-profile-widget-data`, id],
    queryFn: () => getProfileWidgetsData(id),
  });
}

// API: /modules/user-profile/api/fetch-widget-data.ts
export default async function getProfileWidgetsData(userId: string) {
  return apiClient.get(`/company-users/widget/user/${userId}`);
}
```

#### 2. Organizational Structure Widgets

```typescript
// API: /modules/organizational-structure/api/fetch-org-stucture-widget.ts
export type OrgWidgetsResponse = {
  users: { total_users: number; users_with_hierarchy: number; };
  branches: { total_count: number; used_count: number; };
  departments: { total_count: number; used_count: number; };
  management: { total_count: number; used_count: number; };
};

// Hook: /modules/organizational-structure/hooks/useOrgWidgetsData.tsx
export default function useOrgWidgetsData() {
  return useQuery({
    queryKey: [`org-widget-data`],
    queryFn: fetchOrgWidgetsData,
  });
}
```

### Creating Custom Widgets

To create a new widget:

1. **Define the data structure** and API endpoint
2. **Create a custom hook** for data fetching using React Query
3. **Implement the widget component** with proper loading and error states
4. **Add the widget to the appropriate module**

Example widget structure:

```tsx
// 1. Define types
interface MyWidgetData {
  title: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
}

// 2. Create hook
const useMyWidgetData = () => {
  return useQuery({
    queryKey: ['my-widget'],
    queryFn: () => apiClient.get('/api/my-widget'),
  });
};

// 3. Implement component
const MyWidget = () => {
  const { data, isLoading, error } = useMyWidgetData();
  
  if (isLoading) return <WidgetSkeleton />;
  if (error) return <WidgetError />;
  
  return (
    <div className="widget-container">
      <h3>{data.title}</h3>
      <div className="widget-value">{data.value}</div>
      <TrendIndicator trend={data.trend} />
    </div>
  );
};
```

## Shared Components

The codebase includes shared components that provide consistent UI patterns:

### UI Components (`/components/ui/`)
- Form controls (Button, Input, Select, etc.)
- Layout components (Card, Dialog, Sheet, etc.)
- Data display (Table, Badge, Avatar, etc.)

### Shared Components (`/components/shared/`)
- Layout components (StatisticsRow, etc.)
- Common functionality components
- Reusable business logic components

## Integration Patterns

### Table + Form Integration

The table and form modules are designed to work seamlessly together:

```tsx
import { TableBuilder, useTableReload } from '@/modules/table';
import { SheetFormBuilder } from '@/modules/form-builder';

const UsersManagement = () => {
  const { reloadTable } = useTableReload('users-table');

  return (
    <div>
      <div className="mb-4">
        <SheetFormBuilder
          config={userFormConfig}
          trigger={<Button>Add User</Button>}
          onSuccess={() => reloadTable()} // Reload table after form submission
        />
      </div>
      
      <TableBuilder
        config={usersTableConfig}
        tableId="users-table"
      />
    </div>
  );
};
```

### Automatic Integration with useFormWithTableReload

```tsx
import { useFormWithTableReload } from '@/modules/form-builder';

const AutoIntegratedForm = () => {
  const formHook = useFormWithTableReload({
    config: formConfig,
    tableId: 'users-table', // Automatically reloads this table
  });

  return <SheetFormBuilder config={formConfig} />;
};
```

This architecture provides a powerful, flexible, and maintainable approach to building data-driven applications with consistent patterns for tables, forms, and widgets.
