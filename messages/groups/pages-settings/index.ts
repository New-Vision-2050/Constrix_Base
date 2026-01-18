import { _m, MessagesGroup } from "../../types";

export const pagesSettingsMessages = new MessagesGroup({
  tabs: new MessagesGroup({
    home: _m("Home", "الرئيسية"),
    discounts: _m("Discounts", "الخصومات"),
    newArrivals: _m("New Arrivals", "الوصول جديدنا"),
    contact: _m("Contact", "التواصل"),
    aboutUs: _m("About Us", "من نحن"),
  }),
  table: new MessagesGroup({
    image: _m("Image", "الصورة"),
    title: _m("Title", "العنوان"),
    url: _m("URL", "الرابط"),
    status: _m("Status", "الحالة"),
    noImage: _m("No Image", "لا توجد صورة"),
    name: _m("Name", "الاسم"),
    address: _m("Address", "العنوان"),
    phone: _m("Phone", "رقم الهاتف"),
    email: _m("Email", "البريد الالكتروني"),
    description: _m("Description", "الوصف"),
  }),
  sections: new MessagesGroup({
    header: _m("Main Section", "القسم الرئيسي"),
    footer: _m("Footer Section", "قسم الذيل"),
  }),
  fields: new MessagesGroup({
    titleHeader: _m("Title", "عنوان"),
    descriptionHeader: _m("Description", "وصف"),
    titleFooter: _m("Title", "عنوان"),
    descriptionFooter: _m("Description", "وصف"),
    bannerDetails: _m("Banner Details", "تفاصيل البانر"),
    bannerTitle: _m("Banner Title", "عنوان البانر"),
    bannerDescription: _m("Banner Description", "وصف البانر"),
    bannerImage: _m("Banner Image", "صورة البانر"),
    bannerUrl: _m("Banner URL", "رابط البانر"),
  }),
  validation: new MessagesGroup({
    titleRequired: _m("Title is required", "العنوان مطلوب"),
    descriptionRequired: _m("Description is required", "الوصف مطلوب"),
    fillRequired: _m(
      "Please fill all required fields correctly",
      "يرجى ملء جميع الحقول المطلوبة بشكل صحيح",
    ),
  }),
  messages: new MessagesGroup({
    saveSuccess: _m("Changes saved successfully!", "تم حفظ التعديلات بنجاح!"),
    saveError: _m(
      "Failed to save changes. Please try again.",
      "فشل في حفظ التعديلات. حاول مرة أخرى.",
    ),
    createSuccess: _m("Banner created successfully", "تم إنشاء اللافتة بنجاح"),
    createError: _m("Failed to create banner", "فشل في إنشاء اللافتة"),
    updateSuccess: _m("Banner updated successfully", "تم تحديث اللافتة بنجاح"),
    updateError: _m("Failed to update banner", "فشل في تحديث اللافتة"),
  }),
  actions: new MessagesGroup({
    save: _m("Save", "حفظ"),
    saving: _m("Saving...", "جاري الحفظ..."),
    loading: _m("Loading...", "جاري التحميل..."),
    addBanner: _m("Add Banner", "اضافة لافته"),
    editBanner: _m("Edit Banner", "تعديل لافتة"),
    pageSettings: _m("Page Settings", "إعدادات الصفحة"),
    cancel: _m("Cancel", "إلغاء"),
  }),
  confirmations: new MessagesGroup({
    delete: _m(
      "Are you sure you want to delete this item?",
      "هل أنت متأكد من أنك تريد حذف هذا العنصر؟",
    ),
  }),
});
