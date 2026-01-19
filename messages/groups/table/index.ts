import { _m, MessagesGroup } from "../../types";

export const tableMessages = new MessagesGroup({
  Export: _m("Export", "تصدير"),
  ExportAsCSV: _m("Export as CSV", "تصدير كـ CSV"),
  ExportAsJSON: _m("Export as JSON", "تصدير كـ JSON"),
  ExportSuccess: _m("Export successful", "تم التصدير بنجاح"),
  ExportFailed: _m("Export failed", "فشل التصدير"),
  ItemsExported: _m("items exported", "عناصر تم تصديرها"),
  FilterSearch: _m("Filter Search", "فلتر البحث"),
  RowsPerPage: _m("Rows per page:", "الصفوف لكل صفحة :"),
  Search: _m("Search", "بحث"),
  Actions: _m("Actions", "الاجراء"),
  ToggleColumns: _m("Toggle visible columns", "تبديل الأعمدة المرئية"),
  VisibleColumns: _m("Visible Columns", "الأعمدة المرئية"),
  From: _m("From", "من"),
  To: _m("To", "إلى"),
  Minimal: _m("Minimal", "الحد الأدنى"),
  All: _m("All", "الكل"),
  Searching: _m("Searching...", "جاري البحث..."),
  LoadingOptions: _m("Loading options...", "جاري تحميل الخيارات..."),
  Error: _m("Error", "خطأ"),

  // HeadlessTableLayout translations
  Selected: _m("selected", "محدد"),
  ClearSelection: _m("Clear Selection", "مسح التحديد"),
  Delete: _m("Delete", "حذف"),
  NoData: _m("No data", "لا توجد بيانات"),
  NoDataDescription: _m("There is no data to display", "لا توجد بيانات لعرضها"),
  NoResultsFound: _m("No results found", "لم يتم العثور على نتائج"),
  NoResultsDescription: _m("Try adjusting your filters", "حاول تعديل الفلاتر"),
});
