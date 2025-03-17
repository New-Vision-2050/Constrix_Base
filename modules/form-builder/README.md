# Form Builder

A flexible and powerful form builder for React applications with advanced validation, wizard forms, and API integration.

## Overview

The Form Builder module provides a comprehensive solution for creating and managing forms in React applications. It supports various field types, validation rules, multi-step forms, and API integration, all with a clean and modern UI.

## Main Components

### SheetFormBuilder

The primary component for rendering forms in a slide-out sheet.

```tsx
import { SheetFormBuilder } from '@/modules/form-builder';

const MyForm = () => {
  return (
    <SheetFormBuilder
      config={formConfig}
      trigger={<button>Open Form</button>}
      onSuccess={(values) => console.log('Form submitted:', values)}
    />
  );
};
```

#### Props

- `config`: Form configuration object
- `trigger`: Optional custom trigger element
- `onSuccess`: Optional callback when form is successfully submitted
- `onCancel`: Optional callback when form is cancelled
- `side`: Optional side for the sheet ('top', 'right', 'bottom', 'left')
- `className`: Optional additional CSS classes

### FormBuilder

The core component used by SheetFormBuilder to render the form.

```tsx
import { FormBuilder } from '@/modules/form-builder';

const MyCustomForm = () => {
  // Use hooks to manage form state
  const {
    values,
    errors,
    touched,
    handleSubmit,
    // ...other form state and handlers
  } = useFormStore(formConfig);

  return (
    <FormBuilder
      config={formConfig}
      values={values}
      errors={errors}
      touched={touched}
      handleSubmit={handleSubmit}
      // ...other props
    />
  );
};
```

### DialogFormBuilder

Similar to SheetFormBuilder but renders the form in a dialog/modal.

```tsx
import { DialogFormBuilder } from '@/modules/form-builder';

const MyDialogForm = () => {
  return (
    <DialogFormBuilder
      config={formConfig}
      trigger={<button>Open Form</button>}
      onSuccess={(values) => console.log('Form submitted:', values)}
    />
  );
};
```

## Form Modes

The form builder supports different modes for displaying and navigating through forms:

### Regular Mode (Default)

All sections are displayed at once, and sections can be individually collapsible.

```tsx
const formConfig = {
  title: 'Regular Form',
  sections: [
    // Form sections
  ],
};
```

### Wizard Mode

A step-by-step form where only one section is visible at a time, with navigation buttons to move between steps.

```tsx
const formConfig = {
  title: 'Wizard Form',
  sections: [
    // Form sections (each section becomes a step)
  ],
  wizard: true,
  wizardOptions: {
    showStepIndicator: true,
    showStepTitles: true,
    validateStepBeforeNext: true,
    allowStepNavigation: true,
    nextButtonText: 'Next',
    prevButtonText: 'Previous',
    finishButtonText: 'Submit',
  },
};
```

### Accordion Mode

All sections are displayed as collapsible accordions, but only one section is expanded at a time.

```tsx
const formConfig = {
  title: 'Accordion Form',
  sections: [
    // Form sections
  ],
  accordion: true,
  wizardOptions: {
    // Same options as wizard mode
  },
};
```

## Field Types

The form builder supports various field types:

- `text`: Text input
- `textarea`: Multi-line text input
- `checkbox`: Checkbox input
- `radio`: Radio button group
- `select`: Dropdown select
- `multiSelect`: Multi-select dropdown
- `email`: Email input
- `password`: Password input
- `number`: Number input
- `date`: Date picker
- `search`: Search input with autocomplete
- `phone`: Phone input with country code selection
- `hiddenObject`: Hidden field that stores an object or array of objects without visual representation

### Example Field Configurations

#### Text Field

```tsx
{
  type: 'text',
  name: 'fullName',
  label: 'Full Name',
  placeholder: 'Enter your full name',
  required: true,
  validation: [
    {
      type: 'required',
      message: 'Full name is required',
    },
    {
      type: 'minLength',
      value: 3,
      message: 'Name must be at least 3 characters',
    },
  ],
}
```

#### Text Field with Postfix

