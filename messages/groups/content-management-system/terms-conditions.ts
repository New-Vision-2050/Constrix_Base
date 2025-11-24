import { MessagesGroup, _m } from "@/messages";

export const ContentManagementSystemTermsConditionsMessages = new MessagesGroup({
  form: new MessagesGroup({
    // Page Title
    title: _m("Terms and Conditions Data", "بيانات الشروط والاحكام"),
    
    // Form Fields
    contentPlaceholder: _m(
      "Enter terms and conditions content here...", 
      "أدخل محتوى الشروط والاحكام هنا..."
    ),
    
    // Buttons
    saveChanges: _m("Save Changes", "حفظ التعديل"),
    retryButton: _m("Retry", "إعادة المحاولة"),
    
    // Success Messages
    updateSuccess: _m(
      "Terms and conditions updated successfully!", 
      "تم تحديث الشروط والاحكام بنجاح!"
    ),
    
    // Error Messages
    updateError: _m(
      "Failed to update terms and conditions. Please try again.", 
      "فشل تحديث الشروط والاحكام. يرجى المحاولة مرة أخرى."
    ),
    loadError: _m(
      "Failed to load terms and conditions", 
      "فشل تحميل الشروط والأحكام"
    ),
    validationError: _m("Validation error", "خطأ في التحقق من البيانات"),
    
    // Validation Messages
    contentRequired: _m(
      "Terms and conditions content is required", 
      "محتوى الشروط والاحكام مطلوب"
    ),
    contentMinLength: _m(
      "Terms and conditions content must be at least 10 characters", 
      "محتوى الشروط والاحكام يجب أن يكون على الأقل 10 أحرف"
    ),
    
    // Loading States
    loading: _m("Loading...", "جاري التحميل..."),
    saving: _m("Saving...", "جاري الحفظ..."),
    
    // Error State Messages
    errorOccurred: _m("An error occurred", "حدث خطأ"),
    errorDescription: _m(
      "Failed to load data. Please try again.", 
      "فشل تحميل البيانات. يرجى المحاولة مرة أخرى."
    ),
  }),
});

