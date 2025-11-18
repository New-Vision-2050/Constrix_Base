import { MessagesGroup, _m } from "@/messages";

export const ContentManagementSystemTermsConditionsMessages = new MessagesGroup({
  form: new MessagesGroup({
    title: _m("Terms and Conditions Data", "بيانات الشروط والاحكام"),
    contentPlaceholder: _m("Enter terms and conditions content here...", "أدخل محتوى الشروط والاحكام هنا..."),
    saveChanges: _m("Save Changes", "حفظ التعديل"),
    updateSuccess: _m("Terms and conditions updated successfully!", "تم تحديث الشروط والاحكام بنجاح!"),
    updateError: _m("Failed to update terms and conditions. Please try again.", "فشل تحديث الشروط والاحكام. يرجى المحاولة مرة أخرى."),
    validationError: _m("Validation error", "خطأ في التحقق من البيانات"),
    contentRequired: _m("Terms and conditions content is required", "محتوى الشروط والاحكام مطلوب"),
    contentMinLength: _m("Terms and conditions content must be at least 10 characters", "محتوى الشروط والاحكام يجب أن يكون على الأقل 10 أحرف"),
  }),
});

