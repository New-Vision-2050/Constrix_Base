import { MessagesGroup, _m } from "@/messages";

export const ActionsMessages = new MessagesGroup({
  title: _m("Actions", "الإجراءات"),
  editAction: _m("Edit Action", "تعديل الإجراء"),
  addAction: _m("Add Action", "إضافة إجراء"),
  form: new MessagesGroup({
    actionCode: _m("Code", "الرمز"),
    actionCodePlaceholder: _m("Enter code", "أدخل الرمز"),
    actionCodeRequired: _m("Code is required", "الرمز مطلوب"),
    actionDescription: _m("Description", "الوصف"),
    actionDescriptionPlaceholder: _m("Enter description", "أدخل الوصف"),
    actionDescriptionRequired: _m("Description is required", "الوصف مطلوب"),
    updateSuccess: _m(
      "Action updated successfully!",
      "تم تحديث الإجراء بنجاح!"
    ),
    updateError: _m(
      "Failed to update action. Please try again.",
      "فشل تحديث الإجراء. يرجى المحاولة مرة أخرى."
    ),
    createSuccess: _m(
      "Action created successfully!",
      "تم إنشاء الإجراء بنجاح!"
    ),
    createError: _m(
      "Failed to create action. Please try again.",
      "فشل إنشاء الإجراء. يرجى المحاولة مرة أخرى."
    ),
    validationError: _m("Validation error", "خطأ في التحقق من البيانات"),
    save: _m("Save", "حفظ"),
  }),
  table: new MessagesGroup({
    addAction: _m("Add Action", "إضافة إجراء"),
    code: _m("Code", "الرمز"),
    description: _m("Description", "الوصف"),
    actions: _m("Actions", "الإجراءات"),
    action: _m("Action", "الإجراء"),
    show: _m("Show", "عرض"),
    editAction: _m("Edit Action", "تعديل الإجراء"),
    delete: _m("Delete", "حذف"),
    deleteSuccess: _m("Action deleted successfully", "تم حذف الإجراء بنجاح"),
    deleteError: _m("Failed to delete action", "فشل حذف الإجراء"),
    deleteConfirmMessage: _m(
      "Are you sure you want to delete this action?",
      "هل أنت متأكد من حذف هذا الإجراء؟"
    ),
    searchPlaceholder: _m("Search by description or code...", "البحث بالوصف أو الرمز..."),
    reset: _m("Reset", "إعادة تعيين"),
  }),
  details: new MessagesGroup({
    title: _m("Action Details", "تفاصيل الإجراء"),
    actionCode: _m("Code", "الرمز"),
    actionDescription: _m("Description", "الوصف"),
    notFound: _m("Action not found", "لم يتم العثور على الإجراء"),
  }),
});
