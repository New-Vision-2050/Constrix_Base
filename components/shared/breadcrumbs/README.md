# Breadcrumbs Component

Custom Breadcrumbs component for Next.js App Router with i18n support.

## Features

* ✅ Compatible with Next.js App Router
* ✅ Support for multilingual content (Arabic and English)
* ✅ Automatic transformation of URL paths to readable labels
* ✅ Customization support using routes map
* ✅ Right-to-Left (RTL) direction support
* ✅ ID detection and substitution with localized "Details" label
* ✅ i18n integration with next-intl
* ✅ Super Entity Slug detection and automatic disabling

## Usage

### Basic Usage

```tsx
import Breadcrumbs from "@/components/shared/breadcrumbs";

export default function MyPage() {
  return (
    <header>
      <Breadcrumbs />
    </header>
  );
}
```

### Customization using Routes Map and Translation

```tsx
import Breadcrumbs, { getRoutesMap } from "@/components/shared/breadcrumbs";
import { useLocale, useTranslations } from "next-intl";

export default function MyPage() {
  const locale = useLocale();
  const t = useTranslations("breadcrumbs");
  const routesMap = getRoutesMap(locale, t);
  
  return (
    <header>
      <Breadcrumbs routesMap={routesMap} />
    </header>
  );
}
```

### Using Custom Routes Map

```tsx
import Breadcrumbs from "@/components/shared/breadcrumbs";
import type { RoutesMap } from "@/components/shared/breadcrumbs";

const customRoutesMap: RoutesMap = {
  "dashboard": "Dashboard",
  "settings": {
    label: "Settings",
    href: "/custom-settings-path"
  },
  "users/profile": "User Profile"
};

export default function MyPage() {
  return (
    <header>
      <Breadcrumbs routesMap={customRoutesMap} />
    </header>
  );
}
```

## Options and Properties

| Property | Type | Description |
|----------|------|-------------|
| `homeLabel` | `string` | Text to display for the home page (optional) |
| `className` | `string` | Additional CSS classes for the component (optional) |
| `routesMap` | `RoutesMap` | Map to customize route names and links (optional) |

## Routes Map

The component supports three types of values in the routes map:

1. **Simple text value**: Used as a label for the route.
   ```tsx
   { "dashboard": "Dashboard" }
   ```

2. **Object with label**: Uses the label while keeping the original link.
   ```tsx
   { "settings": { label: "Settings" } }
   ```

3. **Object with label and href**: Uses both the custom label and custom link.
   ```tsx
   { "users": { label: "Users", href: "/admin/all-users" } }
   ```

## Using Routes Map with Localization

The component provides a `getRoutesMap` function to get the appropriate routes map for the current language:

```tsx
import { getRoutesMap } from "@/components/shared/breadcrumbs";
import { useLocale, useTranslations } from "next-intl";

// Usage in a page component
const locale = useLocale();  // "ar" or "en"
const t = useTranslations("breadcrumbs");
const routesMap = getRoutesMap(locale, t);
```

## ID Handling

The breadcrumbs component automatically detects UUID and other ID-like segments in the path and replaces them with a generic "Details" label, localized based on the current language. This is handled using translation keys from your localization files:

```json
// en.json
{
  "breadcrumbs": {
    "details": "Details",
    // other breadcrumb translations...
  }
}

// ar.json
{
  "breadcrumbs": {
    "details": "التفاصيل",
    // other breadcrumb translations...
  }
}
```

## Customizing Routes Map

You can modify the existing maps in `routes-map.ts` or create your own custom maps:

```tsx
// Create a custom routes map
const myCustomRoutesMap: RoutesMap = {
  // Simple routes
  "dashboard": "Dashboard",
  "reports": "Reports",
  
  // Nested routes
  "settings/users": "User Management",
  
  // Routes with custom links
  "profile": { 
    label: "My Profile", 
    href: "/me" 
  }
};
```

## Disabled Segments Handling

The breadcrumbs component automatically detects and disables navigation for segments that match:
1. Values in `SUPER_ENTITY_SLUG` constants
2. Custom segments defined in `disabled-list.ts`

These segments will appear as disabled (non-clickable) text with reduced opacity.

### Super Entity Slugs

The following URL segments are automatically disabled:

- `companies` - Company management
- `users` - User management  
- `settings` - System settings
- `human-resources` - HR management
- `program-management` - Program management
- `powers` - Powers/Permissions
- `ecommerce` - E-commerce
- `client-relations` - CRM
- `stores` - Store management
- `library-docs` - Document library

### Custom Disabled Segments

You can add additional segments to be disabled by editing the `disabled-list.ts` file:

```typescript
// components/shared/breadcrumbs/disabled-list.ts
export const DISABLED_BREADCRUMB_SEGMENTS: string[] = [
  "analytics",    // Disable analytics pages
  "reports",      // Disable reports pages  
  "admin",        // Disable admin pages
  "api",          // Disable API routes
  "dashboard",    // Disable dashboard
  // Add more segments as needed...
];
```

### Visual Styling

Disabled breadcrumb items have the following styling:
- Gray color (`text-gray-400`)
- Not-allowed cursor (`cursor-not-allowed`)
- Reduced opacity (`opacity-60`)
- No hover effects
- Not clickable

### Example

For a URL like `/ar/companies/123/settings`, the breadcrumbs would display:
- **الرئيسية** (clickable home link)
- **الشركات** (disabled, gray text)
- **التفاصيل** (clickable details link)
- **الإعدادات** (disabled, gray text)
