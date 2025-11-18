import { _m, MessagesGroup } from "../../types";

export const paymentMethodsMessages = new MessagesGroup({
  singular: _m("Payment Method", "وسيلة دفع"),
  plural: _m("Payment Methods", "وسائل الدفع"),
  methodName: _m("Payment Method Name", "اسم وسيلة الدفع"),
  methodNamePlaceholder: _m("Enter payment method name", "أدخل اسم وسيلة الدفع"),
  status: _m("Status", "الحالة"),
  active: _m("Active", "نشط"),
  inactive: _m("Inactive", "غير نشط"),
  create: _m("Add Payment Method", "إضافة وسيلة دفع"),
  edit: _m("Edit Payment Method", "تعديل وسيلة دفع"),
  nameRequired: _m("Payment method name is required", "اسم وسيلة الدفع مطلوب"),
  createSuccess: _m("Payment method created successfully", "تم إنشاء وسيلة الدفع بنجاح"),
  createError: _m("Failed to create payment method", "فشل إنشاء وسيلة الدفع"),
  updateSuccess: _m("Payment method updated successfully", "تم تحديث وسيلة الدفع بنجاح"),
  updateError: _m("Failed to update payment method", "فشل تحديث وسيلة الدفع"),
  deleteSuccess: _m("Payment method deleted successfully", "تم حذف وسيلة الدفع بنجاح"),
  deleteError: _m("Failed to delete payment method", "فشل حذف وسيلة الدفع")
});
