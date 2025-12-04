import { MessagesGroup, _m } from "@/messages";

export const ContentManagementSystemThemesMessages = new MessagesGroup({
  title: _m("Themes", "الثيمات"),
  noThemes: _m("No themes found", "لم يتم إيجاد ثيمات"),
  // Search and filters
  searchPlaceholder: _m("Search themes...", "ابحث عن ثيم..."),
  category: _m("Category", "الفئة"),
  allCategories: _m("All Categories", "كل الفئات"),
  sortBy: _m("Sort by", "ترتيب"),
  all: _m("All", "الكل"),
  newest: _m("Newest", "الأحدث"),
  oldest: _m("Oldest", "الأقدم"),
  // Theme card
  defaultTheme: _m("Default", "افتراضي"),
  active: _m("Active", "مفعّل"),
  inactive: _m("Inactive", "غير مفعّل"),
  departments: _m("Departments", "الأقسام"),
});
