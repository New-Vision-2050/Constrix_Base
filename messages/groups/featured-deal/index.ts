import { _m, MessagesGroup } from "../../types";

export const featuredDealMessages = new MessagesGroup({
  singular: _m("Featured Deal", "صفقة مميزة"),
  plural: _m("Featured Deals", "صفقات مميزة"),
  table: new MessagesGroup({
    coupon: _m("Coupon", "قسيمة"),
    couponType: _m("Coupon Type", "نوع القسيمة"),
    amount: _m("Amount", "المبلغ"),
    userLimit: _m("User Limit", "حد المستخدم"),
    monthDate: _m("Month Date", "تاريخ الشهر"),
    status: _m("Status", "الحالة"),
    active: _m("Active", "نشط"),
    inactive: _m("Inactive", "غير نشط")
  }),
  add: _m("Add New Featured Deal", "إضافة صفقة مميزة جديدة"),
  edit: _m("Edit Featured Deal", "تعديل صفقة مميزة جديدة"),
  title: _m("Title", "العنوان"),
  mainTitle: _m("Main Title", "الرئيسية"),
  startDate: _m("Start Date", "تاريخ البدء"),
  endDate: _m("End Date", "تاريخ الانتهاء"),
  discountType: _m("Discount Type", "نوع الخصم"),
  selectDiscountType: _m("Select Discount Type", "اختر نوع الخصم"),
  percentage: _m("Percentage", "نسبة مئوية"),
  amount: _m("Fixed Amount", "مبلغ ثابت"),
  discountValue: _m("Discount Value", "قيمة الخصم"),
  createSuccess: _m("Featured deal created successfully", "تم إضافة الصفقة المميزة بنجاح"),
  createError: _m("Failed to create featured deal", "فشل في إضافة الصفقة المميزة"),
  updateSuccess: _m("Featured deal updated successfully", "تم تحديث الصفقة المميزة بنجاح"),
  updateError: _m("Failed to update featured deal", "فشل في تحديث الصفقة المميزة"),
  save: _m("Save", "حفظ"),
  cancel: _m("Cancel", "إلغاء")
});
