import { _m, MessagesGroup } from "../../types";

export const roleTypesMessages = new MessagesGroup({
  all: _m("Grant all permissions", "منح جميع الصلاحيات"),
  update: _m("Update", "تعديل"),
  import: _m("Import", "استيراد"),
  export: _m("Export", "تصدير"),
  list: _m("List", "عرض"),
  create: _m("Create", "إضافة"),
  delete: _m("Delete", "حذف"),
  view: _m("View", "تفاصيل"),
  activate: _m("Activate", "تنشيط")
});
