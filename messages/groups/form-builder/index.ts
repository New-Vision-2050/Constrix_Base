import ConfirmationDialog from "@/components/shared/ConfirmationDialog";
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
      FileTypeNotAllowed: _m("File type not allowed. Allowed types", "نوع الملف غير مسموح به. الأنواع المسموح بها"),
      FileSizeExceeds: _m("File size exceeds maximum allowed size", "حجم الملف يتجاوز الحجم الأقصى المسموح به"),
      UploadFailed: _m("Upload failed", "فشل الرفع"),
      UploadsFailed: _m("uploads failed", "فشل رفع الملفات"),
      UploadSuccessful: _m("Upload successful", "تم الرفع بنجاح"),
      ImageRequired: _m("Image is required", "الصورة مطلوبة")
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
      FileTypeNotAllowed: _m("File type not allowed. Allowed types", "نوع الملف غير مسموح به. الأنواع المسموح بها"),
      FileSizeExceeds: _m("File size exceeds maximum allowed size", "حجم الملف يتجاوز الحجم الأقصى المسموح به"),
      UploadFailed: _m("Upload failed", "فشل الرفع"),
      UploadsFailed: _m("uploads failed", "فشل رفع الملفات"),
      UploadSuccessful: _m("Upload successful", "تم الرفع بنجاح"),
      FileRequired: _m("File is required", "الملف مطلوب")
    })
  }),
  ConfirmationDialog: new MessagesGroup({
    title: _m("Are you sure?", "هل أنت متأكد؟"),
    message: _m("This action cannot be undone.", "لا يمكن التراجع عن هذا الإجراء."),
    cancel: _m("Cancel", "إلغاء"),
    delete: _m("Delete", "حذف"),
  }),
});
