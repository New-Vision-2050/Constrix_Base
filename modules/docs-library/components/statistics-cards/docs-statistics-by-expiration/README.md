# Expiration Statistics Component

A reusable component for displaying documents by expiration status with beautiful UI, loading states, and error handling.

## Features

- 📋 **Document List**: Display documents with expiration information
- 🏷️ **Status Badges**: Colored badges for expiration status
- 📅 **Expiration Dates**: Clear date display for each document
- ⚡ **Loading States**: Elegant skeleton loading animation
- 🚨 **Error Handling**: User-friendly error messages with retry option
- 🔧 **Fully Reusable**: Data-driven via props
- 📱 **Responsive**: Works on all screen sizes
- ♿ **Accessible**: ARIA labels and semantic HTML

## Components

### ExpirationStatisticsCard (Main Component)
Displays documents with expiration information and status badges.

### DocumentItem
Individual document item with icon, name, expiration date.

### ExpirationBadge
Colored badge component for status indication.

### LoadingState
Beautiful skeleton loading animation for expiration statistics.

### ErrorState
Error display with optional retry functionality.

## Usage

```tsx
import { ExpirationStatisticsCard, ExpirationStatisticsData } from './docs-statistics-by-expiration';
import { FileText } from 'lucide-react';

// Expiration statistics example
const expirationStats: ExpirationStatisticsData = {
  title: 'المستندات المقتربة على الانتهاء',
  totalCount: 14,
  countLabel: 'عدد تحميلات المستند',
  documents: [
    {
      id: '1',
      name: 'عقد_تحويل_21',
      expirationDate: '20/04/2024',
      icon: <FileText className="w-4 h-4 text-white" />,
      badgeText: 'تنتهي قريباً',
      badgeVariant: 'warning'
    },
    {
      id: '2',
      name: 'تحويلات_2',
      expirationDate: '20/04/2024',
      icon: <FileText className="w-4 h-4 text-white" />,
      badgeText: 'تنتهي قريباً',
      badgeVariant: 'warning'
    }
  ]
};

// Basic usage
<ExpirationStatisticsCard data={expirationStats} />

// With loading state
<ExpirationStatisticsCard isLoading={true} />

// With error state
<ExpirationStatisticsCard error="فشل في تحميل البيانات" />
```

## Props

### ExpirationStatisticsCardProps
- `data?: ExpirationStatisticsData` - Statistics data to display
- `isLoading?: boolean` - Loading state
- `error?: string` - Error message
- `className?: string` - Custom CSS classes

### ExpirationStatisticsData
- `title: string` - Main title
- `totalCount: number` - Total count
- `countLabel: string` - Count label
- `documents: ExpirationDocumentItem[]` - Array of documents

### ExpirationDocumentItem
- `id: string` - Document ID
- `name: string` - Document name/title
- `expirationDate: string` - Expiration date
- `icon?: ReactNode` - Document icon
- `badgeText?: string` - Badge text
- `badgeVariant?: 'warning' | 'danger' | 'info'` - Badge color variant

### ExpirationBadgeProps
- `text: string` - Badge text
- `variant?: 'warning' | 'danger' | 'info'` - Badge variant

## SOLID Principles Applied

- **Single Responsibility**: Each component has one clear purpose
- **Open/Closed**: Components are open for extension via props
- **Interface Segregation**: Separate interfaces for different concerns
- **Dependency Inversion**: Components depend on abstractions (props/interfaces)

## Architecture

```
docs-statistics-by-expiration/
├── ExpirationStatisticsCard.tsx  # Main component
├── DocumentItem.tsx              # Individual document item
├── ExpirationBadge.tsx          # Status badge component
├── LoadingState.tsx             # Loading animation
├── ErrorState.tsx               # Error handling
├── types.ts                     # TypeScript interfaces
├── index.ts                     # Exports
└── README.md                    # Documentation
```
