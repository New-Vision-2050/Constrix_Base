import { _m, MessagesGroup } from "@/messages/types";

export const mainCategoriesTableMessages = new MessagesGroup({
  category: _m("Category", "القسم"),
  priority: _m("Priority", "الأولوية"),
  status: _m("Status", "الحالة"),
  actions: _m("Actions", "الإجراءات"),
  action: _m("Action", "الإجراء"),
  search: _m("Search...", "البحث..."),
  reset: _m("Reset", "إعادة تعيين"),
  edit: _m("Edit", "تعديل"),
  image: _m("Image", "صورة"),
  add: _m("Add Category", "إضافة قسم"),
  delete: _m("Delete", "حذف"),
  deleteConfirm: _m("Are you sure you want to delete this category?", "هل أنت متأكد من حذف هذا القسم؟"),
});
