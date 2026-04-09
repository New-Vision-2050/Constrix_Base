import { MessagesGroup, _m } from "../../types";
import { projectInboxMessages } from "./inbox";
import { projectSettingsMessages } from "./settings";

export const projectMessages = new MessagesGroup({
  Settings: projectSettingsMessages,
  inbox: projectInboxMessages,
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
  projectNameRequired: _m("Project name is required", "اسم المشروع مطلوب"),
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
  columnRefNumber: _m("Ref. No.", "الرقم المرجعي"),
  columnClientName: _m("Client name", "اسم العميل"),
  columnResponsibleEngineer: _m(
    "Responsible engineer",
    "المهندس المسؤول"
  ),
  columnContractNumber: _m("Contract number", "رقم العقد"),
  columnProjectStart: _m("Project start", "بداية المشروع"),
  columnProjectEnd: _m("Project end", "نهاية المشروع"),
  columnTimeProgress: _m("Time progress", "التقدم الزمني"),
  columnAchievement: _m("Achievement", "الإنجاز"),
  columnProjectView: _m("Project view", "عرض المشروع"),
  columnBranchAffiliated: _m("Affiliated branch", "الفرع التابع"),
  columnSubSubClassification: _m("Sub-classification", "التصنيف الفرعي"),
  emptyCell: _m("—", "—"),
  staff: new MessagesGroup({
    title: _m("Staff", "الكادر"),
    addStaff: _m("Add new staff", "إضافة كادر جديد"),
    addStaffButton: _m("Add staff", "إضافة كادر"),
    name: _m("Name", "الاسم"),
    phone: _m("Phone", "الهاتف"),
    email: _m("Email", "البريد الإلكتروني"),
    branch: _m("Branch", "الفرع"),
    employeeName: _m("Employee name", "اسم الموظف"),
    jobTitle: _m("Job title", "المسمى الوظيفي"),
    mobileNumber: _m("Mobile number", "رقم الجوال"),
    department: _m("Department", "الإدارة"),
    departmentDefault: _m("General", "عامة"),
    columnActions: _m("Actions", "الإجراء"),
    actionMenu: _m("Action", "إجراء"),
    edit: _m("Edit", "تعديل"),
    selectEmployees: _m("Select employees", "اختر الموظفين"),
    assignSuccess: _m(
      "Employees assigned to the project",
      "تم تعيين الموظفين على المشروع"
    ),
    assignError: _m(
      "Could not assign employees",
      "تعذر تعيين الموظفين"
    ),
    validation: new MessagesGroup({
      employeesRequired: _m(
        "Select at least one employee",
        "اختر موظفاً واحداً على الأقل"
      ),
      employeeNameRequired: _m(
        "Employee name is required",
        "اسم الموظف مطلوب"
      ),
      emailRequired: _m("Email is required", "البريد الإلكتروني مطلوب"),
      emailInvalid: _m("Enter a valid email", "أدخل بريداً إلكترونياً صالحاً"),
      jobTitleRequired: _m("Job title is required", "المسمى الوظيفي مطلوب"),
      mobileRequired: _m("Mobile number is required", "رقم الجوال مطلوب"),
      departmentRequired: _m("Department is required", "الإدارة مطلوبة"),
      branchRequired: _m("Branch is required", "الفرع مطلوب"),
    }),
  }),
});
