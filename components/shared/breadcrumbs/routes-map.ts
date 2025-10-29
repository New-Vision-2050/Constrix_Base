/**
 * Data type for each route in the routes map
 */
interface RouteMapItem {
  label: string; // Text to display for the route
  href?: string; // Optional: Custom URL for the link
}

/**
 * Data type for the complete routes map
 */
export interface RoutesMap {
  [key: string]: RouteMapItem | string; // Can be a text value (label shorthand) or a RouteMapItem object
}

/**
 * Function to get the routes map based on language
 * @param locale language code
 * @returns appropriate routes map for the language
 */
export const getRoutesMap = (
  locale: string,
  t: (key: string) => string
): RoutesMap => {
  const getText = (key: string, defaultText: string) => {
    return t ? t(key) : defaultText;
  };

  const appRoutesMap: RoutesMap = {
    // Main routes (example: dashboard)
    dashboard: {
      label: getText("dashboard", "الرئيسية"),
      href: `/${locale}/dashboard`,
    },
    profile: getText("profile", "الملف الشخصي"),
    settings: getText("settings", "الإعدادات"),

    // HR routes
    "hr-settings": {
      label: getText("hr-settings", "إعدادات الموارد البشرية"),
      href: `/${locale}/hr-settings`,
    },
    "attendance-determinants": getText(
      "attendance-determinants",
      "إعدادات الحضور والانصراف"
    ),
    "attendance-departure": getText("attendance-departure", "الحضور والانصراف"),

    // User routes
    users: getText("users", "المستخدمين"),
    "users/list": getText("users/list", "قائمة المستخدمين"),
    "users/permissions": getText("users/permissions", "صلاحيات المستخدم"),

    // Products
    products: getText("products", "المنتجات"),
    "products/categories": getText("products/categories", "فئات المنتجات"),

    // Reports
    reports: {
      label: getText("reports", "التقارير"),
      href: `/${locale}/analytics/reports`,
    },

    // Examples of compound routes
    "hr-settings/attendance-determinants": getText(
      "hr-settings/attendance-determinants",
      "إعدادات الحضور والانصراف"
    ),
    "hr-settings/attendance-determinants/create": getText(
      "hr-settings/attendance-determinants/create",
      "إنشاء حضور جديد"
    ),
    "activities-logs": getText("activities-logs", "سجل الأنشطة"),
    bouquet: getText("bouquet", "الباقة"),
    bouquetDetails: getText("bouquetDetails", "تفاصيل الباقة"),
    companies: getText("companies", "الشركات"),
    "company-profile": getText("company-profile", "ملف الشركة"),
    "crm-settings": getText("crm-settings", "إعدادات CRM"),
    "docs-library": getText("docs-library", "مكتبة المستندات"),
    "human-resources": getText("human-resources", "الموارد البشرية"),
    "organizational-structure": getText(
      "organizational-structure",
      "هيكل المنظمة"
    ),
    permissions: getText("permissions", "صلاحيات"),
    programs: getText("programs", "البرامج"),
    roles: getText("roles", "الصلاحيات"),
    stores: getText("stores", "المتجر"),
    "user-profile": getText("user-profile", "ملف المستخدم"),
    "view-my-permissions": getText("view-my-permissions", "عرض صلاحياتي"),
    "users-settings": getText("users-settings", "إعدادات المستخدم"),

    // Store routes
    brands: getText("brands", "العلامات التجارية"),
    warehouse: getText("warehouse", "المخازن"),
    categories: getText("categories", "الأقسام"),
    requests: getText("requests", "الطلبات"),
    coupons: getText("coupons", "الكوبونات"),
    discounts: getText("discounts", "الخصومات"),
    "social-media": getText("social-media", "وسائل التواصل الاجتماعي"),
    "pages-setting": getText("pages-setting", "إعدادات الصفحات"),
    terms: getText("terms", "الشروط والأحكام"),

    // Nested store routes
    "stores/products": getText("stores/products", "المنتجات"),
    "stores/requests": getText("stores/requests", "الطلبات"),
    "stores/coupons": getText("stores/coupons", "الكوبونات"),
  };

  return appRoutesMap;
};

export default getRoutesMap;
