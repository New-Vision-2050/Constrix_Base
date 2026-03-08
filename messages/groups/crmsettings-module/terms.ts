import { _m, MessagesGroup } from "../../types";

export const termsMessages = new MessagesGroup({
  // Page Title
  pageTitle: _m("Terms Settings", "إعدادات البنود"),
  
  // Table Headers
  table: new MessagesGroup({
    referenceNumber: _m("Reference Number", "الرقم المرجعي"),
    name: _m("Term Name", "اسم البند"),
    description: _m("Description", "وصف البند"),
    childrenCount: _m("Sub-items Count", "عدد البنود الفرعية"),
    services: _m("Term Services", "خدمات البند"),
    status: _m("Activate Term", "تفعيل البند"),
    actions: _m("Actions", "إجراءات"),
    active: _m("Active", "نشط"),
    inactive: _m("Inactive", "غير نشط"),
  }),
  
  // Actions
  actions: new MessagesGroup({
    add: _m("Add New", "إضافة جديد"),
    addMainTerm: _m("Add Main Term", "إضافة بند رئيسي"),
    addSubTerm: _m("Add Sub Term", "إضافة بند فرعي"),
    edit: _m("Edit", "تعديل"),
    delete: _m("Delete", "حذف"),
    view: _m("View", "عرض"),
    selectServices: _m("Select Services", "اختر الخدمات"),
    viewTable: _m("View Table", "عرض الجدول"),
  }),
  
  // Dialog Titles
  dialog: new MessagesGroup({
    addTitle: _m("Add Main Term", "إضافة بند رئيسي"),
    editTitle: _m("Edit Main Term", "تعديل البند الرئيسي"),
    itemActions: _m("Term Actions", "إجراءات البند"),
    deleteConfirm: _m("Are you sure you want to delete this term?", "هل أنت متأكد من حذف هذا البند؟"),
  }),
  
  // Form Labels
  form: new MessagesGroup({
    name: _m("Term Name", "اسم البند"),
    namePlaceholder: _m("Enter term name", "أدخل اسم البند"),
    description: _m("Term Description", "وصف البند"),
    descriptionPlaceholder: _m("Enter term description", "أدخل وصف البند"),
    services: _m("Services", "الخدمات"),
    selectService: _m("Select service", "اختر الخدمة"),
    save: _m("Save", "حفظ"),
    cancel: _m("Cancel", "إلغاء"),
    update: _m("Update", "تحديث"),
  }),
  
  // Validation Messages
  validation: new MessagesGroup({
    nameRequired: _m("Term name is required", "اسم البند مطلوب"),
    servicesRequired: _m("At least one service must be selected", "يجب اختيار خدمة واحدة على الأقل"),
    validationError: _m("Validation error", "خطأ في التحقق من البيانات"),
  }),
  
  // Success Messages
  success: new MessagesGroup({
    created: _m("Term created successfully", "تم إضافة البند بنجاح"),
    updated: _m("Term updated successfully", "تم تحديث البند بنجاح"),
    deleted: _m("Term deleted successfully", "تم حذف البند بنجاح"),
    servicesUpdated: _m("Services updated successfully", "تم تحديث الخدمات بنجاح"),
    statusActivated: _m("Term activated successfully", "تم تفعيل البند بنجاح"),
    statusDeactivated: _m("Term deactivated successfully", "تم إلغاء تفعيل البند بنجاح"),
  }),
  
  // Error Messages
  error: new MessagesGroup({
    createFailed: _m("Error creating term", "حدث خطأ أثناء إضافة البند"),
    updateFailed: _m("Error updating term", "حدث خطأ أثناء تحديث البند"),
    deleteFailed: _m("Error deleting term", "حدث خطأ أثناء حذف البند"),
    servicesUpdateFailed: _m("Error updating services", "حدث خطأ أثناء تحديث الخدمات"),
    statusUpdateFailed: _m("Error updating term status", "حدث خطأ أثناء تحديث حالة البند"),
    fetchFailed: _m("Error fetching data", "حدث خطأ أثناء جلب البيانات"),
  }),
});
