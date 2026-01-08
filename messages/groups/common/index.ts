import { _m, MessagesGroup } from "../../types";

export const commonMessages = new MessagesGroup({
  itemsPerPage: _m("Items per page", "عناصر في الصفحة"),
  selectItemsPerPage: _m("Select items per page", "اختر عدد العناصر في الصفحة"),
  // State messages for loading and error components
  states: new MessagesGroup({
    loading: _m("Loading, please wait...", "جاري التحميل، يرجى الانتظار..."),
    error: _m(
      "Something went wrong. Please try again.",
      "حدث خطأ ما. يرجى المحاولة مرة أخرى."
    ),
    retry: _m("Retry", "إعادة المحاولة"),
  }),
  noCountryCode: _m("No country code found", "لا يوجد رمز الدولة"),
  // File upload messages
  fileUpload: new MessagesGroup({
    uploadFile: _m("Upload File", "رفع ملف"),
    maxSize: _m("Max size: {size}", "الحجم الأقصى: {size}"),
    fileSizeExceeds: _m("File size exceeds the maximum allowed size of {size}", "حجم الملف يتجاوز الحجم الأقصى المسموح به وهو {size}"),
   }),
  // Image upload messages
  imageUpload: new MessagesGroup({
    attach: _m("Attach", "إرفاق"),
    existingImage: _m("Existing image {index}", "صورة موجودة {index}"),
    addMoreFiles: _m("Add more files", "إضافة المزيد من الملفات"),
    maxSizeLabel: _m("Max size", "الحجم الأقصى"),
  }),
});