```tsx
{
  type: 'number',
  name: 'weight',
  label: 'Weight',
  postfix: 'kg',
  required: true,
}
```

#### Select Field

```tsx
{
  type: 'select',
  name: 'country',
  label: 'Country',
  required: true,
  options: [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
  ],
}
```

#### Dynamic Select Field

```tsx
{
  type: 'select',
  name: 'city',
  label: 'City',
  required: true,
  dynamicOptions: {
    url: '/api/cities',
    valueField: 'id',
    labelField: 'name',
    dependsOn: 'country', // This field depends on the 'country' field
    filterParam: 'countryId', // Parameter name for filtering
  },
}
```

#### Multi-Select Field

```tsx
{
  type: 'multiSelect',
  name: 'skills',
  label: 'Skills',
  isMulti: true,
  options: [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
  ],
}
```

#### Checkbox Field

```tsx
{
  type: 'checkbox',
  name: 'termsAccepted',
  label: 'I accept the terms and conditions',
  required: true,
}
```

#### Radio Field

```tsx
{
  type: 'radio',
  name: 'gender',
  label: 'Gender',
  required: true,
  options: [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ],
}
```

#### Date Field

```tsx
{
  type: 'date',
  name: 'birthDate',
  label: 'Date of Birth',
  required: true,
}
```

#### Search Field

```tsx
{
  type: 'search',
  name: 'product',
  label: 'Product',
  required: true,
  searchType: {
    type: 'dropdown',
    dynamicDropdown: {
      url: '/api/products/search',
      valueField: 'id',
      labelField: 'name',
      searchParam: 'q',
      enableServerSearch: true,
    },
  },
}
```

#### Phone Field

```tsx
{
  type: 'phone',
  name: 'phoneNumber',
  label: 'Phone Number',
  required: true,
}
```

#### Hidden Object Field

```tsx
{
  type: 'hiddenObject',
  name: 'userMetadata',
  label: 'User Metadata', // Label is not displayed but used for identification
  defaultValue: {
    registrationSource: 'web',
    userType: 'customer',
    preferences: {
      notifications: true,
      theme: 'light'
    }
  }
}
```

```tsx
// Example with array of objects
{
  type: 'hiddenObject',
  name: 'previousOrders',
  label: 'Previous Orders',
  defaultValue: [
    {
      id: '1001',
      date: '2023-01-15',
      total: 125.50,
      items: [
        { productId: 'p1', quantity: 2 },
        { productId: 'p2', quantity: 1 }
      ]
    },
    {
      id: '1002',
      date: '2023-02-20',
      total: 75.25,
      items: [
        { productId: 'p3', quantity: 1 }
      ]
    }
  ]
}
```

```tsx
// Example with condition - field will only be included in form submission if condition is true
{
  type: 'hiddenObject',
  name: 'businessDetails',
  label: 'Business Details',
  condition: (values) => values.accountType === 'business',
  defaultValue: {
    companyType: 'llc',
    employeeCount: 0,
    industry: 'technology',
    taxExempt: false
  }
}
```

## Validation

The form builder supports various validation rules:

- `required`: Field is required
- `minLength`: Minimum length for text fields
- `maxLength`: Maximum length for text fields
- `min`: Minimum value for number fields
- `max`: Maximum value for number fields
- `pattern`: Regular expression pattern
- `email`: Email format validation
- `url`: URL format validation
- `custom`: Custom validation function
- `apiValidation`: Validate against an API endpoint with debounce

### API Validation

The form builder supports API validation with debounce, allowing you to validate field values against an API endpoint before form submission.

```tsx
{
  type: 'text',
  name: 'username',
  label: 'Username',
  required: true,
  validation: [
    {
      type: 'required',
      message: 'Username is required',
    },
    {
      type: 'apiValidation',
      message: 'Username is already taken',
      apiConfig: {
        url: '/api/validate-username',
        method: 'POST',
        debounceMs: 500, // Wait 500ms after typing stops before validating
        paramName: 'username',
        successCondition: (response) => response.available === true,
      },
    },
  ],
}
```

#### API Validation Configuration

