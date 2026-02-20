import { MessagesGroup, _m } from "@/messages";

export const WorkOrdersMessages = new MessagesGroup({
  addWorkOrder: _m("Add Work Order", "إضافة أمر عمل"),
  editWorkOrder: _m("Edit Work Order", "تعديل أمر عمل"),
  areYouSureReactivate: _m(
    "Are you sure you want to reactivate this work order?",
    "هل أنت متأكد أنك تريد إعادة تفعيل هذا الأمر؟"
  ),
  areYouSureDeactivate: _m(
    "Are you sure you want to deactivate this work order?",
    "هل أنت متأكد أنك تريد إلغاء تفعيل هذا الأمر؟"
  ),
  success: _m("Success", "نجح"),
  error: _m("Error", "خطأ"),
  activatedSuccessfully: _m(
    "Work order activated successfully",
    "تم تفعيل الأمر بنجاح"
  ),
  deactivatedSuccessfully: _m(
    "Work order deactivated successfully",
    "تم إلغاء تفعيل الأمر بنجاح"
  ),
  failedToUpdateStatus: _m(
    "Failed to update work order status. Please try again.",
    "فشل تحديث حالة الأمر. يرجى المحاولة مرة أخرى."
  ),
  form: new MessagesGroup({
    consultantCode: _m("Consultant Code", "كود المستشار"),
    consultantCodePlaceholder: _m("Enter consultant code", "أدخل كود المستشار"),
    consultantCodeRequired: _m("Consultant code is required", "كود المستشار مطلوب"),
    workOrderDescription: _m("Work Order Description", "وصف أمر العمل"),
    workOrderDescriptionPlaceholder: _m("Enter work order description", "أدخل وصف أمر العمل"),
    workOrderDescriptionRequired: _m("Work order description is required", "وصف أمر العمل مطلوب"),
    workOrderType: _m("Work Order Type", "نوع أمر العمل"),
    workOrderTypePlaceholder: _m("Enter work order type", "أدخل نوع أمر العمل"),
    workOrderTypeRequired: _m("Work order type is required", "نوع أمر العمل مطلوب"),
    addTask: _m("Add Task", "إضافة مهمة"),
    selectTask: _m("Select a task", "اختر مهمة"),
    taskRequired: _m("Task is required", "المهمة مطلوبة"),
    addProcedure: _m("Add Procedure", "إضافة إجراء"),
    selectProcedure: _m("Select a procedure", "اختر إجراء"),
    procedureRequired: _m("Procedure is required", "الإجراء مطلوب"),
    updateSuccess: _m(
      "Work order updated successfully!",
      "تم تحديث أمر العمل بنجاح!"
    ),
    updateError: _m(
      "Failed to update work order. Please try again.",
      "فشل تحديث أمر العمل. يرجى المحاولة مرة أخرى."
    ),
    createSuccess: _m(
      "Work order created successfully!",
      "تم إنشاء أمر العمل بنجاح!"
    ),
    createError: _m(
      "Failed to create work order. Please try again.",
      "فشل إنشاء أمر العمل. يرجى المحاولة مرة أخرى."
    ),
    validationError: _m("Validation error", "خطأ في التحقق من البيانات"),
    save: _m("Save", "حفظ"),
  }),
  table: new MessagesGroup({
    addWorkOrder: _m("Add Work Order", "إضافة أمر عمل"),
    consultantCode: _m("Consultant Code", "كود المستشار"),
    workOrderType: _m("Work Order Type", "نوع أمر العمل"),
    workOrderDescription: _m("Work Order Description", "وصف أمر العمل"),
    status: _m("Status", "الحالة"),
    active: _m("Active", "نشط"),
    inactive: _m("Inactive", "غير نشط"),
    actions: _m("Actions", "الإجراءات"),
    action: _m("Action", "الإجراء"),
    editWorkOrder: _m("Edit Work Order", "تعديل أمر العمل"),
    delete: _m("Delete", "حذف"),
    deleteSuccess: _m("Work order deleted successfully", "تم حذف أمر العمل بنجاح"),
    deleteError: _m("Failed to delete work order", "فشل حذف أمر العمل"),
    deleteConfirmMessage: _m(
      "Are you sure you want to delete this work order?",
      "هل أنت متأكد من حذف هذا الأمر؟"
    ),
    searchPlaceholder: _m("Search by description or code...", "البحث بالوصف أو الكود..."),
    reset: _m("Reset", "إعادة تعيين"),
  }),
  title: _m("Work Orders", "أوامر العمل"),
});
