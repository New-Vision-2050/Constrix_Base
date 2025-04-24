# Form Builder Module

The Form Builder module is a powerful and flexible system for creating forms in React applications. It provides a declarative approach to form creation, with support for various field types, validation, and advanced features like multi-step forms and edit mode.

## Table of Contents

1. [Key Features](#key-features)
2. [Form Builder Components](#form-builder-components)
3. [Basic Usage](#basic-usage)
   - [Standard Form](#standard-form)
   - [Sheet Form](#sheet-form)
   - [React Hook Form Integration](#react-hook-form-integration)
4. [Form Configuration](#form-configuration)
   - [Form Config Structure](#form-config-structure)
   - [Field Types](#field-types)
   - [Validation](#validation)
5. [Advanced Features](#advanced-features)
   - [Multi-step Forms (Wizard)](#multi-step-forms-wizard)
   - [Accordion Forms](#accordion-forms)
   - [Dynamic Fields](#dynamic-fields)
   - [Conditional Fields](#conditional-fields)
   - [API Integration](#api-integration)
   - [Edit Mode](#edit-mode)
6. [Field Types Reference](#field-types-reference)
7. [Examples](#examples)

## Key Features

- **Declarative Configuration**: Define forms using a simple configuration object
- **Multiple Form Modes**: Standard, Wizard (multi-step), and Accordion modes
- **Comprehensive Validation**: Client-side and server-side validation support
- **Dynamic Fields**: Conditional fields, dynamic dropdowns, and more
- **Responsive Layout**: Configurable grid layouts for form sections
- **Accessibility**: Built with accessibility in mind
- **Internationalization**: Support for RTL languages and translations
- **React Hook Form Integration**: Optional integration with React Hook Form for enhanced performance
- **Edit Mode**: Load and edit existing data from direct values or API endpoints
- **Image Upload**: Support for image upload fields with preview and validation

## Form Builder Components

The module provides several components for different use cases:

### Standard Form Components

- `FormBuilder`: Basic form component
- `ReactHookFormBuilder`: Form component using React Hook Form

### Sheet Form Components (Dialog/Modal)

- `SheetFormBuilder`: Sheet-based form component
- `ReactHookSheetFormBuilder`: Sheet-based form component using React Hook Form

## Basic Usage

### Standard Form

```tsx
import { FormBuilder, FormConfig } from "@/modules/form-builder";

const formConfig: FormConfig = {
  title: "Contact Form",
  sections: [
    {
      title: "Personal Information",
      fields: [
        {
          type: "text",
          name: "name",
          label: "Full Name",
          required: true,
          validation: [
            {
              type: "required",
              message: "Name is required",
            },
          ],
        },
        {
          type: "email",
          name: "email",
          label: "Email Address",
          required: true,
          validation: [
            {
              type: "required",
              message: "Email is required",
            },
            {
              type: "email",
              message: "Please enter a valid email",
            },
          ],
        },
      ],
    },
  ],
  onSubmit: async (values) => {
    console.log("Form values:", values);
    return { success: true, message: "Form submitted successfully" };
  },
};

export default function MyForm() {
  return (
    <FormBuilder
      config={formConfig}
      onSuccess={(values) => console.log("Success:", values)}
    />
  );
}
```

### Sheet Form

Sheet forms open in a dialog/modal when triggered:

```tsx
import { SheetFormBuilder, FormConfig } from "@/modules/form-builder";
import { Button } from "@/components/ui/button";

const formConfig: FormConfig = {
  // Form configuration...
};

export default function MySheetForm() {
  return (
    <SheetFormBuilder
      config={formConfig}
      trigger={<Button>Open Form</Button>}
      onSuccess={(values) => console.log("Form submitted:", values)}
    />
  );
}
```

### React Hook Form Integration

For better performance and enhanced validation, use the React Hook Form integration:

```tsx
import { ReactHookFormBuilder, FormConfig } from "@/modules/form-builder";

const formConfig: FormConfig = {
  // Form configuration...
};

export default function MyReactHookForm() {
  return (
    <ReactHookFormBuilder
      config={formConfig}
      onSuccess={(values) => console.log("Form submitted:", values)}
    />
  );
}
```

The React Hook Form integration provides a complete alternative to the default form state management system while maintaining the same API and features. It leverages the popular react-hook-form library with Zod validation for improved performance and type safety.

## Form Configuration

### Form Config Structure

The form configuration object defines the structure and behavior of the form:

```typescript
interface FormConfig {
  formId?: string;                // Unique identifier for the form instance
  title?: string;                 // Form title
  description?: string;           // Form description
  className?: string;             // Custom CSS class
  sections: FormSection[];        // Form sections
  showReset?: boolean;            // Whether to show the reset button
  showCancelButton?: boolean;     // Whether to show the cancel button
  showBackButton?: boolean;       // Whether to show the back button in step-based forms
  submitButtonText?: string;      // Text for the submit button
  resetButtonText?: string;       // Text for the reset button
  cancelButtonText?: string;      // Text for the cancel button
  showSubmitLoader?: boolean;     // Whether to show a loader when submitting
  initialValues?: Record<string, any>; // Initial form values
  resetOnSuccess?: boolean;       // Whether to reset the form after successful submission
  
  // Form mode configuration
  wizard?: boolean;               // Enable wizard mode (multi-step form)
  accordion?: boolean;            // Enable accordion mode (collapsible sections with step navigation)
  wizardOptions?: WizardOptions;  // Configuration options for wizard/accordion mode
  
  // Backend API configuration
  apiUrl?: string;                // URL to submit the form data to
  apiMethod?: 'POST' | 'PUT' | 'PATCH' | 'DELETE'; // HTTP method for form submission in create mode (default: POST)
  apiHeaders?: Record<string, string>; // Custom headers for the API request
  
  // Edit mode configuration
  isEditMode?: boolean;           // Whether the form is in edit mode
  editValues?: Record<string, any>; // Values to use for editing (direct values)
  editApiUrl?: string;            // URL to fetch data for editing and for form submission in edit mode (can include :id placeholder)
  editApiMethod?: 'POST' | 'PUT' | 'PATCH'; // HTTP method for form submission in edit mode (default: PUT)
  editApiHeaders?: Record<string, string>; // Custom headers for the edit API request
  editDataPath?: string;          // Path to the data in the API response (e.g., 'data' or 'data.user')
  editDataTransformer?: (data: any) => Record<string, any>; // Function to transform API response data
  
  // Event handlers
  onSubmit?: (values: Record<string, any>) => Promise<{ success: boolean; message?: string; errors?: Record<string, string | string[]> }>;
  onSuccess?: (values: Record<string, any>, result: { success: boolean; message?: string }) => void;
  onError?: (values: Record<string, any>, error: { message?: string; errors?: Record<string, string | string[]> }) => void;
  onCancel?: () => void;
  onValidationError?: (errors: Record<string, string | React.ReactNode>) => void;
}
```

### Field Types

The form builder supports various field types:

- `text`: Standard text input
- `textarea`: Multi-line text input
- `email`: Email input with validation
- `password`: Password input
- `number`: Numeric input
- `checkbox`: Checkbox input
- `radio`: Radio button group
- `select`: Dropdown select
- `multiSelect`: Multi-select dropdown
- `date`: Date picker
- `phone`: Phone number input
- `search`: Search input with autocomplete
- `image`: Image upload field
- `dynamicRows`: Dynamic rows for repeating sections
- `hiddenObject`: Hidden field for storing complex data

### Validation

Each field can have validation rules:

```typescript
interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'url' | 'custom' | 'apiValidation';
  value?: any;
  message: string | React.ReactNode;
  validator?: (value: any, formValues?: Record<string, any>) => boolean;
  apiConfig?: {
    url: string;
    method?: 'GET' | 'POST' | 'PUT';
    debounceMs?: number;
    paramName?: string;
    headers?: Record<string, string>;
    successCondition?: (response: any) => boolean;
  };
}
```

Example field with validation:

```typescript
{
  type: "email",
  name: "email",
  label: "Email Address",
  required: true,
  validation: [
    {
      type: "required",
      message: "Email is required",
    },
    {
      type: "email",
      message: "Please enter a valid email",
    },
    {
      type: "apiValidation",
      message: "This email is already in use",
      apiConfig: {
        url: "/api/validate-email",
        method: "POST",
        debounceMs: 500,
        paramName: "email",
      },
    },
  ],
}
```

## Advanced Features

### Multi-step Forms (Wizard)

Create multi-step forms with the wizard mode:

```typescript
const wizardFormConfig: FormConfig = {
  wizard: true,
  wizardOptions: {
    showStepIndicator: true,
    showStepTitles: true,
    validateStepBeforeNext: true,
    nextButtonText: "Next",
    prevButtonText: "Back",
    finishButtonText: "Submit",
  },
  sections: [
    // Each section becomes a step
    {
      title: "Step 1: Personal Information",
      fields: [
        // Step 1 fields...
      ],
    },
    {
      title: "Step 2: Contact Information",
      fields: [
        // Step 2 fields...
      ],
    },
    {
      title: "Step 3: Review",
      fields: [
        // Step 3 fields...
      ],
    },
  ],
  // Other configuration...
};
```

### Accordion Forms

Create accordion-style forms with collapsible sections:

```typescript
const accordionFormConfig: FormConfig = {
  accordion: true,
  wizardOptions: {
    showStepIndicator: true,
    showStepTitles: true,
  },
  sections: [
    // Each section becomes an accordion panel
    {
      title: "Personal Information",
      collapsible: true,
      fields: [
        // Fields...
      ],
    },
    {
      title: "Contact Information",
      collapsible: true,
      fields: [
        // Fields...
      ],
    },
  ],
  // Other configuration...
};
```

### Dynamic Fields

Create fields that depend on other field values:

```typescript
{
  type: "select",
  name: "country",
  label: "Country",
  options: [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    // More countries...
  ],
},
{
  type: "select",
  name: "state",
  label: "State/Province",
  condition: (values) => values.country === "us" || values.country === "ca",
  dynamicOptions: {
    url: "/api/states",
    valueField: "code",
    labelField: "name",
    dependsOn: "country",
  },
}
```

### Conditional Fields

Show or hide fields based on other field values:

```typescript
{
  type: "checkbox",
  name: "hasDiscount",
  label: "Apply Discount",
},
{
  type: "number",
  name: "discountAmount",
  label: "Discount Amount",
  condition: (values) => values.hasDiscount === true,
}
```

### API Integration

Submit form data to an API endpoint:

```typescript
const apiFormConfig: FormConfig = {
  // Form fields...
  apiUrl: "/api/submit-form",
  apiMethod: "POST", // HTTP method for form submission (default: POST)
  apiHeaders: {
    "Authorization": "Bearer your-token",
  },
  // Other configuration...
};

// API-based form update (edit mode) with different methods
const apiUpdateFormConfig: FormConfig = {
  isEditMode: true,
  editApiUrl: "/api/users/:id", // URL for both fetching data and form submission in edit mode
  editApiMethod: "PATCH", // Use PATCH for partial updates in edit mode
  editDataPath: "data",
  // Form fields...
};
```

### Edit Mode

Load and edit existing data:

```typescript
// Direct values
const editFormConfig: FormConfig = {
  isEditMode: true,
  editValues: {
    name: "John Doe",
    email: "john.doe@example.com",
    // Other field values...
  },
  // Form fields...
};

// API-based values for editing
const apiEditFormConfig: FormConfig = {
  isEditMode: true,
  editApiUrl: "/api/users/:id", // URL for both fetching data and form submission in edit mode
  editApiMethod: "PUT", // HTTP method for form submission in edit mode (default: PUT)
  editDataPath: "data", // Path to the data in the API response
  // Form fields...
};

// Usage with recordId
<SheetFormBuilder
  config={apiEditFormConfig}
  recordId="123" // This could come from a route parameter, state, etc.
  onSuccess={(values) => console.log("Form updated:", values)}
/>
```

## Field Types Reference

### Text Field

```typescript
{
  type: "text",
  name: "firstName",
  label: "First Name",
  placeholder: "Enter your first name",
  required: true,
}
```

### Email Field

```typescript
{
  type: "email",
  name: "email",
  label: "Email Address",
  placeholder: "Enter your email",
  required: true,
}
```

### Select Field

```typescript
{
  type: "select",
  name: "country",
  label: "Country",
  options: [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    // More options...
  ],
}
```

### Dynamic Select Field

```typescript
{
  type: "select",
  name: "city",
  label: "City",
  dynamicOptions: {
    url: "/api/cities",
    valueField: "id",
    labelField: "name",
    dependsOn: "country", // This field depends on the country field
  },
}
```

### Image Upload Field

```typescript
// Single image upload
{
  type: "image",
  name: "profileImage",
  label: "Profile Image",
  imageConfig: {
    allowedFileTypes: ["image/jpeg", "image/png"],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    previewWidth: 200,
    previewHeight: 200,
    uploadUrl: "/api/upload-image", // Optional
  },
}

// Multiple image upload
{
  type: "image",
  name: "galleryImages",
  label: "Gallery Images",
  isMulti: true, // Enable multiple image upload
  imageConfig: {
    allowedFileTypes: ["image/jpeg", "image/png"],
    maxFileSize: 2 * 1024 * 1024, // 2MB per image
    previewWidth: 150,
    previewHeight: 150,
    uploadUrl: "/api/upload-images", // Optional
  },
}
```

### File Upload Field

```typescript
// Single file upload
{
  type: "file",
  name: "document",
  label: "Document",
  fileConfig: {
    allowedFileTypes: ["application/pdf", "application/msword"],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    showThumbnails: true,
    uploadUrl: "/api/upload-file", // Optional
  },
}

// Multiple file upload
{
  type: "file",
  name: "attachments",
  label: "Attachments",
  isMulti: true, // Enable multiple file upload
  fileConfig: {
    allowedFileTypes: ["application/pdf", "image/jpeg", "image/png"],
    maxFileSize: 5 * 1024 * 1024, // 5MB per file
    showThumbnails: true,
  },
}
```

### Dynamic Rows Field

```typescript
{
  type: "dynamicRows",
  name: "contacts",
  label: "Contacts",
  dynamicRowOptions: {
    rowFields: [
      {
        type: "text",
        name: "name",
        label: "Name",
      },
      {
        type: "email",
        name: "email",
        label: "Email",
      },
    ],
    minRows: 1,
    maxRows: 5,
  },
}
```

## Examples

The form builder includes several examples to help you get started:

- **Basic Form**: `/react-hook-form-example` - A basic form with React Hook Form integration
- **Edit Mode**: `/edit-mode-test` - Demonstrates edit mode functionality
- **Image Upload**: `/image-upload-example` - Shows how to use image upload fields
- **Multi-Image Upload**: `/multi-image-upload-example` - Demonstrates multiple image upload functionality
- **File Upload**: `/file-upload-example` - Shows how to use file upload fields with type-based thumbnails
- **Direct Upload with Progress**: `/direct-upload-example` - Shows real-time upload with progress tracking
- **Role Permissions**: `/role-permissions-example` - Complex form with nested data structure
- **Multi-step Form**: `/form-wizard-example` - Example of a multi-step form
- **Advanced React Hook Form**: `/advanced-react-hook-form-example` - Comprehensive example of React Hook Form integration with advanced features

## Best Practices

1. **Organize Fields into Logical Sections**: Group related fields together in sections for better organization.
2. **Use Validation Rules**: Always add appropriate validation rules to ensure data quality.
3. **Provide Clear Labels and Helper Text**: Make your forms user-friendly with clear labels and helpful instructions.
4. **Use Conditional Fields**: Show only relevant fields based on user input to simplify the form.
5. **Test Edit Mode Thoroughly**: When using edit mode, test both loading and saving functionality.
6. **Handle Errors Gracefully**: Implement proper error handling for both client and server-side validation.
7. **Consider Mobile Users**: Ensure your forms are responsive and work well on mobile devices.
8. **Choose the Right Implementation**: Select between the default form implementation and React Hook Form based on your project's needs.

## React Hook Form Integration Details

The Form Builder module provides a complete integration with React Hook Form, offering an alternative to the default form state management system. This integration provides several benefits:

### Key Benefits

1. **Performance**: React Hook Form is optimized for performance with minimal re-renders
2. **Validation**: Integration with Zod for schema validation
3. **TypeScript Support**: Better type safety and autocompletion
4. **Form State**: Access to form state like dirty, touched, etc.
5. **Error Handling**: Improved error handling and validation

### How React Hook Form Integration Works

The React Hook Form integration uses the same form configuration structure as the default form implementation, ensuring a consistent developer experience. Here's how it works:

1. **Schema Generation**: The form configuration is automatically converted to a Zod validation schema
2. **Form Initialization**: React Hook Form is initialized with the schema and default values
3. **Field Registration**: Each field is registered with React Hook Form using the Controller component
4. **Validation**: Validation is handled by Zod based on the field validation rules
5. **Form Submission**: Form submission follows the same pattern as the default implementation

### Key Components and Hooks

The React Hook Form integration provides these key components and hooks:

#### Components

- `ReactHookSheetFormBuilder`: Sheet-based form builder using React Hook Form
- `ReactHookFormBuilder`: Standard form builder using React Hook Form
- `ReactHookExpandableFormSection`: Expandable form section component
- `ReactHookFormField`: Form field component that wraps React Hook Form's Controller

#### Hooks

- `useReactHookForm`: The core hook that powers the React Hook Form integration
  - Handles form initialization, validation, submission, and state management
  - Provides methods for field manipulation and form navigation
  - Supports all form modes (standard, wizard, accordion)
  - Handles API validation and server-side errors
- `useFormEdit`: Custom hook for handling form edit mode functionality
- `useFormData`: Main hook for using forms with the isolated pattern

### Feature Parity with Default Form Implementation

The React Hook Form integration maintains feature parity with the default form implementation:

| Feature | Default Form | React Hook Form |
|---------|-------------|-----------------|
| Form Modes | Standard, Wizard, Accordion | Standard, Wizard, Accordion |
| Field Types | All supported | All supported |
| Validation | Custom validation | Zod schema validation |
| API Validation | Supported | Supported |
| Edit Mode | Supported | Supported |
| Conditional Fields | Supported | Supported |
| Dynamic Fields | Supported | Supported |
| Multi-step Forms | Supported | Supported |
| Server-side Validation | Supported | Supported |

### When to Use React Hook Form Integration

Consider using the React Hook Form integration when:

1. **Performance is critical**: For forms with many fields or complex validation
2. **TypeScript integration is important**: For better type safety and autocompletion
3. **You need advanced validation**: For complex validation rules or dependencies
4. **You're familiar with React Hook Form**: For developers already comfortable with the library

### Technical Implementation

The React Hook Form integration works by:

1. Converting the form configuration to a Zod schema in the `createZodSchema` function
2. Initializing React Hook Form with this schema using `useForm` from react-hook-form
3. Using the `Controller` component to connect each field to React Hook Form
4. Handling form submission with React Hook Form's `handleSubmit` function
5. Managing form state and navigation with custom hooks and components

This approach ensures that all features of the default implementation are available in the React Hook Form implementation, while leveraging the performance and validation benefits of React Hook Form.
