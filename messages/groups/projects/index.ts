import { MessagesGroup, _m } from "../../types";
import { projectSettingsMessages } from "./settings";

export const projectMessages = new MessagesGroup({
  Settings: projectSettingsMessages,
  addProject: _m("Add Project", "إضافة مشروع"),
  editProject: _m("Edit Project", "تعديل مشروع"),
  save: _m("Save", "حفظ"),
  cancel: _m("Cancel", "إلغاء"),
  projectType: _m("Project Type", "نوع المشروع"),
  projectTypeRequired: _m("Project type is required", "نوع المشروع مطلوب"),
  subProjectType: _m("Sub Project Type", "النوع الفرعي للمشروع"),
  subProjectTypeRequired: _m(
    "Sub project type is required",
    "النوع الفرعي للمشروع مطلوب"
  ),
  subSubProjectType: _m("Sub Sub Project Type", "النوع الفرعي الثانوي للمشروع"),
  projectName: _m("Project Name", "اسم المشروع"),
  branch: _m("Branch", "الفرع"),
  branchRequired: _m("Branch is required", "الفرع مطلوب"),
  management: _m("Management", "الإدارة"),
  managementRequired: _m("Management is required", "الإدارة مطلوبة"),
  managementDirector: _m("Management Director", "مدير الإدارة"),
  projectManager: _m("Project Manager", "مدير المشروع"),
  projectOwner: _m("Project Owner", "مالك المشروع"),
  entity: _m("Entity", "جهة"),
  individual: _m("Individual", "فرد"),
  selectClient: _m("Select Client", "اختر العميل"),
  clientRequired: _m("Client is required", "العميل مطلوب"),
  tableActions: _m("Actions", "الإجراءات"),
  filterSearch: _m("Filter & Search", "التصفية والبحث"),
  projectClassification: _m("Project Classification", "تصنيف المشروع"),
  all: _m("All", "الكل"),
  projectStatus: _m("Project Status", "حالة المشروع"),
  statusOngoing: _m("Ongoing", "جاري"),
  statusInProgress: _m("In Progress", "قيد التنفيذ"),
  statusStopped: _m("Stopped", "متوقف"),
  statusCompleted: _m("Completed", "مكتمل"),
  deleteConfirm: _m(
    "Are you sure you want to delete this project?",
    "هل أنت متأكد من حذف هذا المشروع؟"
  ),
});
