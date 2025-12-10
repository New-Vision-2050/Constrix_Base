import { _m, MessagesGroup } from "../../types";

export const socialMediaMessages = new MessagesGroup({
  plural: _m("Social Media", "وسائل التواصل الاجتماعي"),
  singular: _m("Social Media", "وسيلة تواصل"),
  platform: _m("Platform", "وسيلة التواصل"),
  link: _m("Link", "الرابط"),
  status: _m("Status", "الحالة"),
  active: _m("Active", "نشط"),
  edit: _m("Edit Social Media", "تعديل وسيلة تواصل"),
  create: _m("Add Social Media", "إضافة وسيلة تواصل"),
  selectPlatform: _m("Select Platform", "اختر وسيلة التواصل"),
  linkRequired: _m("Link is required", "الرابط مطلوب"),
  platformRequired: _m("Platform is required", "وسيلة التواصل مطلوبة"),
  createSuccess: _m("Social media created successfully", "تم إنشاء وسيلة التواصل بنجاح"),
  createError: _m("Failed to create social media", "فشل إنشاء وسيلة التواصل"),
  updateSuccess: _m("Social media updated successfully", "تم تحديث وسيلة التواصل بنجاح"),
  updateError: _m("Failed to update social media", "فشل تحديث وسيلة التواصل"),
  deleteSuccess: _m("Social media deleted successfully", "تم حذف وسيلة التواصل بنجاح"),
  deleteError: _m("Failed to delete social media", "فشل حذف وسيلة التواصل"),
  success: _m("Success", "نجح"),
  error: _m("Error", "خطأ"),
  activatedSuccessfully: _m("Social media activated successfully", "تم تفعيل وسيلة التواصل بنجاح"),
  deactivatedSuccessfully: _m("Social media deactivated successfully", "تم تعطيل وسيلة التواصل بنجاح"),
  failedToUpdateStatus: _m("Failed to update status", "فشل تحديث حالة وسيلة التواصل"),
  areYouSureReactivate: _m("Are you sure you want to reactivate this social media?", "هل أنت متأكد من تفعيل وسيلة التواصل؟"),
  areYouSureDeactivate: _m("Are you sure you want to deactivate this social media?", "هل أنت متأكد من تعطيل وسيلة التواصل؟")
});
