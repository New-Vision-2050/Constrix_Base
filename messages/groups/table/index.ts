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
  ErrorLoadingOptions: _m("Error loading options", "خطأ في تحميل الخيارات"),
  NoOptionsFound: _m("No options found", "لم يتم العثور على خيارات"),
  Error: _m("Error", "خطأ"),

  // HeadlessTableLayout translations
  Selected: _m("row selected", "صف محدد"),
  SelectedRows: _m("rows selected", "صفوف محددة"),
  SelectedRowsMessage: _m(
    "You have selected multiple rows. You can perform bulk actions on them.",
    "لقد قمت بتحديد عدة صفوف. يمكنك تنفيذ إجراءات مجموعة عليها.",
  ),
  ClearSelection: _m("Clear Selection", "مسح التحديد"),
  Delete: _m("Delete", "حذف"),
  NoData: _m("No data", "لا توجد بيانات"),
  NoDataDescription: _m("There is no data to display", "لا توجد بيانات لعرضها"),
  NoResultsFound: _m("No results found", "لم يتم العثور على نتائج"),
  NoResultsDescription: _m("Try adjusting your filters", "حاول تعديل الفلاتر"),

  // Column Visibility translations
  Columns: _m("Columns", "الأعمدة"),
  ColumnVisibility: _m("Column Visibility", "رؤية الأعمدة"),
  ColumnVisibilityDescription: _m(
    "Showing {visible} of {total} columns",
    "عرض {visible} من {total} عمود",
  ),
  ShowAll: _m("Show All", "إظهار الكل"),
  HideAll: _m("Hide All", "إخفاء الكل"),
  Reset: _m("Reset", "إعادة تعيين"),
  Close: _m("Close", "إغلاق"),

  // Column Pinning translations
  PinColumn: _m("Pin column", "تثبيت العمود"),
  UnpinColumn: _m("Unpin column", "إلغاء تثبيت العمود"),
  PinnedColumnsDescription: _m(
    "Fixed columns: {pinned}/{max}",
    "الأعمدة الثابتة: {pinned}/{max}",
  ),
  MaxPinnedReached: _m(
    "You can fix up to {max} columns",
    "يمكنك تثبيت حتى {max} أعمدة",
  ),
  PinColumnDisabledHidden: _m(
    "Show this column before fixing it",
    "أظهر هذا العمود قبل تثبيته",
  ),

  // Column Order translations
  DragToReorder: _m("Drag to reorder column", "اسحب لإعادة ترتيب العمود"),

  // Column Grouping translations
  NewGroup: _m("New Group", "مجموعة جديدة"),
  AddGroup: _m("Add Group", "إضافة مجموعة"),
  GroupName: _m("Group name", "اسم المجموعة"),
  UngroupColumns: _m("Delete group", "حذف المجموعة"),
  DragToReorderGroup: _m("Drag to reorder group", "اسحب لإعادة ترتيب المجموعة"),
  GroupBackgroundColor: _m("Background color", "لون الخلفية"),
  GroupTextColor: _m("Text color", "لون النص"),
  MoveToGroup: _m("Move to…", "نقل إلى…"),
  Ungrouped: _m("Ungrouped", "بدون مجموعة"),
  EmptyGroupDropHint: _m(
    "Drag columns here",
    "اسحب الأعمدة هنا",
  ),
});
