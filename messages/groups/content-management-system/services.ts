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
    descriptionEn: _m("Description (English)", "الوصف (إنجليزي)"),
    descriptionEnPlaceholder: _m(
      "Enter description in English",
      "أدخل الوصف بالإنجليزية"
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
    save: _m("Save Changes", "حفظ التعديلات"),
    addService: _m("Add Service", "إضافة خدمة"),
    removeService: _m("Remove Service", "حذف الخدمة"),
    mainTitle: _m("Main Title", "العنوان الرئيسي"),
    mainTitlePlaceholder: _m("Enter main title", "أدخل العنوان الرئيسي"),
    mainTitleRequired: _m("Main title is required", "العنوان الرئيسي مطلوب"),
    mainDescription: _m("Main Description", "الوصف الرئيسي"),
    mainDescriptionPlaceholder: _m("Enter main description", "أدخل الوصف الرئيسي"),
    mainDescriptionRequired: _m("Main description is required", "الوصف الرئيسي مطلوب"),
    departmentTitleAr: _m("Department Title (Arabic)", "عنوان القسم (عربي)"),
    departmentTitleArPlaceholder: _m("Enter department title in Arabic", "أدخل عنوان القسم بالعربية"),
    departmentTitleArRequired: _m("Arabic title is required", "العنوان بالعربية مطلوب"),
    departmentTitleEn: _m("Department Title (English)", "عنوان القسم (إنجليزي)"),
    departmentTitleEnPlaceholder: _m("Enter department title in English", "أدخل عنوان القسم بالإنجليزية"),
    departmentTitleEnRequired: _m("English title is required", "العنوان بالإنجليزية مطلوب"),
    departmentDescriptionAr: _m("Department Description (Arabic)", "وصف القسم (عربي)"),
    departmentDescriptionArPlaceholder: _m("Enter department description in Arabic", "أدخل وصف القسم بالعربية"),
    departmentDescriptionArRequired: _m("Arabic description is required", "الوصف بالعربية مطلوب"),
    departmentDescriptionEn: _m("Department Description (English)", "وصف القسم (إنجليزي)"),
    departmentDescriptionEnPlaceholder: _m("Enter department description in English", "أدخل وصف القسم بالإنجليزية"),
    departmentDescriptionEnRequired: _m("English description is required", "الوصف بالإنجليزية مطلوب"),
    designType: _m("Design Type", "نوع التصميم"),
    designTypePlaceholder: _m("Select design type", "اختر نوع التصميم"),
    designTypeRequired: _m("Design type is required", "نوع التصميم مطلوب"),
    serviceNumber: _m("Service", "الخدمة"),
    servicePlaceholder: _m("Enter service name", "أدخل اسم الخدمة"),
    serviceRequired: _m("Service is required", "الخدمة مطلوبة"),
    servicesMinRequired: _m("At least 6 services are required", "يجب إضافة 6 خدمات على الأقل"),
    departmentsMinRequired: _m("At least one department is required", "يجب إضافة قسم واحد على الأقل"),
    cannotRemoveLastDepartment: _m("Cannot remove the last department", "لا يمكن حذف القسم الأخير"),
    saveSuccess: _m("Saved successfully!", "تم الحفظ بنجاح!"),
    saveError: _m("Failed to save. Please try again.", "فشل الحفظ. يرجى المحاولة مرة أخرى."),
  }),
  table: new MessagesGroup({
    serviceName: _m("Service Name", "اسم الخدمة"),
    category: _m("Category", "الفئة"),
    visibility: _m("Visibility", "الظهور"),
    featured: _m("Featured", "مميز"),
    edit: _m("Edit", "تعديل"),
  }),
  mainSection: _m("Main Section", "القسم الرئيسي"),
  departmentNumber: _m("Department", "القسم"),
  addDepartment: _m("Add Department", "إضافة قسم"),
});
