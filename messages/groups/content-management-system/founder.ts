import { MessagesGroup, _m } from "@/messages";

export const ContentManagementSystemFounderMessages = new MessagesGroup({
  addFounder: _m("Add Founder", "إضافة مؤسس"),
  editFounder: _m("Edit Founder", "تعديل مؤسس"),
  areYouSureReactivate: _m(
    "Are you sure you want to reactivate this founder?",
    "هل أنت متأكد أنك تريد إعادة تفعيل هذا المؤسس؟"
  ),
  areYouSureDeactivate: _m(
    "Are you sure you want to deactivate this founder?",
    "هل أنت متأكد أنك تريد إلغاء تفعيل هذا المؤسس؟"
  ),
  success: _m("Success", "نجح"),
  error: _m("Error", "خطأ"),
  activatedSuccessfully: _m(
    "Founder activated successfully",
    "تم تفعيل المؤسس بنجاح"
  ),
  deactivatedSuccessfully: _m(
    "Founder deactivated successfully",
    "تم إلغاء تفعيل المؤسس بنجاح"
  ),
  failedToUpdateStatus: _m(
    "Failed to update founder status. Please try again.",
    "فشل تحديث حالة المؤسس. يرجى المحاولة مرة أخرى."
  ),
  form: new MessagesGroup({
    nameAr: _m("Name (Arabic)", "الاسم (عربي)"),
    nameArPlaceholder: _m("Enter name in Arabic", "أدخل الاسم بالعربية"),
    nameEn: _m("Name (English)", "الاسم (إنجليزي)"),
    nameEnPlaceholder: _m("Enter name in English", "أدخل الاسم بالإنجليزية"),
    nameArRequired: _m("Arabic name is required", "الاسم بالعربية مطلوب"),
    nameArMinLength: _m(
      "Arabic name must be at least 2 characters",
      "الاسم بالعربية يجب أن يكون على الأقل حرفين"
    ),
    nameEnRequired: _m("English name is required", "الاسم بالإنجليزية مطلوب"),
    nameEnMinLength: _m(
      "English name must be at least 2 characters",
      "الاسم بالإنجليزية يجب أن يكون على الأقل حرفين"
    ),
    jobTitleAr: _m("Job Title (Arabic)", "المسمى الوظيفي (عربي)"),
    jobTitleArPlaceholder: _m(
      "Enter job title in Arabic",
      "أدخل المسمى الوظيفي بالعربية"
    ),
    jobTitleEn: _m("Job Title (English)", "المسمى الوظيفي (إنجليزي)"),
    jobTitleEnPlaceholder: _m(
      "Enter job title in English",
      "أدخل المسمى الوظيفي بالإنجليزية"
    ),
    jobTitleArRequired: _m(
      "Arabic job title is required",
      "المسمى الوظيفي بالعربية مطلوب"
    ),
    jobTitleArMinLength: _m(
      "Arabic job title must be at least 2 characters",
      "المسمى الوظيفي بالعربية يجب أن يكون على الأقل حرفين"
    ),
    jobTitleEnRequired: _m(
      "English job title is required",
      "المسمى الوظيفي بالإنجليزية مطلوب"
    ),
    jobTitleEnMinLength: _m(
      "English job title must be at least 2 characters",
      "المسمى الوظيفي بالإنجليزية يجب أن يكون على الأقل حرفين"
    ),
    descriptionAr: _m("Description (Arabic)", "الوصف (عربي)"),
    descriptionArPlaceholder: _m(
      "Enter description in Arabic",
      "أدخل الوصف بالعربية"
    ),
    descriptionEn: _m("Description (English)", "الوصف (إنجليزي)"),
    descriptionEnPlaceholder: _m(
      "Enter description in English",
      "أدخل الوصف بالإنجليزية"
    ),
    descriptionArRequired: _m(
      "Arabic description is required",
      "الوصف بالعربية مطلوب"
    ),
    descriptionEnRequired: _m(
      "English description is required",
      "الوصف بالإنجليزية مطلوب"
    ),
    profileImage: _m("Profile Image", "صورة الملف الشخصي"),
    profileImageRequired: _m(
      "Profile image is required",
      "صورة الملف الشخصي مطلوبة"
    ),
    imageMaxSize: _m("Max image size: 2MB", "اقصى حجم الصورة : 2 ميجابايت"),
    imageDimensions: _m("2160x2160", "2160x2160"),
    updateSuccess: _m(
      "Founder updated successfully!",
      "تم تحديث المؤسس بنجاح!"
    ),
    updateError: _m(
      "Failed to update founder. Please try again.",
      "فشل تحديث المؤسس. يرجى المحاولة مرة أخرى."
    ),
    createSuccess: _m(
      "Founder created successfully!",
      "تم إنشاء المؤسس بنجاح!"
    ),
    createError: _m(
      "Failed to create founder. Please try again.",
      "فشل إنشاء المؤسس. يرجى المحاولة مرة أخرى."
    ),
    validationError: _m("Validation error", "خطأ في التحقق من البيانات"),
    save: _m("Save", "حفظ"),
  }),
  table: new MessagesGroup({
    name: _m("Name", "الاسم"),
    jobTitle: _m("Job Title", "المسمى الوظيفي"),
    description: _m("Description", "الوصف"),
    status: _m("Status", "الحالة"),
    active: _m("Active", "نشط"),
    inactive: _m("Inactive", "غير نشط"),
    actions: _m("Actions", "الإجراءات"),
    action: _m("Action", "الإجراء"),
    editFounder: _m("Edit Founder", "تعديل مؤسس"),
    delete: _m("Delete", "حذف"),
    deleteSuccess: _m("Founder deleted successfully", "تم حذف المؤسس بنجاح"),
    deleteError: _m("Failed to delete founder", "فشل حذف المؤسس"),
    deleteConfirmMessage: _m(
      "Are you sure you want to delete this founder?",
      "هل أنت متأكد من حذف هذا المؤسس؟"
    ),
    searchPlaceholder: _m("Search by name or job title...", "البحث بالاسم أو المسمى الوظيفي..."),
    reset: _m("Reset", "إعادة تعيين"),
  }),
  title: _m("Founders", "المؤسسون"),
});
