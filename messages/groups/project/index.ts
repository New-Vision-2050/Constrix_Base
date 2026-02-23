import { _m, MessagesGroup } from "../../types";

export const projectMessages = new MessagesGroup({
  singular: _m("Project", "مشروع"),
  plural: _m("Projects", "المشاريع"),
  tableActions: _m("Actions", "الإجراءات"),
  addProject: _m("Add Project", "اضافة مشروع"),
  editProject: _m("Edit Project", "تعديل المشروع"),
  deleteConfirm: _m(
    "Are you sure you want to delete this project?",
    "هل أنت متأكد من حذف هذا المشروع؟"
  ),
  filterSearch: _m("Search Filter", "فلتر البحث"),
  projectClassification: _m("Project Classification", "تصنيف المشروع"),
  projectStatus: _m("Project Status", "حالة المشروع"),
  all: _m("All", "الكل"),
  statusOngoing: _m("Ongoing", "جاري"),
  statusInProgress: _m("In Progress", "قيد التنفيذ"),
  statusStopped: _m("Stopped", "متوقف"),
  statusCompleted: _m("Completed", "مكتمل"),
});
