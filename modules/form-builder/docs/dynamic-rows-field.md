# Dynamic Rows Field

The Dynamic Rows field type allows users to add multiple rows with customizable fields. Each row can support various field types and can be sorted using drag-and-drop.

## Features

- Add multiple rows with customizable fields
- Support for various field types (text, number, select, checkbox, date, etc.)
- Drag-and-drop sorting
- Row management (add, edit, delete)
- Configurable minimum and maximum number of rows
- Custom button text for adding and deleting rows
- Default values for new rows

## Usage

To use the Dynamic Rows field type in your form, add a field with type `dynamicRows` to your form configuration:

```typescript
import { FormConfig } from '@/modules/form-builder';

const formConfig: FormConfig = {
  // ... other form configuration
  sections: [
    {
      title: 'Section with Dynamic Rows',
      fields: [
        {
          name: 'dynamicRowsField',
          label: 'Dynamic Rows Field',
          type: 'dynamicRows',
          required: true,
          validation: [
            {
              type: 'required',
              message: 'At least one row is required'
            }
          ],
          dynamicRowsConfig: {
            fields: [
              {
                name: 'field1',
                label: 'Field 1',
                type: 'text',
                placeholder: 'Enter text',
                required: true
              },
              {
                name: 'field2',
                label: 'Field 2',
                type: 'select',
                options: [
                  { value: 'option1', label: 'Option 1' },
                  { value: 'option2', label: 'Option 2' }
                ]
              },
              // Add more fields as needed
            ],
            addRowButtonText: 'Add Row',
            deleteRowButtonText: 'Delete',
            minRows: 1,
            maxRows: 10,
            sortable: true,
            defaultRowValues: {
              // Default values for new rows
              field1: '',
              field2: 'option1'
            }
          }
        }
      ]
    }
  ]
};
```

## Configuration Options

### Field Configuration

The `dynamicRows` field type accepts the following configuration options:

| Option | Type | Description |
|--------|------|-------------|
| name | string | The name of the field |
| label | string | The label for the field |
| type | 'dynamicRows' | The field type |
| required | boolean | Whether the field is required |
| validation | ValidationRule[] | Validation rules for the field |
| dynamicRowsConfig | DynamicRowsConfig | Configuration for the dynamic rows |

### DynamicRowsConfig

The `dynamicRowsConfig` object accepts the following options:

| Option | Type | Description |
|--------|------|-------------|
| fields | DynamicRowFieldConfig[] | Array of field configurations for each row |
| addRowButtonText | string | Text for the add row button (default: "Add Row") |
| deleteRowButtonText | string | Text for the delete row button (default: "Remove") |
| minRows | number | Minimum number of rows (default: 0) |
| maxRows | number | Maximum number of rows (default: unlimited) |
| sortable | boolean | Whether rows can be sorted using drag-and-drop (default: false) |
| defaultRowValues | Record<string, any> | Default values for new rows |

### DynamicRowFieldConfig

Each field in a dynamic row accepts the following options:

| Option | Type | Description |
|--------|------|-------------|
| name | string | The name of the field |
| label | string | The label for the field |
| type | string | The field type (text, textarea, checkbox, radio, select, multiSelect, email, password, number, date) |
| placeholder | string | Placeholder text for the field |
| required | boolean | Whether the field is required |
| options | DropdownOption[] | Options for select, multiSelect, and radio fields |
| validation | ValidationRule[] | Validation rules for the field |
| defaultValue | any | Default value for the field |
| width | string | Width of the field (e.g., "100%", "200px") |

## Data Structure

The data structure for a dynamic rows field is an array of objects, where each object represents a row with its field values:

```json
[
  {
    "field1": "Value 1",
    "field2": "option1",
    "_id": "row-1234567890"
  },
  {
    "field1": "Value 2",
    "field2": "option2",
    "_id": "row-0987654321"
  }
]
```

Each row has an internal `_id` field that is used for tracking and sorting rows.

## Example

See the `dynamicRowsExampleConfig.ts` file for a complete example of a form with dynamic rows fields.

To see the dynamic rows field in action, visit the `/dynamic-rows-example` page in the application.