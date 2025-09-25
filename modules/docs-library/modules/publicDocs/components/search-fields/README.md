# Search Fields Component

A reusable search fields component for document filtering with date, type, and document type selection.

## Features

- 📅 **Date Selection**: End date filter using calendar picker
- 🏷️ **Type Filter**: Dropdown for status/type selection
- 📄 **Document Type**: Dropdown for document category selection
- 🎨 **Consistent Styling**: Uses existing UI components
- 🔧 **Fully Reusable**: Data-driven via props
- 🌐 **Internationalization**: Ready for translation support

## Components

### SearchFields (Main Component)
The primary component that renders all search filter fields.

### SearchDateField
Date picker component using existing Calendar UI component.

### SearchSelectField
Dropdown component using existing Select UI component.

## Usage

```tsx
import { SearchFields, SearchFormData } from './search-fields';

const [searchData, setSearchData] = useState<SearchFormData>({
  endDate: '',
  type: '',
  documentType: ''
});

<SearchFields
  data={searchData}
  onChange={setSearchData}
  isLoading={false}
/>
```

## Props

### SearchFieldsProps
- `data: SearchFormData` - Current search form data
- `onChange: (data: SearchFormData) => void` - Form data change handler
- `className?: string` - Custom CSS classes
- `isLoading?: boolean` - Loading state

### SearchFormData
- `endDate?: string` - End date filter value
- `type?: string` - Type filter value
- `documentType?: string` - Document type filter value

## SOLID Principles Applied

- **Single Responsibility**: Each component handles one specific field type
- **Open/Closed**: Components are extensible via props and options
- **Interface Segregation**: Separate interfaces for different concerns
- **Dependency Inversion**: Components depend on abstractions (props/interfaces)

## Architecture

```
search-fields/
├── SearchFields.tsx          # Main component
├── SearchDateField.tsx       # Date picker field
├── SearchSelectField.tsx     # Select dropdown field
├── types.ts                  # TypeScript interfaces
├── constants.ts              # Dropdown options
├── index.ts                  # Exports
└── README.md                 # Documentation
```