- `url`: The API endpoint to validate against
- `method`: HTTP method (GET, POST, PUT)
- `debounceMs`: Debounce time in milliseconds (default: 500)
- `paramName`: The parameter name to send the value as
- `headers`: Optional headers to include in the request
- `successCondition`: Function to determine if validation passed based on the API response

If no `successCondition` is provided, the system will automatically check for common response patterns:
1. `response.available === true`
2. `response.success === true`
3. `response.valid === true`
4. `response.isValid === true`

## Form ID Management

The form builder now requires that form IDs be specified in the form configuration object rather than passed as a prop to components or hooks. This change centralizes form identification and makes it easier to manage forms across your application.

### Best Practices for Form IDs

1. **Always specify a formId in your form config**:
   ```tsx
   const formConfig = {
     formId: "unique-form-id", // Always include this
     title: "My Form",
     // ...other properties
   };
   ```

2. **Use descriptive, unique IDs**:
   Choose IDs that describe the form's purpose, such as "user-registration-form" or "product-order-form".

3. **Consistent ID format**:
   Use a consistent format for your form IDs, such as kebab-case (e.g., "contact-form") or camelCase (e.g., "contactForm").

4. **Reference the same ID across your application**:
   When you need to access a form from another component, use the same ID that you specified in the form config.

## Form Configuration

Forms are configured using a `FormConfig` object:

```tsx
import { FormConfig } from '@/modules/form-builder';

const formConfig: FormConfig = {
  title: 'Contact Form',
  description: 'Please fill out the form below',
  sections: [
    {
      title: 'Personal Information',
      description: 'Your personal details',
      fields: [
        // Field configurations
      ],
    },
    // More sections
  ],
  submitButtonText: 'Submit',
  resetButtonText: 'Reset',
  cancelButtonText: 'Cancel',
  showReset: true,
  showCancelButton: true,
  showBackButton: true,
  showSubmitLoader: true,
  initialValues: {
    // Initial form values
  },
  resetOnSuccess: true,
  onSubmit: async (values) => {
    // Handle form submission
    return { success: true };
  },
  onSuccess: (values, result) => {
    // Handle successful submission
  },
  onError: (values, error) => {
    // Handle submission error
  },
  onCancel: () => {
    // Handle form cancellation
  },
};
```

### FormConfig Properties

| Property | Type | Description |
|----------|------|-------------|
| `formId` | `string` | Unique identifier for the form instance (recommended to always specify this) |
| `title` | `string` | Form title |
| `description` | `string` | Form description |
| `className` | `string` | Additional CSS classes |
| `sections` | `FormSection[]` | Array of form sections |
| `showReset` | `boolean` | Whether to show the reset button |
| `showCancelButton` | `boolean` | Whether to show the cancel button |
| `showBackButton` | `boolean` | Whether to show the back button in step-based forms |
| `submitButtonText` | `string` | Text for the submit button |
| `resetButtonText` | `string` | Text for the reset button |
| `cancelButtonText` | `string` | Text for the cancel button |
| `showSubmitLoader` | `boolean` | Whether to show a loader during submission |
| `initialValues` | `Record<string, any>` | Initial form values |
| `resetOnSuccess` | `boolean` | Whether to reset the form after successful submission |
| `wizard` | `boolean` | Enable wizard mode |
| `accordion` | `boolean` | Enable accordion mode |
| `wizardOptions` | `WizardOptions` | Configuration for wizard/accordion mode |
| `apiUrl` | `string` | URL to submit the form data to |
| `apiHeaders` | `Record<string, string>` | Custom headers for the API request |
| `laravelValidation` | `object` | Laravel validation response support |
| `onSubmit` | `function` | Form submission handler |
| `onSuccess` | `function` | Success callback |
| `onError` | `function` | Error callback |
| `onCancel` | `function` | Cancel callback |
| `onValidationError` | `function` | Validation error callback |

### FieldConfig Properties

