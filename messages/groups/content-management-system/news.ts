import { MessagesGroup, _m } from "@/messages";

export const ContentManagementSystemNewsMessages = new MessagesGroup({
  addNews: _m("Add News", "إضافة خبر"),
  editNews: _m("Edit News", "تعديل خبر"),
  areYouSureReactivate: _m(
    "Are you sure you want to reactivate this news?",
    "هل أنت متأكد أنك تريد إعادة تفعيل هذا الخبر؟"
  ),
  areYouSureDeactivate: _m(
    "Are you sure you want to deactivate this news?",
    "هل أنت متأكد أنك تريد إلغاء تفعيل هذا الخبر؟"
  ),
  success: _m("Success", "نجح"),
  error: _m("Error", "خطأ"),
  activatedSuccessfully: _m(
    "News activated successfully",
    "تم تفعيل الخبر بنجاح"
  ),
  deactivatedSuccessfully: _m(
    "News deactivated successfully",
    "تم إلغاء تفعيل الخبر بنجاح"
  ),
  failedToUpdateStatus: _m(
    "Failed to update news status. Please try again.",
    "فشل تحديث حالة الخبر. يرجى المحاولة مرة أخرى."
  ),
  form: new MessagesGroup({
    titleAr: _m("Title (Arabic)", "العنوان (عربي)"),
    titleArRequired: _m("Arabic title is required", "العنوان بالعربية مطلوب"),
    titleArMinLength: _m(
      "Arabic title must be at least 2 characters",
      "العنوان بالعربية يجب أن يكون على الأقل حرفين"
    ),
    titleEn: _m("Title (English)", "العنوان (إنجليزي)"),
    titleEnRequired: _m(
      "English title is required",
      "العنوان بالإنجليزية مطلوب"
    ),
    titleEnMinLength: _m(
      "English title must be at least 2 characters",
      "العنوان بالإنجليزية يجب أن يكون على الأقل حرفين"
    ),
    contentAr: _m("Content (Arabic)", "المحتوى (عربي)"),
    contentArRequired: _m(
      "Arabic content is required",
      "المحتوى بالعربية مطلوب"
    ),
    contentEn: _m("Content (English)", "المحتوى (إنجليزي)"),
    contentEnRequired: _m(
      "English content is required",
      "المحتوى بالإنجليزية مطلوب"
    ),
    category: _m("Category", "الفئة"),
    categoryRequired: _m("Category is required", "الفئة مطلوبة"),
    categoryPlaceholder: _m("Select category", "اختر الفئة"),
    publishDate: _m("Publish Date", "تاريخ النشر"),
    publishDateRequired: _m("Publish date is required", "تاريخ النشر مطلوب"),
    endDate: _m("End Date", "تاريخ الانتهاء"),
    endDateRequired: _m("End date is required", "تاريخ الانتهاء مطلوب"),
    thumbnailImage: _m("Thumbnail Image", "صورة مصغرة"),
    thumbnailImageRequired: _m(
      "Thumbnail image is required",
      "الصورة المصغرة مطلوبة"
    ),
    mainImage: _m("Main Image", "الصورة الرئيسية"),
    mainImageRequired: _m("Main image is required", "الصورة الرئيسية مطلوبة"),
    imagesRequired: _m(
      "Both thumbnail and main images are required",
      "الصورة المصغرة والصورة الرئيسية مطلوبتان"
    ),
    imageMaxSize: _m("Max image size: 3MB", "اقصى حجم الصورة : 3 ميجابايت"),
    imageDimensions: _m("2160x2160", "2160x2160"),
    updateSuccess: _m("News updated successfully!", "تم تحديث الخبر بنجاح!"),
    updateError: _m(
      "Failed to update news. Please try again.",
      "فشل تحديث الخبر. يرجى المحاولة مرة أخرى."
    ),
    createSuccess: _m("News created successfully!", "تم إنشاء الخبر بنجاح!"),
    createError: _m(
      "Failed to create news. Please try again.",
      "فشل إنشاء الخبر. يرجى المحاولة مرة أخرى."
    ),
    validationError: _m("Validation error", "خطأ في التحقق من البيانات"),
    save: _m("Save", "حفظ"),
  }),
  table: new MessagesGroup({
    title: _m("Title", "العنوان"),
    content: _m("Content", "المحتوى"),
    category: _m("Category", "الفئة"),
    publishDate: _m("Publish Date", "تاريخ النشر"),
    endDate: _m("End Date", "تاريخ الانتهاء"),
    status: _m("Status", "الحالة"),
    actions: _m("Actions", "الإجراءات"),
    editNews: _m("Edit News", "تعديل خبر"),
    deleteConfirmMessage: _m(
      "Are you sure you want to delete this news?",
      "هل أنت متأكد أنك تريد حذف هذا الخبر؟"
    ),
    deleteConfirm: _m("Delete", "حذف"),
    cancelconfirm: _m("Cancel", "إلغاء"
    ),  
  }),
});
