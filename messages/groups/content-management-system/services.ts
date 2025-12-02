import { MessagesGroup, _m } from "@/messages";

export const ContentManagementSystemServicesMessages = new MessagesGroup({
  addService: _m("Add Service", "إضافة خدمة"),
  editService: _m("Edit Service", "تعديل خدمة"),
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
    category: _m("Category", "الفئة"),
    categoryPlaceholder: _m("Select category", "اختر الفئة"),
    categoryRequired: _m("Category is required", "الفئة مطلوبة"),
    descriptionAr: _m("Description (Arabic)", "الوصف (عربي)"),
    descriptionArPlaceholder: _m(
      "Enter description in Arabic",
      "أدخل الوصف بالعربية"
    ),
    descriptionArRequired: _m(
      "Arabic description is required",
      "الوصف بالعربية مطلوب"
    ),
    descriptionArMinLength: _m(
      "Arabic description must be at least 10 characters",
      "الوصف بالعربية يجب أن يكون على الأقل 10 أحرف"
    ),
    descriptionEn: _m("Description (English)", "الوصف (إنجليزي)"),
    descriptionEnPlaceholder: _m(
      "Enter description in English",
      "أدخل الوصف بالإنجليزية"
    ),
    descriptionEnRequired: _m(
      "English description is required",
      "الوصف بالإنجليزية مطلوب"
    ),
    descriptionEnMinLength: _m(
      "English description must be at least 10 characters",
      "الوصف بالإنجليزية يجب أن يكون على الأقل 10 أحرف"
    ),
    requestId: _m("Request ID", "رقم الطلب"),
    requestIdPlaceholder: _m(
      "Enter request ID (optional)",
      "أدخل رقم الطلب (اختياري)"
    ),
    iconImage: _m("Icon Image", "صورة الأيقونة"),
    iconImageRequired: _m("Icon image is required", "صورة الأيقونة مطلوبة"),
    mainImage: _m("Main Image", "الصورة الرئيسية"),
    mainImageRequired: _m("Main image is required", "الصورة الرئيسية مطلوبة"),
    featuredServicesTitle: _m(
      "Featured service (show on homepage)",
      "خدمة مميزة (عرض في الصفحة الرئيسية)"
    ),
    previousWork: _m("Previous Work", "عمل سابق"),
    previousWorkImage: _m("Previous Work Image", "صورة العمل السابق"),
    previousWorkDescription: _m("Description", "الوصف"),
    previousWorkDescriptionPlaceholder: _m(
      "Enter description of previous work",
      "أدخل وصف العمل السابق"
    ),
    previousWorkDescriptionRequired: _m(
      "Description is required",
      "الوصف مطلوب"
    ),
    addPreviousWork: _m("Add Previous Work", "إضافة عمل سابق"),
    noPreviousWorks: _m(
      "No previous works added yet",
      "لم يتم إضافة أعمال سابقة بعد"
    ),
    imageMaxSize: _m("Max image size: 2MB", "اقصى حجم الصورة : 2 ميجابايت"),
    imageDimensions: _m("2160x2160", "2160x2160"),
    updateSuccess: _m(
      "Service updated successfully!",
      "تم تحديث الخدمة بنجاح!"
    ),
    updateError: _m(
      "Failed to update service. Please try again.",
      "فشل تحديث الخدمة. يرجى المحاولة مرة أخرى."
    ),
    createSuccess: _m(
      "Service created successfully!",
      "تم إنشاء الخدمة بنجاح!"
    ),
    createError: _m(
      "Failed to create service. Please try again.",
      "فشل إنشاء الخدمة. يرجى المحاولة مرة أخرى."
    ),
    validationError: _m("Validation error", "خطأ في التحقق من البيانات"),
    save: _m("Save", "حفظ"),
  }),
  table: new MessagesGroup({
    serviceName: _m("Service Name", "اسم الخدمة"),
    category: _m("Category", "الفئة"),
    visibility: _m("Visibility", "الظهور"),
    featured: _m("Featured", "مميز"),
    edit: _m("Edit", "تعديل"),
  }),
});
