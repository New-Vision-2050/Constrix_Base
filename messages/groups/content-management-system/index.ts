import { _m, MessagesGroup } from "../../types";

export const contentManagementSystemMessages = new MessagesGroup({
  categories: new MessagesGroup({
    title: _m("Categories Settings", "اعدادات الفئات"),
    addCategory: _m("Add New Category", "اضافة فئة جديدة"),
    editCategory: _m("Edit Category", "تعديل فئة"),
    form: new MessagesGroup({
      updateSuccess: _m("Update successful!", "تم التحديث بنجاح!"),
      updateError: _m(
        "Update failed. Please try again.",
        "فشل التحديث. يرجى المحاولة مرة أخرى."
      ),
      createSuccess: _m("Create successful!", "تم الإنشاء بنجاح!"),
      createError: _m(
        "Create failed. Please try again.",
        "فشل الإنشاء. يرجى المحاولة مرة أخرى."
      ),
      validationError: _m("Validation error", "خطأ في التحقق من البيانات"),
      permissionDenied: _m(
        "You don't have permission to perform this action",
        "ليس لديك صلاحية لإجراء هذا الإجراء"
      ),
      networkError: _m(
        "Network error. Please try again.",
        "خطأ في الشبكة. يرجى المحاولة مرة أخرى."
      ),
      editCategory: _m("Edit Category", "تعديل فئة"),
      addCategory: _m("Add Category", "اضافة فئة"),
      nameAr: _m("Category Name in Arabic", "اسم الفئة بالعربية"),
      nameArPlaceholder: _m(
        "Enter category name in Arabic",
        "أدخل اسم الفئة بالعربية"
      ),
      nameArRequired: _m(
        "Category name in Arabic is required",
        "اسم الفئة بالعربية مطلوب"
      ),
      nameArMinLength: _m(
        "Category name in Arabic must be at least 2 characters",
        "اسم الفئة بالعربية يجب أن يكون على الأقل حرفين"
      ),
      nameEn: _m("Category Name in English", "اسم الفئة بالإنجليزية"),
      nameEnPlaceholder: _m(
        "Enter category name in English",
        "أدخل اسم الفئة بالإنجليزية"
      ),
      nameEnRequired: _m(
        "Category name in English is required",
        "اسم الفئة بالإنجليزية مطلوب"
      ),
      nameEnMinLength: _m(
        "Category name in English must be at least 2 characters",
        "اسم الفئة بالإنجليزية يجب أن يكون على الأقل حرفين"
      ),
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
      edit: _m("Edit", "تعديل"),
    }),
  }),
  mainData: new MessagesGroup({
    saveSuccess: _m("Saved successfully!", "تم الحفظ بنجاح"),
    saveError: _m("Failed to save", "فشل الحفظ"),
    basicData: new MessagesGroup({
      title: _m("Basic Data", "البيانات الأساسية"),
      siteTitle: _m("Site Title", "عنوان الموقع"),
      siteTitlePlaceholder: _m("Enter site title", "أدخل عنوان الموقع"),
      siteLogo: _m("Site Logo", "شعار الموقع"),
      logoMaxSize: _m("Max size: 3MB", "الحد الأقصى للحجم: 3 ميجابايت"),
      logoDimensions: _m("Dimensions: 2160 × 2160", "الأبعاد: 2160 × 2160"),
    }),
    appearance: new MessagesGroup({
      title: _m("Appearance", "المظهر"),
      primaryColor: _m("Primary Color", "اللون الأساسي"),
      secondaryColor: _m("Secondary Color", "اللون الثانوي"),
      backgroundColor: _m("Background Color", "لون الخلفية"),
      saveChanges: _m("Save Changes", "حفظ التغييرات"),
    }),
    validation: new MessagesGroup({
      invalidColor: _m(
        "Invalid color format. Please use hex format (e.g., #FFFFFF)",
        "تنسيق اللون غير صحيح. يرجى استخدام التنسيق السداسي (مثل #FFFFFF)"
      ),
    }),
  }),
  founder: new MessagesGroup({
    addFounder: _m("Add Founder", "إضافة مؤسس"),
    editFounder: _m("Edit Founder", "تعديل مؤسس"),
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
      actions: _m("Actions", "الإجراءات"),
    }),
  }),
  news: new MessagesGroup({
    addNews: _m("Add News", "إضافة خبر"),
    editNews: _m("Edit News", "تعديل خبر"),
    form: new MessagesGroup({
      titleAr: _m("Title (Arabic)", "العنوان (عربي)"),
      titleEn: _m("Title (English)", "العنوان (إنجليزي)"),
      titleArRequired: _m("Arabic title is required", "العنوان بالعربية مطلوب"),
      titleArMinLength: _m(
        "Arabic title must be at least 2 characters",
        "العنوان بالعربية يجب أن يكون على الأقل حرفين"
      ),
      titleEnRequired: _m(
        "English title is required",
        "العنوان بالإنجليزية مطلوب"
      ),
      titleEnMinLength: _m(
        "English title must be at least 2 characters",
        "العنوان بالإنجليزية يجب أن يكون على الأقل حرفين"
      ),
      contentAr: _m("Content (Arabic)", "المحتوى (عربي)"),
      contentEn: _m("Content (English)", "المحتوى (إنجليزي)"),
      contentArRequired: _m(
        "Arabic content is required",
        "المحتوى بالعربية مطلوب"
      ),
      contentEnRequired: _m(
        "English content is required",
        "المحتوى بالإنجليزية مطلوب"
      ),
      category: _m("Category", "الفئة"),
      categoryPlaceholder: _m("Select category", "اختر الفئة"),
      categoryRequired: _m("Category is required", "الفئة مطلوبة"),
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
    }),
  }),
  services: new MessagesGroup({
    addService: _m("Add New Service", "اضافة خدمة جديدة"),
    editService: _m("Edit Service", "تعديل خدمة"),
    form: new MessagesGroup({
      nameAr: _m("Service name (Arabic)", "اسم الخدمة بالعربي"),
      nameArPlaceholder: _m(
        "Enter service name in Arabic",
        "أدخل اسم الخدمة بالعربية"
      ),
      nameArRequired: _m(
        "Arabic service name is required",
        "اسم الخدمة بالعربية مطلوب"
      ),
      nameArMinLength: _m(
        "Arabic service name must be at least 2 characters",
        "اسم الخدمة بالعربية يجب أن يكون على الأقل حرفين"
      ),
      nameEn: _m("Service name (English)", "اسم الخدمة بالانجليزية"),
      nameEnPlaceholder: _m(
        "Enter service name in English",
        "أدخل اسم الخدمة بالإنجليزية"
      ),
      nameEnRequired: _m(
        "English service name is required",
        "اسم الخدمة بالإنجليزية مطلوب"
      ),
      nameEnMinLength: _m(
        "English service name must be at least 2 characters",
        "اسم الخدمة بالإنجليزية يجب أن يكون على الأقل حرفين"
      ),
      requestId: _m("Request ID", "رقم تعريف الطلب"),
      requestIdPlaceholder: _m("Enter request ID", "أدخل رقم تعريف الطلب"),
      requestIdRequired: _m("Request ID is required", "رقم تعريف الطلب مطلوب"),
      category: _m("Category", "الفئة"),
      categoryPlaceholder: _m("Choose Category", "أختار الفئة"),
      categoryRequired: _m("Category is required", "الفئة مطلوبة"),
      descriptionAr: _m("Service description (Arabic)", "وصف الخدمة بالعربي"),
      descriptionArPlaceholder: _m(
        "Enter service description in Arabic",
        "أدخل وصف الخدمة بالعربية"
      ),
      descriptionArRequired: _m(
        "Arabic service description is required",
        "وصف الخدمة بالعربية مطلوب"
      ),
      descriptionEn: _m(
        "Service description (English)",
        "وصف الخدمة بالانجليزية"
      ),
      descriptionEnPlaceholder: _m(
        "Enter service description in English",
        "أدخل وصف الخدمة بالإنجليزية"
      ),
      descriptionEnRequired: _m(
        "English service description is required",
        "وصف الخدمة بالإنجليزية مطلوب"
      ),
      featuredServicesTitle: _m(
        "Featured Services (Display on homepage)",
        "أبرز الخدمات (العرض في الصفحة الرئيسية)"
      ),
      featuredServicesSubtitle: _m(
        "Display this service on the homepage",
        "عرض هذه الخدمة في الصفحة الرئيسية"
      ),
      iconImage: _m("Icon", "أيقونة"),
      iconImageRequired: _m("Icon image is required", "صورة الأيقونة مطلوبة"),
      mainImage: _m("Main Image", "الصورة الرئيسية"),
      mainImageRequired: _m("Main image is required", "الصورة الرئيسية مطلوبة"),
      imageMaxSize: _m("Max image size: 3MB", "اقصى حجم الصورة : - 3MB"),
      imageDimensions: _m("2160x2160", "2160x2160"),
      previousWorksTitle: _m("Previous Works", "الاعمال اسابقة"),
      addPreviousWork: _m("Add", "إضافة"),
      noPreviousWorks: _m(
        "No previous works added yet",
        "لم يتم إضافة أعمال سابقة بعد"
      ),
      previousWork: _m("Previous Work", "العمل السابق"),
      previousWorkDescription: _m("Description", "الوصف"),
      previousWorkDescriptionPlaceholder: _m("Enter description", "أدخل الوصف"),
      previousWorkDescriptionRequired: _m(
        "Previous work description is required",
        "وصف العمل السابق مطلوب"
      ),
      previousWorkImage: _m("Attach image", "ارفاق صورة"),
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
      type: _m("Type", "النوع"),
      status: _m("Status", "الحالة"),
      visibility: _m("Visibility", "الظهور"),
      featured: _m("Featured", "مميز"),
      edit: _m("Edit", "تعديل"),
      actions: _m("Actions", "اجراء"),
      statusUpdated: _m("Status updated successfully", "تم تحديث الحالة بنجاح"),
      statusUpdateError: _m("Failed to update status", "فشل تحديث الحالة"),
    }),
  }),
  "our-services": new MessagesGroup({
    mainSection: _m("Main Section", "القسم الرئيسي"),
    departmentNumber: _m("Section No.", "قسم رقم"),
    addDepartment: _m("Add Department", "إضافة قسم"),
    form: new MessagesGroup({
      mainTitle: _m("Title", "العنوان"),
      mainTitlePlaceholder: _m("Enter main title", "أدخل العنوان الرئيسي"),
      mainTitleRequired: _m("Main title is required", "العنوان الرئيسي مطلوب"),
      mainDescription: _m("Description", "الوصف"),
      mainDescriptionPlaceholder: _m(
        "Enter main description",
        "أدخل الوصف الرئيسي"
      ),
      mainDescriptionRequired: _m(
        "Main description is required",
        "الوصف الرئيسي مطلوب"
      ),
      departmentTitleAr: _m("Arabic Title *", "العنوان عربي *"),
      departmentTitleArPlaceholder: _m(
        "Enter title in Arabic",
        "أدخل العنوان بالعربية"
      ),
      departmentTitleArRequired: _m(
        "Arabic title is required",
        "العنوان بالعربية مطلوب"
      ),
      departmentTitleEn: _m("English Title *", "العنوان الانجليزية *"),
      departmentTitleEnPlaceholder: _m(
        "Enter title in English",
        "أدخل العنوان بالإنجليزية"
      ),
      departmentTitleEnRequired: _m(
        "English title is required",
        "العنوان بالإنجليزية مطلوب"
      ),
      departmentDescriptionAr: _m("Arabic Description *", "الوصف عربي *"),
      departmentDescriptionArPlaceholder: _m(
        "Enter description in Arabic",
        "أدخل الوصف بالعربية"
      ),
      departmentDescriptionArRequired: _m(
        "Arabic description is required",
        "الوصف بالعربية مطلوب"
      ),
      departmentDescriptionEn: _m(
        "English Description *",
        "الوصف الانجليزية *"
      ),
      departmentDescriptionEnPlaceholder: _m(
        "Enter description in English",
        "أدخل الوصف بالإنجليزية"
      ),
      departmentDescriptionEnRequired: _m(
        "English description is required",
        "الوصف بالإنجليزية مطلوب"
      ),
      designType: _m("Design Type *", "نوع التصميم *"),
      designTypePlaceholder: _m("Select design type", "اختر نوع التصميم"),
      designTypeRequired: _m("Design type is required", "نوع التصميم مطلوب"),
      serviceNumber: _m("Service No.", "خدمة رقم"),
      servicePlaceholder: _m("Enter service name", "أدخل اسم الخدمة"),
      serviceRequired: _m("Service is required", "الخدمة مطلوبة"),
      servicesMinRequired: _m(
        "At least 6 services are required",
        "يجب إدخال 6 خدمات على الأقل"
      ),
      departmentsMinRequired: _m(
        "At least one department is required",
        "يجب إدخال قسم واحد على الأقل"
      ),
      cannotRemoveLastDepartment: _m(
        "Cannot remove the last department",
        "لا يمكن حذف القسم الأخير"
      ),
      save: _m("Save", "حفظ"),
      saveSuccess: _m("Saved successfully!", "تم الحفظ بنجاح!"),
      saveError: _m(
        "Failed to save. Please try again.",
        "فشل الحفظ. يرجى المحاولة مرة أخرى."
      ),
    }),
  }),
});
