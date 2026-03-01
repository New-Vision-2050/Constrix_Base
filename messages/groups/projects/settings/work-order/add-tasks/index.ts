import { MessagesGroup, _m } from "@/messages";

export const AddTasksMessages = new MessagesGroup({
  title: _m("Add Tasks", "إضافة مهام"),
  editTask: _m("Edit Task", "تعديل المهمة"),
  addTask: _m("Add Task", "إضافة مهمة"),
  settings: _m("Settings", "الإعدادات"),
  form: new MessagesGroup({
    serialNumber: _m("Serial Number", "الرقم التسلسلي"),
    serialNumberPlaceholder: _m("Enter serial number", "أدخل الرقم التسلسلي"),
    tasksName: _m("Tasks Name", "اسم المهام"),
    tasksNamePlaceholder: _m("Enter tasks name", "أدخل اسم المهام"),
    tasksNameSelectPlaceholder: _m("Select tasks name", "اختر اسم المهام"),
    save: _m("Save", "حفظ"),
  }),
  table: new MessagesGroup({
    addTask: _m("Add Task", "إضافة مهمة"),
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
    tasksName: _m("Tasks Name", "اسم المهام"),
    notFound: _m("Task not found", "لم يتم العثور على المهمة"),
  }),
});
