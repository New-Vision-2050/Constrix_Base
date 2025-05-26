# Checkbox Group Field

The Checkbox Group field provides a group of checkboxes that can operate in either single-select mode (similar to radio buttons) or multi-select mode.

## Features

- **Single-select mode**: Only one option can be selected at a time (similar to radio buttons)
- **Multi-select mode**: Multiple options can be selected simultaneously
- **Dynamic options**: Options can be loaded from an API based on the value of another field
- **Validation support**: Full support for all validation types
- **Conditional fields**: Can be used with conditional fields
- **Styling options**: Customizable appearance
- **Synchronization**: Can be synchronized with another checkbox group field

## Usage

### Basic Usage

```typescript
// Single-select checkbox group
{
  type: "checkboxGroup",
  name: "favoriteColor",
  label: "Favorite Color",
  isMulti: false, // Single select mode
  options: [
    { value: "red", label: "Red" },
    { value: "green", label: "Green" },
    { value: "blue", label: "Blue" },
  ],
}

// Multi-select checkbox group
{
  type: "checkboxGroup",
  name: "hobbies",
  label: "Hobbies",
  isMulti: true, // Multi select mode
  options: [
    { value: "reading", label: "Reading" },
    { value: "sports", label: "Sports" },
    { value: "music", label: "Music" },
  ],
}
```

### With Validation

```typescript
{
  type: "checkboxGroup",
  name: "interests",
  label: "Interests",
  isMulti: true,
  required: true,
  options: [
    { value: "technology", label: "Technology" },
    { value: "art", label: "Art" },
    { value: "science", label: "Science" },
  ],
  validation: [
    {
      type: "required",
      message: "Please select at least one interest",
    },
    {
      type: "custom",
      validator: (value) => Array.isArray(value) ? value.length <= 2 : true,
      message: "You can select a maximum of 2 interests",
    },
  ],
}
```

### With Dynamic Options

```typescript
{
  type: "checkboxGroup",
  name: "cities",
  label: "Cities",
  isMulti: true,
  dynamicOptions: {
    url: "/api/cities",
    valueField: "id",
    labelField: "name",
    dependsOn: "country", // This field depends on the country field
  },
}
```

### With Conditional Fields

```typescript
{
  type: "checkboxGroup",
  name: "programmingLanguages",
  label: "Programming Languages",
  isMulti: true,
  options: [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
  ],
},
{
  type: "text",
  name: "javascriptExperience",
  label: "JavaScript Experience (years)",
  condition: (values) => {
    const languages = Array.isArray(values.programmingLanguages) 
      ? values.programmingLanguages 
      : [values.programmingLanguages];
    return languages.includes("javascript");
  },
}
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `type` | `"checkboxGroup"` | Field type identifier |
| `name` | `string` | Field name (used as form value key) |
| `label` | `string` | Field label |
| `isMulti` | `boolean` | Whether multiple options can be selected (default: `false`) |
| `options` | `Array<{value: string, label: string}>` | Array of static options |
| `dynamicOptions` | `DynamicDropdownConfig` | Configuration for loading options from an API |
| `required` | `boolean` | Whether the field is required |
| `disabled` | `boolean` | Whether the field is disabled |
| `className` | `string` | Custom CSS class for the field |
| `validation` | `ValidationRule[]` | Validation rules |
| `condition` | `(values: Record<string, any>) => boolean` | Condition for showing the field |
| `syncWithField` | `string` | Name of another checkbox group field to sync with |
| `syncDirection` | `"bidirectional" \| "unidirectional"` | Whether the sync is two-way or one-way |
| `syncOn` | `"select" \| "unselect" \| "both"` | When to trigger the sync |

## Value Format

- In single-select mode (`isMulti: false`), the value is a string representing the selected option's value.
- In multi-select mode (`isMulti: true`), the value is an array of strings representing the selected options' values.

## Example

See the complete example in `modules/form-builder/examples/CheckboxGroupExample.tsx`.

## Synchronization

The checkbox group field can be synchronized with another checkbox group field. This is useful when you have two related sets of options that should be kept in sync.

### Synchronization Properties

- **syncWithField**: The name of another checkbox group field to sync with
- **syncDirection**: Whether the sync is bidirectional or unidirectional
  - `"bidirectional"`: Changes in either field will update the other field
  - `"unidirectional"`: Changes in this field will update the target field, but not vice versa
- **syncOn**: When to trigger the sync
  - `"select"`: Sync only when an option is selected
  - `"unselect"`: Sync only when an option is unselected
  - `"both"`: Sync on both select and unselect actions

### Example with Synchronization

```typescript
// Two checkbox groups that sync with each other
{
  type: "checkboxGroup",
  name: "primaryLanguages",
  label: "Primary Programming Languages",
  isMulti: true,
  options: [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
  ],
  syncWithField: "secondaryLanguages",
  syncDirection: "bidirectional",
  syncOn: "both"
},
{
  type: "checkboxGroup",
  name: "secondaryLanguages",
  label: "Secondary Programming Languages",
  isMulti: true,
  options: [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
  ],
  syncWithField: "primaryLanguages",
  syncDirection: "bidirectional",
  syncOn: "both"
}
```

In this example, selecting or unselecting an option in either field will update the other field to maintain synchronization.