import { _m, MessagesGroup } from "../../types";

export const termsMessages = new MessagesGroup({
  plural: _m("Terms and Conditions", "الشروط والأحكام"),
  singular: _m("Term", "الشرط"),
  save: _m("Save", "حفظ"),
  saving: _m("Saving...", "جاري الحفظ..."),
  enterContent: _m("Enter content here...", "أدخل المحتوى هنا..."),
  updateSuccess: _m("Updated successfully", "تم التحديث بنجاح"),
  updateError: _m("Failed to update. Please try again.", "فشل التحديث. يرجى المحاولة مرة أخرى.")
});
