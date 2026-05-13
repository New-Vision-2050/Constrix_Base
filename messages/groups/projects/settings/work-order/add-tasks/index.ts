import { MessagesGroup, _m } from "../../../../../types";

export const AddTasksMessages = new MessagesGroup({
  title: _m("Add Tasks", "إضافة مهام"),
  editTask: _m("Edit Task", "تعديل المهمة"),
  addTask: _m("Add Task", "إضافة مهمة"),
  settings: _m("Settings", "الإعدادات"),
  form: new MessagesGroup({
    serialNumber: _m("Serial Number", "الرقم التسلسلي"),
    serialNumberPlaceholder: _m("Enter serial number", "أدخل الرقم التسلسلي"),
    taskCode: _m("Code", "الرمز"),
    taskCodePlaceholder: _m("Enter task code", "أدخل رمز المهمة"),
    tasksName: _m("Tasks Name", "اسم المهام"),
    tasksNamePlaceholder: _m("Enter tasks name", "أدخل اسم المهام"),
    tasksNameSelectPlaceholder: _m("Select tasks name", "اختر اسم المهام"),
    save: _m("Save", "حفظ"),
    validationError: _m("Validation error", "خطأ في التحقق من البيانات"),
    createSuccess: _m("Task created successfully!", "تم إنشاء المهمة بنجاح!"),
    createError: _m(
      "Failed to create task. Please try again.",
      "فشل إنشاء المهمة. يرجى المحاولة مرة أخرى.",
    ),
    updateSuccess: _m("Task updated successfully!", "تم تحديث المهمة بنجاح!"),
    updateError: _m(
      "Failed to update task. Please try again.",
      "فشل تحديث المهمة. يرجى المحاولة مرة أخرى.",
    ),
  }),
  table: new MessagesGroup({
    addTask: _m("Add Task", "إضافة مهمة"),
    /** Column header for task code (same pattern as actions.table.code) */
    code: _m("Code", "الرمز"),
    tasksNumber: _m("Number", "الرقم"),
    tasksName: _m("Tasks Name", "اسم المهام"),
    actions: _m("Actions", "الإجراءات"),
    action: _m("Action", "الإجراء"),
    show: _m("Show", "عرض"),
    editTask: _m("Edit Task", "تعديل المهمة"),
    delete: _m("Delete", "حذف"),
    deleteSuccess: _m("Task deleted successfully", "تم حذف المهمة بنجاح"),
    deleteError: _m("Failed to delete task", "فشل حذف المهمة"),
    deleteConfirmMessage: _m(
      "Are you sure you want to delete this task?",
      "هل أنت متأكد من حذف هذه المهمة؟"
    ),
    searchPlaceholder: _m("Search...", "البحث..."),
    reset: _m("Reset", "إعادة تعيين"),
  }),
  details: new MessagesGroup({
    title: _m("Task Details", "تفاصيل المهمة"),
    serialNumber: _m("Serial Number", "الرقم التسلسلي"),
    taskCode: _m("Code", "الرمز"),
    tasksName: _m("Tasks Name", "اسم المهام"),
    taskName: _m("Task name", "اسم المهمة"),
    notFound: _m("Task not found", "لم يتم العثور على المهمة"),
    createdAt: _m("Created at", "تاريخ الإنشاء"),
    updatedAt: _m("Updated at", "تاريخ التحديث"),
  }),
  loadListError: _m("Could not load tasks", "تعذر تحميل المهام"),
});
