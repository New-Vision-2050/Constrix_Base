import { _m, MessagesGroup } from "../../types";

export const formBuilderMessages = new MessagesGroup({
  Fields: new MessagesGroup({
    Image: new MessagesGroup({
      UploadImage: _m("Upload Image", "رفع صورة"),
      UploadImages: _m("Upload Images", "رفع صور"),
      ChangeImage: _m("Change Image", "تغيير الصورة"),
      RemoveImage: _m("Remove Image", "إزالة الصورة"),
      ClickToUpload: _m("Click to upload an image", "انقر لرفع صورة"),
      ClickToUploadMultiple: _m("Click to upload images", "انقر لرفع صور"),
      AddMoreImages: _m("Add More Images", "إضافة المزيد من الصور"),
      Uploading: _m("Uploading...", "جاري الرفع..."),
      AllowedTypes: _m("Allowed types", "الأنواع المسموح بها"),
      MaxSize: _m("Max size", "الحجم الأقصى"),
      FileTypeNotAllowed: _m(
        "File type not allowed. Allowed types",
        "نوع الملف غير مسموح به. الأنواع المسموح بها"
      ),
      FileSizeExceeds: _m(
        "File size exceeds maximum allowed size",
        "حجم الملف يتجاوز الحجم الأقصى المسموح به"
      ),
      UploadFailed: _m("Upload failed", "فشل الرفع"),
      UploadsFailed: _m("uploads failed", "فشل رفع الملفات"),
      UploadSuccessful: _m("Upload successful", "تم الرفع بنجاح"),
      ImageRequired: _m("Image is required", "الصورة مطلوبة"),
    }),
    File: new MessagesGroup({
      UploadFile: _m("Upload File", "رفع ملف"),
      UploadFiles: _m("Upload Files", "رفع ملفات"),
      ChangeFile: _m("Change File", "تغيير الملف"),
      RemoveFile: _m("Remove File", "إزالة الملف"),
      ClickToUpload: _m("Click to upload a file", "انقر لرفع ملف"),
      ClickToUploadMultiple: _m("Click to upload files", "انقر لرفع ملفات"),
      Upload: _m("Upload", "ارفاق"),
      AttachFile: _m("Attach the document", "قم بارفاق المستند"),
      AddMoreFiles: _m("Add More Files", "إضافة المزيد من الملفات"),
      Uploading: _m("Uploading...", "جاري الرفع..."),
      AllowedTypes: _m("Allowed types", "يسمح بتنسيق a"),
      MaxSize: _m("Max size", "الحجم الأقصى"),
      FileTypeNotAllowed: _m(
        "File type not allowed. Allowed types",
        "نوع الملف غير مسموح به. الأنواع المسموح بها"
      ),
      FileSizeExceeds: _m(
        "File size exceeds maximum allowed size",
        "حجم الملف يتجاوز الحجم الأقصى المسموح به"
      ),
      UploadFailed: _m("Upload failed", "فشل الرفع"),
      UploadsFailed: _m("uploads failed", "فشل رفع الملفات"),
      UploadSuccessful: _m("Upload successful", "تم الرفع بنجاح"),
      FileRequired: _m("File is required", "الملف مطلوب"),
    }),
    Phone: new MessagesGroup({
      EnterPhoneNumber: _m("Enter phone number", "أدخل رقم الهاتف"),
      SearchCountry: _m("Search country...", "ابحث عن دولة..."),
      NoCountryFound: _m("No country found.", "لم يتم العثور على دولة."),
      InvalidPhoneNumber: _m(
        "Please enter a valid phone number",
        "يرجى إدخال رقم هاتف صحيح"
      ),
      Countries: new MessagesGroup({
        "20": _m("Egypt", "مصر"),
        "966": _m("Saudi Arabia", "السعودية"),
        "971": _m("UAE", "الإمارات"),
        "65": _m("Singapore", "سنغافورة"),
        "82": _m("South Korea", "كوريا الجنوبية"),
        "34": _m("Spain", "إسبانيا"),
        "52": _m("Mexico", "المكسيك"),
        "31": _m("Netherlands", "هولندا"),
        "90": _m("Turkey", "تركيا"),
        "1": _m("United States", "الولايات المتحدة"),
        "44": _m("United Kingdom", "المملكة المتحدة"),
        "91": _m("India", "الهند"),
        "86": _m("China", "الصين"),
        "49": _m("Germany", "ألمانيا"),
        "33": _m("France", "فرنسا"),
        "81": _m("Japan", "اليابان"),
        "39": _m("Italy", "إيطاليا"),
        "7": _m("Russia", "روسيا"),
        "55": _m("Brazil", "البرازيل"),
        "61": _m("Australia", "أستراليا"),
      }),
    }),
  }),
});
