import { _m, MessagesGroup } from "../../../../types";

export const projectTypesMessages = new MessagesGroup({
  tabs: new MessagesGroup({
    projectDetails: _m("Project Details", "بيانات المشروع"),
    projectTerms: _m("Project Terms", "بنود المشروع"),
    attachments: _m("Attachments", "المرفقات"),
    contractors: _m("Contractors", "المقاولين"),
    team: _m("Team", "الكادر"),
    workOrders: _m("Work Orders", "اوامر العمل"),
    financial: _m("Financial", "المالية"),
    contractManagement: _m("Contract Management", "ادارة العقد"),
  }),
  add: _m("Add", "اضافة"),
  addProjectType: new MessagesGroup({
    title: _m("Add Project Type", "اضافة نوع المشروع"),
    nameLabel: _m("Category Name", "اسم التصنيف"),
    nameRequired: _m("Category name is required", "اسم التصنيف مطلوب"),
    iconRequired: _m("Icon selection is required", "اختيار الأيقونة مطلوب"),
    referenceLabel: _m("Project Reference", "مرجعية المشروع"),
    projectElementsLabel: _m("Select Project Elements", "تحديد عناصر المشروع"),
    successMessage: _m("Project type added successfully", "تم اضافة نوع المشروع بنجاح"),
    errorMessage: _m("Failed to add project type", "فشل في اضافة نوع المشروع"),
  }),
  addSubProjectType: new MessagesGroup({
    title: _m("Add Sub Category", "اضافة تصنيف فرعي"),
    nameLabel: _m("Category Name", "اسم التصنيف"),
    nameRequired: _m("Category name is required", "اسم التصنيف مطلوب"),
    iconRequired: _m("Icon selection is required", "اختيار الأيقونة مطلوب"),
    successMessage: _m("Sub category added successfully", "تم اضافة التصنيف الفرعي بنجاح"),
    errorMessage: _m("Failed to add sub category", "فشل في اضافة التصنيف الفرعي"),
  }),
});
