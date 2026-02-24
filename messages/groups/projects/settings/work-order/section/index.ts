import { MessagesGroup, _m } from "@/messages";

export const SectionMessages = new MessagesGroup({
  title: _m("Section", "القسم"),
  editSection: _m("Edit Section", "تعديل القسم"),
  addSection: _m("Add Section", "إضافة قسم"),
  electricitySettings: _m("Electricity Settings", "إعدادات الكهرباء"),
  workOrderType: _m("Work Order Type", "نوع أمر العمل"),
  section: _m("Section", "القسم"),
  actions: _m("Actions", "الإجراءات"),
  reportForms: _m("Report Forms", "نماذج التقارير"),
  addTasks: _m("Add Tasks", "إضافة مهام"),
  form: new MessagesGroup({
    sectionCode: _m("Section Code", "كود القسم"),
    sectionCodePlaceholder: _m("Enter section code", "أدخل كود القسم"),
    sectionCodeRequired: _m("Section code is required", "كود القسم مطلوب"),
    sectionDescription: _m("Section Description", "وصف القسم"),
    sectionDescriptionPlaceholder: _m("Enter section description", "أدخل وصف القسم"),
    sectionDescriptionRequired: _m("Section description is required", "وصف القسم مطلوب"),
    updateSuccess: _m(
      "Section updated successfully!",
      "تم تحديث القسم بنجاح!"
    ),
    updateError: _m(
      "Failed to update section. Please try again.",
      "فشل تحديث القسم. يرجى المحاولة مرة أخرى."
    ),
    createSuccess: _m(
      "Section created successfully!",
      "تم إنشاء القسم بنجاح!"
    ),
    createError: _m(
      "Failed to create section. Please try again.",
      "فشل إنشاء القسم. يرجى المحاولة مرة أخرى."
    ),
    validationError: _m("Validation error", "خطأ في التحقق من البيانات"),
    save: _m("Save", "حفظ"),
  }),
  table: new MessagesGroup({
    addSection: _m("Add Section", "إضافة قسم"),
    code: _m("Code", "الكود"),
    description: _m("Description", "الوصف"),
    actions: _m("Actions", "الإجراءات"),
    action: _m("Action", "الإجراء"),
    show: _m("Show", "عرض"),
    editSection: _m("Edit Section", "تعديل القسم"),
    delete: _m("Delete", "حذف"),
    deleteSuccess: _m("Section deleted successfully", "تم حذف القسم بنجاح"),
    deleteError: _m("Failed to delete section", "فشل حذف القسم"),
    deleteConfirmMessage: _m(
      "Are you sure you want to delete this section?",
      "هل أنت متأكد من حذف هذا القسم؟"
    ),
    searchPlaceholder: _m("Search by description or code...", "البحث بالوصف أو الكود..."),
    reset: _m("Reset", "إعادة تعيين"),
  }),
  details: new MessagesGroup({
    title: _m("Section Details", "تفاصيل القسم"),
    sectionCode: _m("Section Code", "كود القسم"),
    sectionDescription: _m("Section Description", "وصف القسم"),
    notFound: _m("Section not found", "لم يتم العثور على القسم"),
  }),
});
