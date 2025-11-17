import { _m, MessagesGroup } from "../../types";

export const pagesMessages = new MessagesGroup({
  active: _m("Active", "نشط"),
  success: _m("Success", "نجاح"),
  error: _m("Error", "خطأ"),
  activatedSuccessfully: _m("Page activated successfully", "تم تفعيل الصفحة بنجاح"),
  deactivatedSuccessfully: _m("Page deactivated successfully", "تم إلغاء تفعيل الصفحة بنجاح"),
  failedToUpdateStatus: _m("Failed to update status", "فشل تحديث الحالة"),
  areYouSureReactivate: _m("Are you sure you want to reactivate this page?", "هل أنت متأكد من إعادة تفعيل هذه الصفحة؟"),
  areYouSureDeactivate: _m("Are you sure you want to deactivate this page?", "هل أنت متأكد من إلغاء تفعيل هذه الصفحة؟")
});
