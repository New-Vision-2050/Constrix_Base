# Our Services Module

## Overview
This module manages the "Our Services" section of the content management system. Built with React Hook Form, Material-UI, and following SOLID principles.

## Features
- ✅ Full MUI integration with theme support
- ✅ RTL/LTR support automatically handled
- ✅ Light/Dark mode compatible
- ✅ Type-safe with TypeScript
- ✅ Form validation with Zod
- ✅ Reusable components following Single Responsibility Principle
- ✅ Maximum 70 lines per file for maintainability

## Architecture

### Shared Components (`components/shared/`)
- **FormTextField**: Reusable text input with validation
- **FormSelect**: Reusable select dropdown with validation

### Department Components (`components/department/`)
- **DepartmentHeader**: Header with title and delete button
- **DepartmentTitleFields**: Arabic & English title inputs
- **DepartmentDescriptionFields**: Arabic & English description inputs
- **DepartmentDesignTypeField**: Design type selector

### Main Components
- **MainSection**: Main title and description
- **ServicesGrid**: Grid of service inputs
- **DepartmentSection**: Composed department form
- **DepartmentsList**: List of all departments

## Usage

```tsx
import OurServicesModule from "@/modules/content-management-system/our-services";

export default function Page() {
  return <OurServicesModule />;
}
```

## Translations
All translations are managed in `messages/groups/content-management-system/services.ts`

## Styling
- Uses MUI's `sx` prop for styling
- Automatically adapts to theme mode (light/dark)
- Responsive design with MUI Grid system
- RTL/LTR handled by MUI automatically

