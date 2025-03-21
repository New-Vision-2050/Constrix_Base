# Form Builder Module

This module provides a flexible and powerful form building system for React applications. It supports both a custom form state management system and React Hook Form integration.

## Features

- **Flexible Form Configuration**: Define forms using a declarative configuration object
- **Multiple Form Modes**: Standard, Wizard (multi-step), and Accordion modes
- **Validation**: Client-side and server-side validation support
- **Dynamic Fields**: Conditional fields, dynamic dropdowns, and more
- **Responsive Layout**: Configurable grid layouts for form sections
- **Accessibility**: Built with accessibility in mind
- **Internationalization**: Support for RTL languages and translations
- **React Hook Form Integration**: Optional integration with React Hook Form

## Usage

### Using the Custom Form State Management

```tsx
import { SheetFormBuilder, FormConfig } from "@/modules/form-builder";

const formConfig: FormConfig = {
  // Form configuration...
};

export default function MyForm() {
  return (
    <SheetFormBuilder
      config={formConfig}
      trigger={<Button>Open Form</Button>}
      onSuccess={(values) => console.log("Form submitted:", values)}
    />
  );
}
```

### Using React Hook Form

```tsx
import { ReactHookSheetFormBuilder, FormConfig } from "@/modules/form-builder";

const formConfig: FormConfig = {
  // Form configuration...
};

export default function MyForm() {
  return (
    <ReactHookSheetFormBuilder
      config={formConfig}
      trigger={<Button>Open Form</Button>}
      onSuccess={(values) => console.log("Form submitted:", values)}
    />
  );
}
```

## Form Configuration

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
  apiHeaders?: Record<string, string>; // Custom headers for the API request
  
  // Event handlers
  onSubmit?: (values: Record<string, any>) => Promise<{ success: boolean; message?: string; errors?: Record<string, string | string[]> }>;
  onSuccess?: (values: Record<string, any>, result: { success: boolean; message?: string }) => void;
  onError?: (values: Record<string, any>, error: { message?: string; errors?: Record<string, string | string[]> }) => void;
  onCancel?: () => void;
  onValidationError?: (errors: Record<string, string | React.ReactNode>) => void;
}
```

## React Hook Form Integration

The React Hook Form integration provides several benefits:

1. **Performance**: React Hook Form is optimized for performance with minimal re-renders
2. **Validation**: Integration with Zod for schema validation
3. **TypeScript Support**: Better type safety and autocompletion
4. **Form State**: Access to form state like dirty, touched, etc.
5. **Error Handling**: Improved error handling and validation

### Components

- `ReactHookSheetFormBuilder`: Sheet-based form builder using React Hook Form
- `ReactHookFormBuilder`: Standard form builder using React Hook Form
- `ReactHookExpandableFormSection`: Expandable form section component
- `ReactHookFormField`: Form field component

### Hooks

- `useReactHookForm`: Custom hook for integrating React Hook Form with the form builder

## Example

See the example page at `/react-hook-form-example` for a complete demonstration of the React Hook Form integration.