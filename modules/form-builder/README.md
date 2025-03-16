# Form Builder

A flexible and powerful form builder for React applications with advanced validation, wizard forms, and API integration.

## Features

- **Dynamic Form Generation**: Create forms with various field types
- **Validation**: Built-in validation rules with custom validation support
- **Wizard Forms**: Multi-step forms with navigation
- **API Integration**: Submit form data to APIs
- **Responsive Design**: Mobile-friendly forms
- **Customizable**: Easily extend with custom components
- **API Validation**: Real-time field validation against API endpoints with debounce

## Usage

### Basic Form

```tsx
import { FormConfig } from '../types/formTypes';
import SheetFormBuilder from '../components/SheetFormBuilder';

const formConfig: FormConfig = {
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
      ],
    },
  ],
  submitButtonText: 'Submit',
  onSubmit: async (values) => {
    // Handle form submission
    return { success: true };
  },
};

const MyForm = () => {
  return <SheetFormBuilder config={formConfig} />;
};
```

### API Validation with Debounce

The form builder now supports API validation with debounce, allowing you to validate field values against an API endpoint before form submission.

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

Important notes about validation:
- All validation checks use strict equality (`=== true`) to ensure proper validation
- Truthy values that are not strictly `true` will be considered invalid
- If none of these patterns are found, the validation will fail by default
- This ensures that API validation is strict and requires explicit success indicators

#### API Validation Features

When using API validation:
1. The field will show a loading indicator while validation is in progress
2. The validation happens after the user stops typing (debounce)
3. A checkmark (✓) icon is displayed immediately when API validation succeeds (only for fields with API validation and no errors)
4. An X icon is displayed if validation fails (checks both local form errors and API validation errors)
5. Form submission is prevented while API validation is in progress
6. Form submission is prevented if any API validation fails
7. Step submission in wizard/accordion mode is also prevented if any API validation fails
8. API validation errors persist until the field value is changed or cleared
9. Error indicators are automatically removed when a field value is deleted or changed

This ensures that users cannot submit forms with invalid data, and provides clear visual feedback about the validation status. The checkmark icon gives users confidence that their input is valid and ready for submission.

The form system now checks for API validation errors during both regular form submission and step submission in wizard/accordion modes. This enhancement ensures that all API validations must be successful before allowing the form or step to be submitted, maintaining data integrity and preventing submission of invalid data.

## Button Visibility Options

The form builder now supports options to control the visibility of various buttons:

- `showReset`: Whether to show the reset/clear button (default: false)
- `showCancelButton`: Whether to show the cancel button (default: true if cancelButtonText is provided)
- `showBackButton`: Whether to show the back button in step-based forms (default: true)

Example:

```typescript
const formConfig: FormConfig = {
  // ...
  showReset: true, // Show the reset button
  showCancelButton: false, // Hide the cancel button
  showBackButton: false, // Hide the back button in wizard/accordion mode
  resetButtonText: 'Clear', // Custom text for reset button
  cancelButtonText: 'Cancel', // Only used if showCancelButton is true
};
```

## Form Modes

The form builder supports different modes for displaying and navigating through forms:

### Regular Mode (Default)

All sections are displayed at once, and sections can be individually collapsible.

### Wizard Mode

A step-by-step form where only one section is visible at a time, with navigation buttons to move between steps.

```typescript
const formConfig: FormConfig = {
  // ...
  wizard: true,
  wizardOptions: {
    // Wizard options here
  }
};
```

### Accordion Mode

All sections are displayed as collapsible accordions, but only one section is expanded at a time. Navigation buttons allow moving between sections, and clicking on a section header makes it the active step.

Key features:
- Shows all sections at once, but only one is expanded
- Only the active step can be expanded; other sections are disabled and automatically closed
- The active step is automatically expanded when it becomes active
- Supports submitting each step individually with the `submitEachStep` option, just like in wizard mode
- Completed sections show a green checkmark (✓) in the header
- A section is considered completed when all required fields are filled and valid
- Navigation buttons work the same as in wizard mode
- Clicking a section header makes it the active step (when allowed)

```typescript
const formConfig: FormConfig = {
  // ...
  accordion: true,
  wizardOptions: {
    // Same options as wizard mode
  }
};
```

## Field Types

- `text`: Text input
- `textarea`: Multi-line text input
- `checkbox`: Checkbox input
- `radio`: Radio button group
- `select`: Dropdown select
- `email`: Email input
- `password`: Password input
- `number`: Number input
- `date`: Date picker
- `search`: Search input with autocomplete
- `phone`: Phone input with country code selection

## Text Field Options

Text fields support additional options:

- `postfix`: Text to display after the input field (e.g., units, currency symbols). The postfix is always displayed in LTR (left-to-right) mode regardless of the application's text direction, making it consistent across all locales.

Example with postfix:

```tsx
{
  type: 'text',
  name: 'weight',
  label: 'Weight',
  postfix: 'kg',
  required: true,
}
```

```tsx
{
  type: 'number',
  name: 'price',
  label: 'Price',
  postfix: 'USD',
  required: true,
}
```

The postfix feature is designed to work consistently in both LTR and RTL layouts, ensuring that units and symbols always appear in the correct position and orientation regardless of the application's language direction. While the postfix is always displayed in LTR mode, the input field itself (including placeholder text) respects the localization direction, providing a natural experience for users of all languages.

## Validation Rules

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

## Examples

See the `test` directory for example implementations:
- `FormBuilderTest.tsx`: Basic form example
- `ApiValidationExample.tsx`: Example with API validation