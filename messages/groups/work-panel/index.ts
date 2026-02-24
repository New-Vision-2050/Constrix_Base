import { _m, MessagesGroup } from "../../types";

export const workPanelMessages = new MessagesGroup({
  // Main title
  title: _m("Work Panel", "لوحة العمل"),
  description: _m(
    "Manage and follow up on tasks and daily activities",
    "إدارة ومتابعة المهام والأنشطة اليومية"
  ),

  // Main Tabs (Tab1)
  indicators: _m("Indicators", "المؤشرات"),
  procedures: _m("Procedures", "الإجراءات"),
  myServices: _m("My Services", "خدماتي"),

  // Procedures Sub-tabs (Tab2)
  expiredIDs: _m("Expired IDs", "الهويات المنتهية"),
  expiredWorkPermits: _m("Expired Work Permits", "رخص عمل منتهية"),
  employeeProcedures: _m("Employee Procedures", "إجراءات لدى الموظفين"),
  expiredEngineeringBodies: _m(
    "Expired Engineering Bodies",
    "الهيئات الهندسية المنتهية"
  ),
  leaveBalances: _m("Leave Balances", "أرصدة الإجازات"),
  medicalInsurance: _m("Medical Insurance", "التأمين الطبي"),
  employeeRequests: _m(
    "Employee Requests Management",
    "إدارة طلبات الموظفين"
  ),

  // Branches
  branches: _m("Branches", "الفروع"),
  allBranches: _m("All Branches", "جميع الفروع"),
  jeddahBranch: _m("Jeddah Branch", "فرع جدة"),
  riyadhBranch: _m("Riyadh Branch", "فرع الرياض"),
  qassimBranch: _m("Qassim Branch", "فرع القصيم"),

  // Expired IDs table columns
  name: _m("Name", "الاسم"),
  endDate: _m("End Date", "تاريخ الانتهاء"),
  entryNumber: _m("Identity Number", "رقم الهوية"),
  workPermit: _m("Work Permit", "رخصة العمل"),
  // Table actions
  actions: _m("Actions", "الإجراءات"),
  edit: _m("Edit", "تعديل"),

  // Content placeholders
  contentUnderDevelopment: _m(
    "Content under development...",
    "محتوى قيد الإنشاء..."
  ),
  indicatorsContent: _m(
    "Indicators content under development...",
    "محتوى المؤشرات قيد الإنشاء..."
  ),
  servicesContent: _m(
    "Services content under development...",
    "محتوى الخدمات قيد الإنشاء..."
  ),
  loading: _m("Loading...", "جاري التحميل..."),
  noBranches: _m("No branches found", "لم يتم العثور على فروع"),

  // Project Data
  projectData: _m("Project Data", "بيانات المشروع"),
  referenceNumber: _m("Reference Number", "الرقم المرجعي"),
  projectName: _m("Project Name", "اسم المشروع"),
  details: _m("Details", "المفصل"),
  responsibleEngineer: _m("Responsible Engineer", "المهندس المسؤول"),
  contractNumber: _m("Contract Number", "رقم العقد"),
  contractType: _m("Contract Type", "نوع العقد"),
  costCenter: _m("Cost Center", "مركز التكلفة"),
  projectValue: _m("Project Value", "قيمة المشروع"),
  startDate: _m("Start Date", "تاريخ البدء"),
  completionPercentage: _m("Completion Percentage", "نسبة الانجاز"),
  save: _m("Save", "حفظ"),
  cancel: _m("Cancel", "إلغاء"),
  saving: _m("Saving...", "جاري الحفظ..."),
  errorLoading: _m("Error loading data", "حدث خطأ في تحميل البيانات"),
  pleaseSelectBranch: _m("Please select branch", "يرجى اختيار فرع"),
  selectBranchToViewProjectData: _m("Select branch to view project data", "اختر فرعاً لعرض بيانات المشروع"),
});

