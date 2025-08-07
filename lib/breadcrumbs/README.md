# Breadcrumbs Component

A reusable breadcrumbs navigation component for Next.js applications with client components and global state management. Built with TypeScript, Tailwind CSS, and next-intl for internationalization.

## Features

- 🎨 **Tailwind CSS**: Fully styled with Tailwind, including dark mode support
- 🌍 **Internationalization**: Integrated with next-intl for multilingual support
- 🔄 **Context API**: Global state management for breadcrumbs
- 🪝 **Custom Hook**: Easy access to breadcrumb state and actions
- 🧩 **Customizable**: Flexible API to customize appearance and behavior
- 📱 **Responsive**: Works on all screen sizes
- ♿ **Accessible**: Built with proper ARIA attributes

## Installation

The component is part of the project and ready to use. No additional installation required.

## Usage

### Basic Usage (Client Component)

```tsx
'use client';

import { ClientComponents } from '@/lib/breadcrumbs';

export default function SimplePage() {
  // Example of manually defining breadcrumbs
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Settings', href: '/dashboard/settings' },
    { label: 'Profile', href: '/dashboard/settings/profile', isCurrent: true }
  ];
  
  return (
    <div>
      <ClientComponents.Breadcrumbs 
        items={breadcrumbs} 
        showHomeLink={true} 
      />
      <h1>Page Content</h1>
    </div>
  );
}
```

### Using Context Provider

```tsx
'use client';

import { BreadcrumbsProvider, ClientComponents } from '@/lib/breadcrumbs';

export default function Layout({ children }: { children: React.ReactNode }) {
  // Initial breadcrumbs (optional)
  const initialBreadcrumbs = [
    { label: 'Home', href: '/' }
  ];
  
  return (
    <BreadcrumbsProvider initialItems={initialBreadcrumbs}>
      {/* Header with breadcrumbs */}
      <header>
        <ClientComponents.Breadcrumbs showHomeLink={true} />
      </header>
      
      {/* Main content */}
      <main>{children}</main>
    </BreadcrumbsProvider>
  );
}
```

### Using the Custom Hook

```tsx
'use client';

import { usePathname } from 'next/navigation';
import { useBreadcrumbs } from '@/lib/breadcrumbs';

export default function DynamicPage() {
  const pathname = usePathname();
  const { 
    breadcrumbs, 
    setBreadcrumbs,
    addBreadcrumb,
    resetBreadcrumbs
  } = useBreadcrumbs();
  
  // Generate breadcrumbs from current path and set them in context
  React.useEffect(() => {
    // Split the pathname into segments
    const pathSegments = pathname.replace(/^\//g, '').split('/');
    
    // Map of path segments to human-readable labels
    const labelsMap = {
      'products': 'المنتجات',  // Arabic label example
      'categories': 'Categories',
      'electronics': 'Electronics'
    };
    
    // Generate breadcrumbs manually
    const items = pathSegments.map((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      const label = labelsMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      return { label, href, isCurrent: index === pathSegments.length - 1 };
    });
    
    // Update breadcrumbs in context
    setBreadcrumbs(items);
  }, [pathname, setBreadcrumbs]);
  
  // Add a new breadcrumb
  const handleAddBreadcrumb = () => {
    addBreadcrumb({
      label: 'New Item',
      href: '/new-item'
    });
  };
  
  // Reset all breadcrumbs
  const handleReset = () => {
    resetBreadcrumbs();
  };
  
  return (
    <div>
      {/* No need to pass items, it uses the context */}
      <h1>Current page: {pathname}</h1>
      <button onClick={handleAddBreadcrumb}>Add breadcrumb</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}
```

### Custom Styling

```tsx
import { ClientComponents } from '@/lib/breadcrumbs';

export default function StyledPage() {
  const breadcrumbs = [
    { label: 'Users', href: '/users' },
    { label: 'Admin', href: '/users/admin', isCurrent: true }
  ];
  
  return (
    <ClientComponents.Breadcrumbs 
      items={breadcrumbs}
      className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg"
    />
  );
}
```

## API Reference

### BreadcrumbItem

| Property   | Type            | Description                              |
|------------|-----------------|------------------------------------------|
| label      | string          | The text to display for the breadcrumb   |
| href       | string          | The URL that this breadcrumb links to    |
| isCurrent? | boolean         | Whether this is the current page         |
| icon?      | React.ReactNode | Optional icon to display before the label|

### BreadcrumbsProps

| Property       | Type            | Default | Description                           |
|----------------|-----------------|---------|---------------------------------------|
| items          | BreadcrumbItem[]| -       | Array of breadcrumb items to display  |
| showHomeLink?  | boolean         | true    | Whether to show the home icon/link    |
| className?     | string          | ''      | Optional custom CSS classes           |

### BreadcrumbsProvider Props

| Property      | Type            | Default | Description                        |
|---------------|-----------------|---------|------------------------------------|
| children      | ReactNode       | -       | Child components                   |
| initialItems? | BreadcrumbItem[]| []      | Initial breadcrumbs items          |

### useBreadcrumbs Hook

```ts
function useBreadcrumbs(): {
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (items: BreadcrumbItem[]) => void;
  addBreadcrumb: (item: BreadcrumbItem) => void;
  resetBreadcrumbs: () => void;
}
```

## Best Practices

1. **Use the Context Provider** at the layout level to share breadcrumbs across pages
2. **Use the useBreadcrumbs hook** to manage breadcrumbs state from any component
3. **Keep breadcrumbs consistent** across your application
4. **Use meaningful labels** that clearly indicate the page's location
5. **Limit the number of items** to prevent overcrowding (typically 2-5 items)
6. **Make sure translations are available** for all breadcrumb labels
