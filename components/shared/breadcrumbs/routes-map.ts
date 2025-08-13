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
  };

  return appRoutesMap;
};

export default getRoutesMap;