| Property | Type | Description |
|----------|------|-------------|
| `type` | `string` | Field type (text, textarea, select, hiddenObject, etc.) |
| `name` | `string` | Field name (used as the key in form values) |
| `label` | `string` | Field label |
| `defaultValue` | `any` | Default value for the field (especially useful for hiddenObject fields) |
| `placeholder` | `string` | Placeholder text |
| `helperText` | `string` | Helper text displayed below the field |
| `required` | `boolean` | Whether the field is required |
| `disabled` | `boolean` | Whether the field is disabled |
| `hidden` | `boolean` | Whether the field is hidden |
| `className` | `string` | Additional CSS classes for the field |
| `containerClassName` | `string` | Additional CSS classes for the field container |
| `width` | `string` | Width of the field (e.g., 'w-full', '200px') |
| `options` | `DropdownOption[]` | Options for select, multiSelect, and radio fields |
| `validation` | `ValidationRule[]` | Validation rules for the field |
| `condition` | `function` | Function that determines whether the field should be displayed |

## Hooks

### useSheetForm

The primary hook for managing form state in a sheet.

```tsx
import { useSheetForm } from '@/modules/form-builder';

const MyComponent = () => {
  const {
    isOpen,
    openSheet,
    closeSheet,
    values,
    errors,
    touched,
    isSubmitting,
    submitSuccess,
    submitError,
    setValue,
    setTouched,
    handleSubmit,
    handleCancel,
    resetForm,
    // ...other form state and handlers
  } = useSheetForm({
    config: formConfig,
    onSuccess: (values) => console.log('Form submitted:', values),
    onCancel: () => console.log('Form cancelled'),
  });
  
  // Use these values and functions to build a custom form UI
};
```

### useFormStore

The core hook that manages form state and actions.

```tsx
import { useFormStore } from '@/modules/form-builder';

const MyComponent = () => {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    submitSuccess,
    submitError,
    setValue,
    setTouched,
    handleSubmit,
    resetForm,
    // ...other form state and handlers
  } = useFormStore(formConfig);
  
  // Use these values and functions to build a custom form UI
};
```

### useFormWithTableReload

A hook that combines form functionality with table reloading.

```tsx
import { useFormWithTableReload } from '@/modules/form-builder';

const MyComponent = () => {
  const formHook = useFormWithTableReload({
    config: formConfig,
    // The table will automatically reload after successful form submission
  });
  
  // Use formHook to access form state and handlers
};
```

## Accessing and Controlling Forms from External Components

The Form Builder module provides a way to access and control forms from any component in your application. This is useful for scenarios where you need to programmatically close a form or update its values from a different component.

### Accessing a Form by ID

Each form in the system has a unique ID that can be used to access it. You should specify this ID in the form configuration object.

```tsx
import { SheetFormBuilder } from '@/modules/form-builder';

// Define your form configuration with a formId
const formConfig = {
  formId: "my-unique-form-id", // Specify the form ID in the config
  title: "My Form",
  // ... other config properties
};

function MyComponent() {
  return (
    <SheetFormBuilder
      config={formConfig}
    />
  );
}
```

### Closing a Form Programmatically

To close a form from another component, you can use the `useFormStore` hook to access the form's state and methods:

```tsx
import { useFormStore } from '@/modules/form-builder';

function ExternalComponent() {
  // Access the form by its ID
  const closeSheet = () => {
    // Get the current state of the form store
    const formStore = useFormStore.getState();
    
    // Get all forms in the store
    const { forms } = formStore;
    
    // Check if the form exists
    if (forms['my-unique-form-id']) {
      // Import the useSheetForm hook dynamically to avoid circular dependencies
      import('@/modules/form-builder').then(({ useSheetForm }) => {
        // Create a temporary hook instance to access the closeSheet method
        const { closeSheet } = useSheetForm({
          config: {
            formId: 'my-unique-form-id', // Specify the form ID in the config
          },
        });
        
        // Close the sheet
        closeSheet();
      });
    }
  };

  return (
    <button onClick={closeSheet}>
      Close Form
    </button>
  );
}
```

### Updating Form Values

You can update form values from any component using the `useFormStore` directly:

```tsx
import { useFormStore } from '@/modules/form-builder';

function ExternalComponent() {
  // Update a specific field in the form
  const updateFormField = () => {
    // Get the form store state
    const formStore = useFormStore.getState();
    
    // Update a specific field
    formStore.setValue('my-unique-form-id', 'fieldName', 'new value');
    
    // Or update multiple fields at once
    formStore.setValues('my-unique-form-id', {
      fieldName1: 'value1',
      fieldName2: 'value2',
    });
  };

  return (
    <button onClick={updateFormField}>
      Update Form Values
    </button>
  );
}
```

