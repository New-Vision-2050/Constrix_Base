import { _m, MessagesGroup } from "../../types";

export const offerMessages = new MessagesGroup({
  singular: _m("Offer", "عرض"),
  plural: _m("Offers", "عروض"),
  table: new MessagesGroup({
    title: _m("Title", "العنوان"),
    startDate: _m("Start Date", "تاريخ البدء"),
    endDate: _m("End Date", "تاريخ الانتهاء"),
    status: _m("Status", "الحالة"),
    noImage: _m("No Image", "لا صورة"),
  }),
  add: _m("Add New Offer", "إضافة عرض جديد"),
  edit: _m("Edit Offer", "تعديل عرض"),
  title: _m("Title", "الرئيسية"),
  image: _m("Offer Image", "صورة العرض"),
  startDate: _m("Start Date", "تاريخ البدء"),
  endDate: _m("End Date", "تاريخ الإنتهاء"),
  createSuccess: _m("Offer created successfully", "تم إضافة العرض بنجاح"),
  createError: _m("Failed to create offer", "فشل في إضافة العرض"),
  updateSuccess: _m("Offer updated successfully", "تم تحديث العرض بنجاح"),
  updateError: _m("Failed to update offer", "فشل في تحديث العرض"),
  save: _m("Save", "حفظ"),
  cancel: _m("Cancel", "إلغاء"),
  deleteConfirm: _m(
    "Are you sure you want to delete this offer?",
    "هل أنت متأكد من حذف هذا العرض؟",
  ),
});
