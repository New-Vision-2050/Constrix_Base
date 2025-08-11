# Breadcrumbs Component

مكون فتات الخبز (Breadcrumbs) المخصص لـ Next.js App Router مع دعم التخصيص والترجمة.

## الميزات

* ✅ متوافق مع Next.js App Router
* ✅ دعم للتعدد اللغوي (العربية والإنجليزية)
* ✅ تحويل تلقائي لمسارات URL إلى عناوين مقروءة
* ✅ دعم التخصيص باستخدام خريطة المسارات
* ✅ دعم الاتجاه من اليمين إلى اليسار (RTL)

## طريقة الاستخدام

### الاستخدام الأساسي

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

### التخصيص باستخدام خريطة المسارات

```tsx
import Breadcrumbs, { getRoutesMap } from "@/components/shared/breadcrumbs";
import { useLocale } from "next-intl";

export default function MyPage() {
  const locale = useLocale();
  const routesMap = getRoutesMap(locale);
  
  return (
    <header>
      <Breadcrumbs routesMap={routesMap} />
    </header>
  );
}
```

### استخدام خريطة مسارات مخصصة

```tsx
import Breadcrumbs from "@/components/shared/breadcrumbs";
import type { RoutesMap } from "@/components/shared/breadcrumbs";

const customRoutesMap: RoutesMap = {
  "dashboard": "لوحة التحكم",
  "settings": {
    label: "الإعدادات",
    href: "/custom-settings-path"
  },
  "users/profile": "الملف الشخصي"
};

export default function MyPage() {
  return (
    <header>
      <Breadcrumbs routesMap={customRoutesMap} />
    </header>
  );
}
```

## الخيارات والخصائص

| الخاصية | النوع | الوصف |
|----------|------|-------------|
| `homeLabel` | `string` | النص المعروض للصفحة الرئيسية (اختياري) |
| `className` | `string` | فئات CSS إضافية للمكون (اختياري) |
| `routesMap` | `RoutesMap` | خريطة لتخصيص أسماء وروابط المسارات (اختياري) |

## خريطة المسارات

يدعم المكون ثلاثة أنواع من القيم في خريطة المسارات:

1. **قيمة نصية بسيطة**: يتم استخدامها كعنوان للمسار.
   ```tsx
   { "dashboard": "لوحة التحكم" }
   ```

2. **كائن مع عنوان**: يتم استخدام العنوان مع الحفاظ على الرابط الأصلي.
   ```tsx
   { "settings": { label: "الإعدادات" } }
   ```

3. **كائن مع عنوان ورابط**: يتم استخدام العنوان والرابط المخصص.
   ```tsx
   { "users": { label: "المستخدمون", href: "/admin/all-users" } }
   ```

## استخدام خريطة المسارات حسب اللغة

يوفر المكون وظيفة `getRoutesMap` للحصول على خريطة المسارات المناسبة للغة الحالية:

```tsx
import { getRoutesMap } from "@/components/shared/breadcrumbs";

// استخدام في مكون الصفحة
const locale = useLocale();  // "ar" أو "en"
const routesMap = getRoutesMap(locale);
```

## تخصيص خريطة المسارات

يمكنك تعديل الخرائط الموجودة في ملف `routes-map.ts` أو إنشاء خرائط مخصصة خاصة بك:

```tsx
// إنشاء خريطة مسارات مخصصة
const myCustomRoutesMap: RoutesMap = {
  // مسارات بسيطة
  "dashboard": "لوحة القيادة",
  "reports": "التقارير",
  
  // مسارات متداخلة
  "settings/users": "إدارة المستخدمين",
  
  // مسارات مع روابط مخصصة
  "profile": { 
    label: "الملف الشخصي", 
    href: "/me" 
  }
};
```
