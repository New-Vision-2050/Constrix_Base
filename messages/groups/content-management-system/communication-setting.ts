import { MessagesGroup, _m } from "@/messages";

export const ContentManagementSystemCommunicationSettingsMessages =
  new MessagesGroup({
    title: _m("Communication Settings", "اعدادات الاتصال"),

    // Tabs Translations
    tabs: new MessagesGroup({
      contactData: _m("Contact Data", "بيانات التواصل"),
      addresses: _m("Addresses", "العناوين"),
      socialLinks: _m("Social Links", "الروابط الاجتماعية"),
    }),

    // Address Table Translations
    table: new MessagesGroup({
      title: _m("Addresses", "العناوين"),
      address: _m("Address", "العنوان"),
      name: _m("Name", "الأسم"),
      city: _m("City", "المدينة"),
      latitude: _m("Latitude", "خط العرض"),
      longitude: _m("Longitude", "خط الطول"),
      edit: _m("Edit", "تعديل"),
      delete: _m("Delete", "حذف"),
      addAddress: _m("Add Address", "إضافة عنوان"),
      addAddressTitle: _m("Add New Address", "إضافة عنوان جديد"),
      editAddressTitle: _m("Edit Address", "تعديل العنوان"),
      search: _m("Search", "بحث"),
      actions: _m("Actions", "إجراءات"),
    }),

    // Social Links Table Translations
    socialLinksTable: new MessagesGroup({
      title: _m("Social Links", "الروابط الاجتماعية"),
      socialIcon: _m("Social Icon", "الأيقونة"),
      type: _m("Type", "النوع"),
      url: _m("URL", "الرابط"),
      edit: _m("Edit", "تعديل"),
      delete: _m("Delete", "حذف"),
      actions: _m("Actions", "إجراءات"),
      addSocialLink: _m("Add Social Link", "إضافة رابط اجتماعي"),

      // Dialog Translations
      addTitle: _m("Add New Social Link", "إضافة رابط جديد"),
      editTitle: _m("Edit Social Link", "تعديل الرابط"),
      typeLabel: _m("Link Type", "نوع الرابط"),
      typePlaceholder: _m("Select link type", "اختر نوع الرابط"),
      urlLabel: _m("URL", "الرابط"),
      iconLabel: _m("Social Icon", "أيقونة"),
      iconPlaceholder: _m("Icon URL or identifier", "رابط الأيقونة أو المعرّف"),
      saveButton: _m("Save", "حفظ"),
      search: _m("Search", "البحث  "),
      // Success Messages
      createSuccess: _m(
        "Social link created successfully",
        "تم إنشاء الرابط بنجاح"
      ),
      updateSuccess: _m(
        "Social link updated successfully",
        "تم تحديث الرابط بنجاح"
      ),

      // Error Messages
      operationFailed: _m("Operation failed", "فشلت العملية"),
    }),

    // Address Dialog Translations
    addressDialogTitle: _m("Add New Address", "إضافة عنوان جديد"),
    titleArLabel: _m("Title in Arabic", "العنوان بالعربية"),
    titleEnLabel: _m("Title in English", "العنوان بالإنجليزية"),
    titleArPlaceholder: _m("e.g. Main Office", "مثال: المكتب الرئيسي"),
    titleEnPlaceholder: _m("e.g. Main Office", "مثال: Main Office"),
    addressLabel: _m("Full Address", "العنوان الكامل"),
    addressPlaceholder: _m(
      "e.g. Egypt, Sohag, Tahta",
      "مثال: مصر، سوهاج، طهطا"
    ),
    latitudeLabel: _m("Latitude", "خط العرض"),
    longitudeLabel: _m("Longitude", "خط الطول"),

    // Address Validation Messages
    titleArRequired: _m(
      "Title in Arabic is required",
      "العنوان بالعربية مطلوب"
    ),
    titleEnRequired: _m(
      "Title in English is required",
      "العنوان بالإنجليزية مطلوب"
    ),
    addressRequired: _m("Address is required", "العنوان مطلوب"),
    latitudeRequired: _m("Latitude is required", "خط العرض مطلوب"),
    longitudeRequired: _m("Longitude is required", "خط الطول مطلوب"),
    latitudeInvalid: _m(
      "Please enter a valid latitude",
      "يرجى إدخال خط عرض صحيح"
    ),
    longitudeInvalid: _m(
      "Please enter a valid longitude",
      "يرجى إدخال خط طول صحيح"
    ),

    // Address Success Messages
    createSuccess: _m("Address created successfully", "تم إنشاء العنوان بنجاح"),
    updateSuccess: _m("Address updated successfully", "تم تحديث العنوان بنجاح"),
    operationFailed: _m("Operation failed", "فشلت العملية"),

    // Form Labels
    formTitle: _m("Contact Data", "بيانات التواصل"),
    email: _m("Email", "البريد الإلكتروني"),
    phone: _m("Phone Number", "رقم الهاتف"),

    // Placeholders
    emailPlaceholder: _m("Enter email address", "ادخل البريد الإلكتروني"),
    phonePlaceholder: _m("Enter phone number", "ادخل رقم الهاتف"),

    // Validation Messages
    emailRequired: _m("Email is required", "البريد الإلكتروني مطلوب"),
    emailInvalid: _m(
      "Please enter a valid email address",
      "يرجى إدخال بريد إلكتروني صالح"
    ),
    phoneRequired: _m("Phone number is required", "رقم الهاتف مطلوب"),
    phoneInvalid: _m(
      "Please enter a valid phone number",
      "يرجى إدخال رقم هاتف صالح"
    ),
    phoneMinLength: _m(
      "Phone must be at least 10 digits",
      "رقم الهاتف يجب أن يكون 10 أرقام على الأقل"
    ),
    phoneMaxLength: _m(
      "Phone must not exceed 20 digits",
      "رقم الهاتف يجب ألا يزيد عن 20 رقم"
    ),

    // Actions
    saveButton: _m("Save Changes", "حفظ التعديل"),

    // Success/Error Messages
    updateFailed: _m(
      "Failed to update contact information",
      "فشل تحديث معلومات الاتصال"
    ),
  });
