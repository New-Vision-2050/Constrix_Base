import { MessagesGroup, _m } from "../../types";

export const projectManagementsTabMessages = new MessagesGroup({
  title: _m("Managements", "الإدارات"),
  addManagement: _m("Add management", "إضافة إدارة"),
  searchPlaceholder: _m("Search managements", "بحث"),
  loadError: _m("Could not load managements", "تعذر تحميل الإدارات"),
  deleteSuccess: _m("Management deleted", "تم حذف الإدارة"),
  deleteError: _m("Could not delete management", "تعذر حذف الإدارة"),
  deleteConfirmTitle: _m("Delete management", "حذف الإدارة"),
  deleteConfirmMessage: _m(
    "Are you sure you want to delete this management? This action cannot be undone.",
    "هل أنت متأكد من حذف هذه الإدارة؟ لا يمكن التراجع عن هذا الإجراء.",
  ),
  emptyDash: _m("—", "—"),
  table: new MessagesGroup({
    name: _m("Management name", "اسم الإدارة"),
    createdAt: _m("Created at", "تاريخ الإنشاء"),
    updatedAt: _m("Updated at", "تاريخ التحديث"),
    actions: _m("Actions", "الإجراءات"),
    action: _m("Action", "إجراء"),
    edit: _m("Edit", "تعديل"),
    delete: _m("Delete", "حذف"),
  }),
  dialog: new MessagesGroup({
    addTitle: _m("Add management", "إضافة إدارة"),
    editTitle: _m("Edit management", "تعديل إدارة"),
    cancel: _m("Cancel", "إلغاء"),
    submit: _m("Save", "حفظ"),
    submitSuccess: _m("Management added successfully", "تمت إضافة الإدارة بنجاح"),
    submitError: _m("Could not add management", "تعذر إضافة الإدارة"),
    updateSuccess: _m("Management updated successfully", "تم تحديث الإدارة بنجاح"),
    updateError: _m("Could not update management", "تعذر تحديث الإدارة"),
    fields: new MessagesGroup({
      name: _m("Management name", "اسم الإدارة"),
      namePlaceholder: _m("Enter management name", "أدخل اسم الإدارة"),
    }),
    validation: new MessagesGroup({
      nameRequired: _m("Management name is required", "اسم الإدارة مطلوب"),
    }),
  }),
});
