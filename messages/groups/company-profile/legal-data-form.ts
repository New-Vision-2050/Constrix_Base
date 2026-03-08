import { _m, MessagesGroup } from "../../types";

export const companyProfileLegalDataFormMessages = new MessagesGroup({
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
});
