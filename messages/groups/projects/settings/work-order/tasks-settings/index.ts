import { MessagesGroup, _m } from "@/messages";

export const TasksSettingsMessages = new MessagesGroup({
  title: _m("Tasks Settings", "إعدادات المهام"),
  editTasksSettings: _m("Edit Tasks Settings", "تعديل إعدادات المهام"),
  addTasksSettings: _m("Add Tasks Settings", "إضافة إعدادات المهام"),
  form: new MessagesGroup({
    workOrderType: _m("Work Order Type", "نوع أمر العمل"),
    workOrderTypePlaceholder: _m("Select work order type", "اختر نوع أمر العمل"),
    tasks: _m("Tasks", "المهام"),
    tasksPlaceholder: _m("Select tasks", "اختر المهام"),
    serialNumber: _m("Serial Number", "الرقم التسلسلي"),
    serialNumberPlaceholder: _m("Enter serial number", "أدخل الرقم التسلسلي"),
    tasksName: _m("Tasks Name", "اسم المهام"),
    tasksNamePlaceholder: _m("Select tasks", "اختر المهام"),
    save: _m("Save", "حفظ"),
  }),
  table: new MessagesGroup({
    addTasksSettings: _m("Add Tasks Settings", "إضافة إعدادات المهام"),
    workOrderType: _m("Work Order Type", "نوع أمر العمل"),
    tasks: _m("Tasks", "المهام"),
    actions: _m("Actions", "الإجراءات"),
    action: _m("Action", "الإجراء"),
    show: _m("Show", "عرض"),
    editTasksSettings: _m("Edit Tasks Settings", "تعديل إعدادات المهام"),
    delete: _m("Delete", "حذف"),
    deleteSuccess: _m("Tasks settings deleted successfully", "تم حذف إعدادات المهام بنجاح"),
    deleteError: _m("Failed to delete tasks settings", "فشل حذف إعدادات المهام"),
    deleteConfirmMessage: _m(
      "Are you sure you want to delete this tasks settings?",
      "هل أنت متأكد من حذف إعدادات المهام؟"
    ),
    searchPlaceholder: _m("Search...", "البحث..."),
    reset: _m("Reset", "إعادة تعيين"),
  }),
  details: new MessagesGroup({
    title: _m("Tasks Settings Details", "تفاصيل إعدادات المهام"),
    workOrderType: _m("Work Order Type", "نوع أمر العمل"),
    tasks: _m("Tasks", "المهام"),
    notFound: _m("Tasks settings not found", "لم يتم العثور على إعدادات المهام"),
  }),
});
