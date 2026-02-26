import { MessagesGroup, _m } from "@/messages";

export const CrmSettingsTermsMessages = new MessagesGroup({
  addTerm: _m("Add Term", "إضافة بند"),
  editTerm: _m("Edit Term", "تعديل بند"),
  viewTerm: _m("View Term", "عرض بند"),
  deleteTerm: _m("Delete Term", "حذف بند"),
  areYouSureDelete: _m(
    "Are you sure you want to delete this term?",
    "هل أنت متأكد أنك تريد حذف هذا البند؟"
  ),
  success: _m("Success", "نجح"),
  error: _m("Error", "خطأ"),
  activatedSuccessfully: _m(
    "Term activated successfully",
    "تم تفعيل البند بنجاح"
  ),
  deactivatedSuccessfully: _m(
    "Term deactivated successfully",
    "تم إلغاء تفعيل البند بنجاح"
  ),
  failedToUpdateStatus: _m(
    "Failed to update term status. Please try again.",
    "فشل تحديث حالة البند. يرجى المحاولة مرة أخرى."
  ),
  form: new MessagesGroup({
    name: _m("Term Name", "اسم البند"),
    namePlaceholder: _m("Enter term name", "أدخل اسم البند"),
    nameRequired: _m("Term name is required", "اسم البند مطلوب"),
    description: _m("Description", "الوصف"),
    descriptionPlaceholder: _m("Enter description", "أدخل الوصف"),
    services: _m("Services", "الخدمات"),
    selectServices: _m("Select Services", "اختر الخدمات"),
    projectType: _m("Project Type", "نوع المشروع"),
    selectProjectType: _m("Select Project Type", "اختر نوع المشروع"),
    parentTerm: _m("Parent Term", "البند الأصل"),
    selectParentTerm: _m("Select Parent Term", "اختر البند الأصل"),
    updateSuccess: _m(
      "Term updated successfully!",
      "تم تحديث البند بنجاح!"
    ),
    updateError: _m(
      "Failed to update term. Please try again.",
      "فشل تحديث البند. يرجى المحاولة مرة أخرى."
    ),
    createSuccess: _m(
      "Term created successfully!",
      "تم إنشاء البند بنجاح!"
    ),
    createError: _m(
      "Failed to create term. Please try again.",
      "فشل إنشاء البند. يرجى المحاولة مرة أخرى."
    ),
    deleteSuccess: _m(
      "Term deleted successfully!",
      "تم حذف البند بنجاح!"
    ),
    deleteError: _m(
      "Failed to delete term. Please try again.",
      "فشل حذف البند. يرجى المحاولة مرة أخرى."
    ),
    validationError: _m("Validation error", "خطأ في التحقق من البيانات"),
    save: _m("Save", "حفظ"),
    cancel: _m("Cancel", "إلغاء"),
    loadingServices: _m("Loading services...", "جاري تحميل الخدمات..."),
  }),
  table: new MessagesGroup({
    addTerm: _m("Add Term", "إضافة بند"),
    id: _m("ID", "الرقم"),
    name: _m("Term Name", "اسم البند"),
    description: _m("Description", "الوصف"),
    childrenCount: _m("Sub-items Count", "عدد البنود الفرعية"),
    servicesCount: _m("Services Count", "عدد الخدمات"),
    status: _m("Status", "الحالة"),
    active: _m("Active", "نشط"),
    inactive: _m("Inactive", "غير نشط"),
    actions: _m("Actions", "الإجراءات"),
    action: _m("Action", "الإجراء"),
    edit: _m("Edit", "تعديل"),
    delete: _m("Delete", "حذف"),
    view: _m("View", "عرض"),
    searchPlaceholder: _m("Search by name or description...", "البحث بالاسم أو الوصف..."),
    loading: _m("Loading...", "جاري التحميل..."),
    mainItems: _m("Main Items", "بنود رئيسية"),
  }),
  title: _m("Term Settings", "إعدادات البنود"),
});
