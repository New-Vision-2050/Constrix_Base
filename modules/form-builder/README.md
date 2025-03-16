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

When using API validation:
1. The field will show a loading indicator while validation is in progress
2. The validation happens after the user stops typing (debounce)
3. The error message is displayed if validation fails

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