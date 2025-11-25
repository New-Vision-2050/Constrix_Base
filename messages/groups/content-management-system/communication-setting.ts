import { MessagesGroup, _m } from "@/messages";

export const ContentManagementSystemCommunicationSettingsMessages = new MessagesGroup({
  title: _m("Communication Settings", "اعدادات الاتصال"),

  // Address Table Translations
  table: new MessagesGroup({
    title: _m("Addresses", "العناوين"),
    address: _m("Address", "العنوان"),
    latitude: _m("Latitude", "خط العرض"),
    longitude: _m("Longitude", "خط الطول"),
    edit: _m("Edit", "تعديل"),
    addAddress: _m("Add Address", "إضافة عنوان"),
  }),

  // Social Links Table Translations
  socialLinksTable: new MessagesGroup({
    title: _m("Social Links", "الروابط الاجتماعية"),
    socialIcon: _m("Social Icon", "الأيقونة"),
    type: _m("Type", "النوع"),
    url: _m("URL", "الرابط"),
    edit: _m("Edit", "تعديل"),
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
    
    // Success Messages
    createSuccess: _m("Social link created successfully", "تم إنشاء الرابط بنجاح"),
    updateSuccess: _m("Social link updated successfully", "تم تحديث الرابط بنجاح"),
    
    // Error Messages
    operationFailed: _m("Operation failed", "فشلت العملية"),
  }),

  // Address Dialog Translations
  addressDialogTitle: _m("Add New Address", "إضافة عنوان جديد"),
  addressLabel: _m("Address", "العنوان"),
  latitudeLabel: _m("Latitude", "خط العرض"),
  longitudeLabel: _m("Longitude", "خط الطول"),

  // Address Validation Messages
  addressRequired: _m("Address is required", "العنوان مطلوب"),
  latitudeRequired: _m("Latitude is required", "خط العرض مطلوب"),
  longitudeRequired: _m("Longitude is required", "خط الطول مطلوب"),
  latitudeInvalid: _m("Please enter a valid latitude", "يرجى إدخال خط عرض صحيح"),
  longitudeInvalid: _m("Please enter a valid longitude", "يرجى إدخال خط طول صحيح"),

  // Form Labels
  formTitle: _m("Contact Data", "بيانات التواصل"),
  email: _m("Email", "البريد الإلكتروني"),
  phone: _m("Phone Number", "رقم الهاتف"),

  // Placeholders
  emailPlaceholder: _m("Enter email address", "ادخل البريد الإلكتروني"),
  phonePlaceholder: _m("Enter phone number", "ادخل رقم الهاتف"),

  // Validation Messages
  emailRequired: _m("Email is required", "البريد الإلكتروني مطلوب"),
  emailInvalid: _m("Please enter a valid email address", "يرجى إدخال بريد إلكتروني صالح"),
  phoneRequired: _m("Phone number is required", "رقم الهاتف مطلوب"),
  phoneInvalid: _m("Please enter a valid phone number", "يرجى إدخال رقم هاتف صالح"),
  phoneMinLength: _m("Phone must be at least 10 digits", "رقم الهاتف يجب أن يكون 10 أرقام على الأقل"),
  phoneMaxLength: _m("Phone must not exceed 20 digits", "رقم الهاتف يجب ألا يزيد عن 20 رقم"),

  // Actions
  saveButton: _m("Save Changes", "حفظ التعديل"),

  // Success/Error Messages
  updateSuccess: _m("Contact information updated successfully", "تم تحديث معلومات الاتصال بنجاح"),
  updateFailed: _m("Failed to update contact information", "فشل تحديث معلومات الاتصال"),
});