### Creating a Form Controller Hook

For more convenient access to form controls, you can create a custom hook:

```tsx
import { useCallback } from 'react';
import { useFormStore } from '@/modules/form-builder';

// Custom hook to control a form from any component
export function useFormController(formId: string) {
  // Get direct access to the form store
  const store = useFormStore.getState();
  
  // Close the form
  const closeForm = useCallback(() => {
    // Make sure the form exists
    if (store.forms[formId]) {
      // Import dynamically to avoid circular dependencies
      import('@/modules/form-builder').then(({ useSheetForm }) => {
        const { closeSheet } = useSheetForm({
          config: {
            formId, // Specify the form ID in the config
          },
        });
        closeSheet();
      });
    }
  }, [formId]);
  
  // Update a single field
  const updateField = useCallback((fieldName: string, value: any) => {
    store.setValue(formId, fieldName, value);
  }, [formId]);
  
  // Update multiple fields
  const updateFields = useCallback((values: Record<string, any>) => {
    store.setValues(formId, values);
  }, [formId]);
  
  // Reset the form
  const resetForm = useCallback((initialValues = {}) => {
    store.resetForm(formId, initialValues);
  }, [formId]);
  
  return {
    closeForm,
    updateField,
    updateFields,
    resetForm,
    // Add more methods as needed
  };
}
```

Usage example:

```tsx
function SomeComponent() {
  const { closeForm, updateField, updateFields } = useFormController('my-unique-form-id');
  
  const handleAction = () => {
    // Update form values
    updateFields({
      name: 'John Doe',
      email: 'john@example.com',
    });
    
    // Close the form
    closeForm();
  };
  
  return (
    <button onClick={handleAction}>
      Update and Close Form
    </button>
  );
}
```

## Integration with Table Builder

The Form Builder module can be integrated with the Table Builder module to automatically reload table data after form submissions.

### Manual Integration

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

### Automatic Integration

For a more seamless integration, you can use the `useFormWithTableReload` hook:

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

## Example Usage

### Basic Form

```tsx
import { SheetFormBuilder } from '@/modules/form-builder';

const ContactForm = () => {
  const formConfig = {
    title: 'Contact Form',
    sections: [
      {
        title: 'Personal Information',
        fields: [
          {
            type: 'text',
            name: 'name',
            label: 'Full Name',
            required: true,
          },
          {
            type: 'email',
            name: 'email',
            label: 'Email Address',
            required: true,
          },
          {
            type: 'textarea',
            name: 'message',
            label: 'Message',
            required: true,
          },
        ],
      },
    ],
    submitButtonText: 'Send Message',
    onSubmit: async (values) => {
      // Submit form data to API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();
      return { success: data.success, message: data.message };
    },
  };

  return (
    <SheetFormBuilder
      config={formConfig}
      onSuccess={(values) => console.log('Form submitted:', values)}
    />
  );
};
```

### Wizard Form

