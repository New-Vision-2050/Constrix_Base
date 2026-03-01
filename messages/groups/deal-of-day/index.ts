import { _m, MessagesGroup } from "../../types";

export const dealOfDayMessages = new MessagesGroup({
  singular: _m("Deal of the Day", "صفقة اليوم"),
  plural: _m("Deals of the Day", "صفقات اليوم"),
  table: new MessagesGroup({
    dealName: _m("Deal Name", "اسم الصفقة"),
    product: _m("Product", "المنتج"),
    active: _m("Active", "نشط"),
  }),
  add: _m("Add Deal of the Day", "إضافة صفقة اليوم"),
  edit: _m("Edit Deal of the Day", "تعديل صفقة اليوم"),
  title: _m("Title", "العنوان"),
  product: _m("Product", "المنتج"),
  selectProduct: _m("Select Product", "اختر المنتج"),
  discountType: _m("Discount Type", "نوع الخصم"),
  selectDiscountType: _m("Select Discount Type", "اختر نوع الخصم"),
  percentage: _m("Percentage", "نسبة مئوية"),
  amount: _m("Fixed Amount", "مبلغ ثابت"),
  discountValue: _m("Discount Value", "قيمة الخصم"),
  createSuccess: _m(
    "Deal of the day created successfully",
    "تم إضافة صفقة اليوم بنجاح",
  ),
  createError: _m(
    "Failed to create deal of the day",
    "فشل في إضافة صفقة اليوم",
  ),
  updateSuccess: _m(
    "Deal of the day updated successfully",
    "تم تحديث صفقة اليوم بنجاح",
  ),
  updateError: _m(
    "Failed to update deal of the day",
    "فشل في تحديث صفقة اليوم",
  ),
  save: _m("Save", "حفظ"),
  cancel: _m("Cancel", "إلغاء"),
  deleteConfirm: _m(
    "Are you sure you want to delete this deal of the day?",
    "هل أنت متأكد من حذف صفقة اليوم؟",
  ),
});
