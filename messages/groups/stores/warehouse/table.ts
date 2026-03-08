import { _m, MessagesGroup } from "@/messages/types";
import { warehouseDialogLocationMessages } from "./dialog-location";

export const warehouseTableMessages = new MessagesGroup({
  name: _m("Name", "الاسم"),
  default: _m("Default", "افتراضي"),
  actions: _m("Actions", "الإجراءات"),
  action: _m("Action", "الإجراء"),
  search: _m("Search...", "البحث..."),
  edit: _m("Edit", "تعديل"),
  delete: _m("Delete", "حذف"),
  add: _m("Add Warehouse", "إضافة مستودع"),
  deleteConfirm: _m(
    "Are you sure you want to delete this warehouse?",
    "هل أنت متأكد من حذف هذا المستودع؟"
  ),

  // Location labels
  location: warehouseDialogLocationMessages,
});
