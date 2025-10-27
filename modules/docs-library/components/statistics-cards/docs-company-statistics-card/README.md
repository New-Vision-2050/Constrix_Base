# Statistics Cards Component

A reusable and flexible statistics card component for displaying document statistics with beautiful UI, loading states, and error handling.

## Features

- 🎨 **Beautiful Design**: Purple gradient background with modern styling
- 📊 **Comparison Visualization**: Progress bar with orange-to-blue gradient
- ⚡ **Loading States**: Elegant skeleton loading animation
- 🚨 **Error Handling**: User-friendly error messages with retry option
- 🔧 **Fully Reusable**: Data-driven via props
- 📱 **Responsive**: Works on all screen sizes
- ♿ **Accessible**: ARIA labels and semantic HTML

## Components

### StatisticsCard (Main Component)
The primary component that displays statistics with optional comparison data.

### ComparisonSection
Displays comparison between two values with VS indicator and progress bar.

### ProgressBar
Animated progress bar with gradient colors.

### LoadingState
Beautiful skeleton loading animation.

### ErrorState
Error display with optional retry functionality.

## Usage

```tsx
import { StatisticsCard, StatisticsCardData } from './statistics-cards';

// Document statistics example
const documentStats: StatisticsCardData = {
  title: 'عدد المستندات الشركة',
  mainValue: 27,
  mainLabel: 'مستند',
  secondaryValue: '160 MB',
  comparison: {
    leftValue: 120,
    leftLabel: 'المساحة المتبقية',
    rightValue: 40,
    rightLabel: 'المساحة المستهلكة',
    unit: 'MB'
  },
  icon: <DocumentIcon className="w-6 h-6 text-blue-400" />
};

// Basic usage
<StatisticsCard data={documentStats} />

// With loading state
<StatisticsCard isLoading={true} />

// With error state
<StatisticsCard error="فشل في تحميل البيانات" />
```

## Props

### StatisticsCardProps
- `data?: StatisticsCardData` - Statistics data to display
- `isLoading?: boolean` - Loading state
- `error?: string` - Error message
- `className?: string` - Custom CSS classes

### StatisticsCardData
- `title: string` - Card title
- `mainValue: number | string` - Main statistical value
- `mainLabel?: string` - Label for main value
- `secondaryValue?: string` - Secondary value (e.g., storage size)
- `comparison?: ComparisonData` - Comparison data for progress visualization
- `icon?: ReactNode` - Icon to display with title

### ComparisonData
- `leftValue: number` - Left side value
- `leftLabel: string` - Left side label
- `rightValue: number` - Right side value
- `rightLabel: string` - Right side label
- `unit: string` - Unit for both values

## SOLID Principles Applied

- **Single Responsibility**: Each component has one clear purpose
- **Open/Closed**: Components are open for extension via props
- **Interface Segregation**: Separate interfaces for different concerns
- **Dependency Inversion**: Components depend on abstractions (props/interfaces)

## Architecture

```
statistics-cards/
├── StatisticsCard.tsx      # Main component
├── ComparisonSection.tsx   # Comparison display
├── ProgressBar.tsx         # Progress visualization
├── LoadingState.tsx        # Loading animation
├── ErrorState.tsx          # Error handling
├── types.ts               # TypeScript interfaces
├── index.ts               # Exports
└── README.md              # Documentation
```