```tsx
import { SheetFormBuilder } from '@/modules/form-builder';

const RegistrationForm = () => {
  const formConfig = {
    title: 'Registration Form',
    sections: [
      {
        title: 'Account Information',
        fields: [
          {
            type: 'text',
            name: 'username',
            label: 'Username',
            required: true,
            validation: [
              {
                type: 'apiValidation',
                message: 'Username is already taken',
                apiConfig: {
                  url: '/api/validate-username',
                  method: 'POST',
                  paramName: 'username',
                },
              },
            ],
          },
          {
            type: 'email',
            name: 'email',
            label: 'Email',
            required: true,
            validation: [
              {
                type: 'apiValidation',
                message: 'Email is already registered',
                apiConfig: {
                  url: '/api/validate-email',
                  method: 'POST',
                  paramName: 'email',
                },
              },
            ],
          },
          {
            type: 'password',
            name: 'password',
            label: 'Password',
            required: true,
          },
        ],
      },
      {
        title: 'Personal Information',
        fields: [
          {
            type: 'text',
            name: 'firstName',
            label: 'First Name',
            required: true,
          },
          {
            type: 'text',
            name: 'lastName',
            label: 'Last Name',
            required: true,
          },
          {
            type: 'date',
            name: 'birthDate',
            label: 'Date of Birth',
            required: true,
          },
        ],
      },
      {
        title: 'Preferences',
        fields: [
          {
            type: 'select',
            name: 'theme',
            label: 'Theme',
            options: [
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
              { value: 'system', label: 'System' },
            ],
          },
          {
            type: 'checkbox',
            name: 'newsletter',
            label: 'Subscribe to newsletter',
          },
          {
            type: 'checkbox',
            name: 'termsAccepted',
            label: 'I accept the terms and conditions',
            required: true,
          },
        ],
      },
    ],
    wizard: true,
    wizardOptions: {
      showStepIndicator: true,
      showStepTitles: true,
      validateStepBeforeNext: true,
      nextButtonText: 'Continue',
      prevButtonText: 'Back',
      finishButtonText: 'Complete Registration',
    },
    submitButtonText: 'Register',
    onSubmit: async (values) => {
      // Submit form data to API
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();
      return { success: data.success, message: data.message };
    },
  };

  return (
    <SheetFormBuilder
      config={formConfig}
      onSuccess={(values) => console.log('Registration complete:', values)}
    />
  );
};
```

### Form with Conditional Fields

```tsx
import { SheetFormBuilder } from '@/modules/form-builder';

const OrderForm = () => {
  const formConfig = {
    title: 'Order Form',
    sections: [
      {
        title: 'Order Details',
        fields: [
          {
            type: 'select',
            name: 'productType',
            label: 'Product Type',
            required: true,
            options: [
              { value: 'physical', label: 'Physical Product' },
              { value: 'digital', label: 'Digital Product' },
              { value: 'subscription', label: 'Subscription' },
            ],
          },
          {
            type: 'text',
            name: 'productName',
            label: 'Product Name',
            required: true,
          },
          {
            type: 'number',
            name: 'quantity',
            label: 'Quantity',
            required: true,
            condition: (values) => values.productType === 'physical',
          },
          {
            type: 'select',
            name: 'subscriptionPeriod',
            label: 'Subscription Period',
            required: true,
            condition: (values) => values.productType === 'subscription',
            options: [
              { value: 'monthly', label: 'Monthly' },
              { value: 'quarterly', label: 'Quarterly' },
              { value: 'yearly', label: 'Yearly' },
            ],
          },
          {
            type: 'text',
            name: 'downloadInstructions',
            label: 'Download Instructions',
            condition: (values) => values.productType === 'digital',
          },
        ],
      },
      {
        title: 'Shipping Information',
        condition: (values) => values.productType === 'physical',
        fields: [
          {
            type: 'text',
            name: 'address',
            label: 'Shipping Address',
            required: true,
          },
          {
            type: 'text',
            name: 'city',
            label: 'City',
            required: true,
          },
          {
            type: 'text',
            name: 'postalCode',
            label: 'Postal Code',
            required: true,
          },
          {
            type: 'select',
            name: 'country',
            label: 'Country',
            required: true,
            options: [
              { value: 'us', label: 'United States' },
              { value: 'ca', label: 'Canada' },
              { value: 'uk', label: 'United Kingdom' },
            ],
          },
        ],
      },
      {
        title: 'Payment Information',
        fields: [
          {
            type: 'select',
            name: 'paymentMethod',
            label: 'Payment Method',
            required: true,
            options: [
              { value: 'creditCard', label: 'Credit Card' },
              { value: 'paypal', label: 'PayPal' },
              { value: 'bankTransfer', label: 'Bank Transfer' },
            ],
          },
        ],
      },
    ],
    submitButtonText: 'Place Order',
    onSubmit: async (values) => {
      // Submit form data to API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();
      return { success: data.success, message: data.message };
    },
  };

  return (
    <SheetFormBuilder
      config={formConfig}
      onSuccess={(values) => console.log('Order placed:', values)}
    />
  );
};