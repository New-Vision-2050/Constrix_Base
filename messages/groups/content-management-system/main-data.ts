import { MessagesGroup, _m } from "@/messages";

export const ContentManagementSystemMainDataMessages = new MessagesGroup({
  saveSuccess: _m("Saved successfully!", "تم الحفظ بنجاح"),
  saveError: _m("Failed to save", "فشل الحفظ"),
  basicData: new MessagesGroup({
    title: _m("Basic Data", "البيانات الأساسية"),
    siteTitle: _m("Site Title", "عنوان الموقع"),
    siteTitlePlaceholder: _m("Enter site title", "أدخل عنوان الموقع"),
    siteLogo: _m("Site Logo", "شعار الموقع"),
    logoMaxSize: _m("Max size: 3MB", "الحد الأقصى للحجم: 3 ميجابايت"),
    logoDimensions: _m("Dimensions: 2160 × 2160", "الأبعاد: 2160 × 2160"),
  }),
  appearance: new MessagesGroup({
    title: _m("Appearance", "المظهر"),
    primaryColor: _m("Primary Color", "اللون الأساسي"),
    secondaryColor: _m("Secondary Color", "اللون الثانوي"),
    backgroundColor: _m("Background Color", "لون الخلفية"),
    saveChanges: _m("Save Changes", "حفظ التغييرات"),
  }),
  validation: new MessagesGroup({
    invalidColor: _m(
      "Invalid color format. Please use hex format (e.g., #FFFFFF)",
      "تنسيق اللون غير صحيح. يرجى استخدام التنسيق السداسي (مثل #FFFFFF)"
    ),
  }),
});
