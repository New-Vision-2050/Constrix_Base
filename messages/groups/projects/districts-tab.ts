import { MessagesGroup, _m } from "../../types";

export const projectDistrictsTabMessages = new MessagesGroup({
  title: _m("Districts", "المناطق"),
  addDistrict: _m("Add district", "إضافة منطقة"),
  searchPlaceholder: _m("Search districts", "بحث"),
  loadError: _m("Could not load districts", "تعذر تحميل المناطق"),
  deleteSuccess: _m("District deleted", "تم حذف المنطقة"),
  deleteError: _m("Could not delete district", "تعذر حذف المنطقة"),
  deleteConfirmTitle: _m("Delete district", "حذف المنطقة"),
  deleteConfirmMessage: _m(
    "Are you sure you want to delete this district? This action cannot be undone.",
    "هل أنت متأكد من حذف هذه المنطقة؟ لا يمكن التراجع عن هذا الإجراء.",
  ),
  emptyDash: _m("—", "—"),
  table: new MessagesGroup({
    name: _m("District name", "اسم المنطقة"),
    createdAt: _m("Created at", "تاريخ الإنشاء"),
    updatedAt: _m("Updated at", "تاريخ التحديث"),
    actions: _m("Actions", "الإجراءات"),
    action: _m("Action", "إجراء"),
    edit: _m("Edit", "تعديل"),
    delete: _m("Delete", "حذف"),
  }),
  dialog: new MessagesGroup({
    addTitle: _m("Add district", "إضافة منطقة"),
    editTitle: _m("Edit district", "تعديل منطقة"),
    cancel: _m("Cancel", "إلغاء"),
    submit: _m("Save", "حفظ"),
    submitSuccess: _m("District added successfully", "تمت إضافة المنطقة بنجاح"),
    submitError: _m("Could not add district", "تعذر إضافة المنطقة"),
    updateSuccess: _m("District updated successfully", "تم تحديث المنطقة بنجاح"),
    updateError: _m("Could not update district", "تعذر تحديث المنطقة"),
    fields: new MessagesGroup({
      name: _m("District name", "اسم المنطقة"),
      namePlaceholder: _m("Enter district name", "أدخل اسم المنطقة"),
    }),
    validation: new MessagesGroup({
      nameRequired: _m("District name is required", "اسم المنطقة مطلوب"),
    }),
  }),
});
