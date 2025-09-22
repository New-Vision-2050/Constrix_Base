# Activity Statistics Component

A reusable component for displaying document statistics by activity with beautiful circular progress indicators, loading states, and error handling.

## Features

- 🎯 **Circular Progress**: Animated SVG circular progress indicators
- 🎨 **Customizable Colors**: Each activity can have its own color
- ⚡ **Loading States**: Elegant skeleton loading animation
- 🚨 **Error Handling**: User-friendly error messages with retry option
- 🔧 **Fully Reusable**: Data-driven via props
- 📱 **Responsive**: Works on all screen sizes
- ♿ **Accessible**: ARIA labels and semantic HTML

## Components

### ActivityStatisticsCard (Main Component)
Displays multiple activity statistics with circular progress indicators.

### CircularProgress
Animated SVG circular progress indicator with customizable color and size.

### LoadingState
Beautiful skeleton loading animation for activity statistics.

### ErrorState
Error display with optional retry functionality.

## Usage

```tsx
import { ActivityStatisticsCard, ActivityStatisticsData } from './docs-statistics-by-activity';
import { FileText } from 'lucide-react';

// Activity statistics example
const activityStats: ActivityStatisticsData = {
  items: [
    {
      title: 'المستندات السارية',
      percentage: 88,
      description: 'معدل المستندات السارية للشركة',
      color: '#10B981', // Green
      icon: <FileText className="w-6 h-6" />
    },
    {
      title: 'المستندات المنتهية',
      percentage: 60,
      description: 'معدل المستندات المنتهية للشركة',
      color: '#EC4899', // Pink
      icon: <FileText className="w-6 h-6" />
    }
  ]
};

// Basic usage
<ActivityStatisticsCard data={activityStats} />

// With loading state
<ActivityStatisticsCard isLoading={true} />

// With error state
<ActivityStatisticsCard error="فشل في تحميل البيانات" />
```

## Props

### ActivityStatisticsCardProps
- `data?: ActivityStatisticsData` - Statistics data to display
- `isLoading?: boolean` - Loading state
- `error?: string` - Error message
- `className?: string` - Custom CSS classes

### ActivityStatisticsData
- `items: ActivityStatisticsItem[]` - Array of statistics items

### ActivityStatisticsItem
- `title: string` - Title of the activity
- `percentage: number` - Percentage value (0-100)
- `description: string` - Description text below title
- `color: string` - Color for the progress circle
- `icon?: ReactNode` - Optional icon

### CircularProgressProps
- `percentage: number` - Progress percentage (0-100)
- `color: string` - Color of the progress circle
- `size?: number` - Size of the circle (default: 80)
- `strokeWidth?: number` - Stroke width (default: 6)

## SOLID Principles Applied

- **Single Responsibility**: Each component has one clear purpose
- **Open/Closed**: Components are open for extension via props
- **Interface Segregation**: Separate interfaces for different concerns
- **Dependency Inversion**: Components depend on abstractions (props/interfaces)

## Architecture

```
docs-statistics-by-activity/
├── ActivityStatisticsCard.tsx  # Main component
├── CircularProgress.tsx        # Circular progress indicator
├── LoadingState.tsx           # Loading animation
├── ErrorState.tsx             # Error handling
├── types.ts                   # TypeScript interfaces
├── index.ts                   # Exports
└── README.md                  # Documentation
```
