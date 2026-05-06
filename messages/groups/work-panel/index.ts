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

  // Work panel settings
  settingsTitle: _m("Work Panel Settings", "إعدادات لوحة العمل"),
  projectsSettings: _m("Project settings", "إعداد المشاريع"),
  taskDistributionSettings: _m(
    "Task distribution settings",
    "إعداد توزيع المهام",
  ),
  timePlanningSettings: _m("Time planning settings", "إعداد تخطيط الوقت"),
  resultsEvaluationSettings: _m("Results evaluation settings", "إعداد تقييم النتائج"),

  // Indicators labels
  visaExpiryMonthly: _m(
    "Monthly visa expiration",
    "انتهاء التأشيرات شهرياً",
  ),
  visaExpiryCount: _m("Visa expiration count", "عدد التأشيرات المنتهية"),
  contractExpiryMonthly: _m(
    "Monthly contract expiration",
    "انتهاء العقود شهرياً",
  ),
  jobType: _m("Job type", "نوع الوظيفة"),
  gender: _m("Gender", "الجنس"),
  branch: _m("Branch", "الفرع"),
  totalHolidays: _m("Total holidays", "الإجازات الإجمالية"),
  classification: _m("Classification", "التصنيف"),
  examination: _m("Examination", "الفحص"),
  branchOne: _m("Branch 1", "فرع 1"),
  branchTwo: _m("Branch 2", "فرع 2"),
  branchThree: _m("Branch 3", "فرع 3"),
  sickLeaves: _m("Sick leaves", "إجازات مرضية"),
  annualLeaves: _m("Annual leaves", "إجازات سنوية"),
  specialLeaves: _m("Special leaves", "إجازات خاصة"),
  excellent: _m("Excellent", "ممتاز"),
  veryGood: _m("Very good", "جيد جداً"),
  good: _m("Good", "جيد"),
  acceptable: _m("Acceptable", "مقبول"),
  passed: _m("Passed", "ناجح"),
  failed: _m("Failed", "راسب"),
  expired: _m("Expired", "منتهي"),
  inProgressStatus: _m("In progress", "جاري"),
  notAvailable: _m("Not available", "لا يوجد"),
  visaCases: _m("Visa cases", "حالات الفيزا"),
  maritalStatus: _m("Marital status", "الحالة الاجتماعية"),
  contractStatus: _m("Contract status", "حالة العقد"),
  ageDistribution: _m("Age distribution", "توزيع العمر"),
  nationality: _m("Nationality", "الجنسية"),
  saudiNationality: _m("Saudi", "السعودية"),
  nonSaudiNationality: _m("Non-Saudi", "الغير سعودية"),
  may: _m("May", "مايو"),
  june: _m("June", "يونيو"),
  july: _m("July", "يوليو"),
  august: _m("August", "أغسطس"),
  september: _m("September", "سبتمبر"),
  october: _m("October", "أكتوبر"),
  november: _m("November", "نوفمبر"),
  december: _m("December", "ديسمبر"),
  january: _m("January", "يناير"),
  february: _m("February", "فبراير"),
  march: _m("March", "مارس"),
  decemberYear2025: _m("December 2025", "ديسمبر 2025"),
  februaryYear2027: _m("February 2027", "فبراير 2027"),
  noContract: _m("No contract", "بدون عقد"),
  male: _m("Male", "ذكر"),
  female: _m("Female", "أنثى"),
  unspecified: _m("Unspecified", "غير محدد"),
  hrDepartment: _m("Human resources", "الموارد البشرية"),
  technologyDepartment: _m("Technology", "التقنية"),
  financeDepartment: _m("Finance", "المالية"),
});

