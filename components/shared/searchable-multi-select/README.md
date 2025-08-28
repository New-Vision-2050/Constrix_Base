# Searchable Multi-Select Component

A reusable, accessible multi-select component with search capabilities built with React and Tailwind CSS.

## Features

- 🔍 Search functionality for filtering options
- ✅ Multiple selection support
- 🏷️ Selected items displayed as removable chips
- 🌙 Dark mode support
- ♿ Fully accessible with keyboard navigation and ARIA attributes
- 🌐 Internationalization ready

## Usage

```tsx
import { SearchableMultiSelect } from '@/components/shared/searchable-multi-select';

// Define your options
const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
];

// In your component
function MyComponent() {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  
  return (
    <SearchableMultiSelect
      options={options}
      selectedValues={selectedValues}
      onChange={setSelectedValues}
      placeholder="Search options..."
    />
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| options | `MultiSelectOption[]` | Yes | Array of options with label and value |
| selectedValues | `string[]` | Yes | Array of selected values |
| onChange | `(values: string[]) => void` | Yes | Callback when selection changes |
| placeholder | `string` | No | Placeholder text for search input |
| disabled | `boolean` | No | Whether the component is disabled |
| className | `string` | No | Additional CSS class names |

## Example with Translation

```tsx
import { useTranslations } from 'next-intl';
import { SearchableMultiSelect } from '@/components/shared/searchable-multi-select';

function LocalizedComponent() {
  const t = useTranslations('namespace');
  const [selected, setSelected] = useState<string[]>([]);
  
  return (
    <SearchableMultiSelect
      options={options}
      selectedValues={selected}
      onChange={setSelected}
      placeholder={t('searchPlaceholder')}
    />
  );
}
```

## Accessibility

This component is built with accessibility in mind:
- Full keyboard navigation
- ARIA attributes for screen readers
- Proper focus management
- Clear visual indicators for selected state
