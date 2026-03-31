import { _m, MessagesGroup } from "../../types";

export const companyProfileLegalDataFormMessages = new MessagesGroup({
  title: _m("Legal Data", "البيانات القانونية"),
  addLegalData: _m("Add Legal Data", "اضافة بيان قانوني"),
  editLegalData: _m("Edit Legal Data", "تعديل بيان قانوني"),
  registrationType: _m("Registration Type", "نوع التسجيل"),
  registrationTypePlaceholder: _m("Select registration type", "اختر نوع التسجيل"),
  registrationNumber: _m("Registration Number", "رقم السجل التجاري"),
  registrationNumberPlaceholder: _m("Enter registration number", "ادخل رقم السجل التجاري"),
  startDate: _m("Issue Date", "تاريخ الإصدار"),
  startDatePlaceholder: _m("Select issue date", "اختر تاريخ الإصدار"),
  endDate: _m("Expiry Date", "تاريخ الانتهاء"),
  endDatePlaceholder: _m("Select expiry date", "اختر تاريخ الانتهاء"),
  attachFile: _m("Attach File", "اضافة مرفق"),
  addNewRecord: _m("Add New Record", "اضافة سجل جديد"),
  save: _m("Save", "حفظ"),
  cancel: _m("Cancel", "إلغاء"),
  deleteRecord: _m("Delete Record", "حذف السجل"),
  maxRecordsReached: _m("Maximum 10 records allowed", "الحد الأقصى 10 سجلات"),
  
  // Support Data
  supportData: _m("Support Data", "بيانات الدعم"),
  name: _m("Name", "الاسم"),
  phone: _m("Phone", "الهاتف"),
  email: _m("Email", "البريد الإلكتروني"),
  nationality: _m("Nationality", "الجنسية"),
  
  // National Address
  nationalAddress: _m("National Address", "العنوان الوطني"),
  country: _m("Country", "الدولة"),
  region: _m("Region", "المنطقة"),
  city: _m("City", "المدينة"),
  district: _m("District", "الحي"),
  buildingNumber: _m("Building Number", "رقم المبنى"),
  additionalNumber: _m("Additional Number", "الرقم الإضافي"),
  postalCode: _m("Postal Code", "الرمز البريدي"),
  street: _m("Street", "الشارع"),
  showLocationOnMap: _m("Show location on map", "اظهار الموقع من الخريطة"),
  editLocationFromMap: _m("Edit location from map", "تعديل الموقع من الخريطة"),
  specifyAtLeastOneAddress: _m("Specify at least one address", "يجب تحديد عنوان واحد على الاقل"),
  
  // Menu items
  myRequests: _m("My Requests", "طلباتي"),
  requestLegalDataUpdate: _m("Request Legal Data Update", "طلب تعديل البيانات القانونية"),
  
  // Messages
  completeRegistrationData: _m("Registration data must be completed", "يجب إكمال بيانات التسجيل"),
  goBack: _m("Go Back", "الرجوع"),
  noDataYetAddNewRow: _m("No data yet. Add a new row to start", "لا توجد بيانات حتى الآن أضف صف جديد للبدء"),
  
  // Field labels
  registrationTypeLabel: _m("Registration Type", "نوع التسجل"),
  commercialRegisterNumber: _m("Commercial Register / 700 Number", "رقم السجل التجاري / رقم الـ 700"),
  issueDate: _m("Issue Date", "تاريخ الإصدار"),
  expiryDate: _m("Expiry Date", "تاريخ الانتهاء"),
  enterCommercialRegisterNumber: _m("Enter commercial register / 700 number", "ادخل رقم السجل التجاري / رقم الـ 700"),
  
  // Validation error messages
  registration_type_id_required: _m("Registration type is required", "نوع التسجيل مطلوب"),
  fileSizeError: _m("File size must be less than 5 MB", "حجم الملف يجب أن يكون أقل من 5 ميجابايت"),
  fileTypeError: _m("File type not allowed", "نوع الملف غير مسموح"),
  registrationNumberPattern: _m("Number must start with 700, 40, or 101 and contain only digits", "يجب أن يبدأ الرقم بـ 700 أو 40 أو 101 ويحتوي على أرقام فقط"),
  registrationNumberEmpty: _m("Registration number cannot be empty", "رقم التسجيل لا يمكن أن يكون فارغاً"),
  startDateRequired: _m("Enter issue date", "ادخل تاريخ الاصدار"),
  endDateRequired: _m("Enter expiry date", "ادخل تاريخ الانتهاء"),
  filesRequired: _m("At least one file must be attached", "يجب إرفاق ملف واحد على الأقل"),
  registrationNumberRequiredForType: _m("Registration number is required for this type", "رقم التسجيل مطلوب لهذا النوع"),
  startDateBeforeEndDate: _m("Issue date must be before expiry date", "تاريخ الإصدار يجب أن يكون قبل تاريخ الانتهاء"),
  maxRecords: _m("Maximum 10 records", "الحد الأقصى 10 سجلات"),
  
  // National Address Validation Messages
  regionRequired: _m("Enter region", "ادخل المنطقة"),
  cityRequired: _m("Enter city", "ادخل المدينة"),
  districtRequired: _m("District is required", "الحي مطلوب"),
  buildingNumberRequired: _m("Building number is required", "رقم المبنى مطلوب"),
  additionalNumberRequired: _m("Additional number is required", "الرقم الإضافي مطلوب"),
  postalCodeRequired: _m("Postal code is required", "الرمز البريدي مطلوب"),
  streetRequired: _m("Street is required", "الشارع مطلوب"),
  phoneInvalid: _m("Phone number is invalid", "رقم الهاتف غير صالح"),
  
  // Official Documents
  officialDocuments: _m("Official Documents", "المستندات الرسمية"),
  addOfficialDocument: _m("Add Official Document", "اضافة مستند رسمي"),
  documentSettings: _m("Document Settings", "اعدادات المستندات"),
  mustAddAtLeastOneOfficialDocument: _m("Must add at least one official document", "يجب اضافة مستند رسمي واحد على الاقل"),
  
  // Add Document Form
  documentType: _m("Document Type", "نوع المستند"),
  documentTypePlaceholder: _m("Document Type", "نوع المستند"),
  documentName: _m("Document Name", "اسم المستند"),
  documentNamePlaceholder: _m("Enter Document Name", "ادخل اسم المستند"),
  description: _m("Description", "الوصف"),
  descriptionPlaceholder: _m("Enter Description", "ادخل الوصف"),
  documentNumber: _m("Document Number", "رقم المستند"),
  documentNumberPlaceholder: _m("Enter Document Number", "ادخل رقم المستند"),
  issueDate: _m("Issue Date", "تاريخ الإصدار"),
  issueDatePlaceholder: _m("Issue Date", "تاريخ الإصدار"),
  expiryDate: _m("Expiry Date", "تاريخ الانتهاء"),
  expiryDatePlaceholder: _m("Expiry Date", "تاريخ الانتهاء"),
  notificationDate: _m("Notification Date", "تاريخ الاشعار"),
  notificationDatePlaceholder: _m("Notification Date", "تاريخ الاشعار"),
  addDocuments: _m("Add Documents", "اضافة مستندات"),
  
  // Validation Messages
  enterDocumentType: _m("Enter document type", "ادخل نوع المستند"),
  enterDocumentName: _m("Enter document name", "ادخل اسم المستند"),
  enterDescription: _m("Enter description", "ادخل الوصف"),
  enterDocumentNumber: _m("Enter document number", "ادخل رقم المستند"),
  enterIssueDate: _m("Enter issue date", "ادخل تاريخ الاصدار"),
  enterExpiryDate: _m("Enter expiry date", "ادخل تاريخ الانتهاء"),
  enterNotificationDate: _m("Enter notification date", "ادخل تاريخ الاشعار"),
  mustAttachAtLeastOneFile: _m("Must attach at least one file", "يجب ادخال مرفق على الاقل"),
  
  // Additional National Address Fields
  latitude: _m("Latitude", "latitude"),
  longitude: _m("Longitude", "longitude"),
  
  // Common Actions
  add: _m("Add", "اضافة"),
  save: _m("Save", "حفظ"),
  cancel: _m("Cancel", "إلغاء"),
});
