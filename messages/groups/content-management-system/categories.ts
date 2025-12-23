import { MessagesGroup, _m } from "@/messages";

export const ContentManagementSystemCategoriesMessages = new MessagesGroup({
  title: _m("Categories Settings", "اعدادات الفئات"),
  addCategory: _m("Add New Category", "اضافة فئة جديدة"),
  editCategory: _m("Edit Category", "تعديل فئة"),
  form: new MessagesGroup({
    updateSuccess: _m("Update successful!", "تم التحديث بنجاح!"),
    updateError: _m("Update failed. Please try again.", "فشل التحديث. يرجى المحاولة مرة أخرى."),
    createSuccess: _m("Create successful!", "تم الإنشاء بنجاح!"),
    createError: _m("Create failed. Please try again.", "فشل الإنشاء. يرجى المحاولة مرة أخرى."),
    validationError: _m("Validation error", "خطأ في التحقق من البيانات"),
    permissionDenied: _m("You don't have permission to perform this action", "ليس لديك صلاحية لإجراء هذا الإجراء"),
    networkError: _m("Network error. Please try again.", "خطأ في الشبكة. يرجى المحاولة مرة أخرى."),
    editCategory: _m("Edit Category", "تعديل فئة"),
    addCategory: _m("Add Category", "اضافة فئة"),
    nameAr: _m("Category Name in Arabic", "اسم الفئة بالعربية"),
    nameArPlaceholder: _m("Enter category name in Arabic", "أدخل اسم الفئة بالعربية"),
    nameArRequired: _m("Category name in Arabic is required", "اسم الفئة بالعربية مطلوب"),
    nameArMinLength: _m("Category name in Arabic must be at least 2 characters", "اسم الفئة بالعربية يجب أن يكون على الأقل حرفين"),
    nameEn: _m("Category Name in English", "اسم الفئة بالإنجليزية"),
    nameEnPlaceholder: _m("Enter category name in English", "أدخل اسم الفئة بالإنجليزية"),
    nameEnRequired: _m("Category name in English is required", "اسم الفئة بالإنجليزية مطلوب"),
    nameEnMinLength: _m("Category name in English must be at least 2 characters", "اسم الفئة بالإنجليزية يجب أن يكون على الأقل حرفين"),
    type: _m("Category Type", "نوع الفئة"),
    typeRequired: _m("Category type is required", "نوع الفئة مطلوب"),
    typePlaceholder: _m("Select category type", "اختر نوع الفئة"),
    save: _m("Save", "حفظ"),
    cancel: _m("Cancel", "إلغاء"),
  }),
  table: new MessagesGroup({
    nameAr: _m("Category Name in Arabic", "اسم الفئة بالعربية"),
    nameEn: _m("Category Name in English", "اسم الفئة بالإنجليزية"),
    type: _m("Category Type", "نوع الفئة"),
    searchType:_m("Type", "النوع"),
    edit: _m("Edit", "تعديل"),
  }),
});

