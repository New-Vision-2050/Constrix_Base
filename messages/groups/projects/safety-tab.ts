import { MessagesGroup, _m } from "../../types";

export const projectSafetyTabMessages = new MessagesGroup({
  title: _m("Safety", "السلامة"),
  comingSoon: _m("Coming soon", "قريباً"),
  tabs: new MessagesGroup({
    safetyReports: _m("Safety Reports", "تقارير السلامة"),
    visits: _m("Visits", "الزيارات"),
    reports: _m("Reports", "التقارير"),
    indicators: _m("Indicators", "المؤشرات"),
  }),
  visits: new MessagesGroup({
    filtersTitle: _m("Search filter", "فلتر البحث"),
    all: _m("All", "الكل"),
    addWorkOrder: _m("Add work order", "إضافة أمر عمل"),
    uploadExcel: _m("Upload Excel file", "رفع ملف Excel"),
    clearFilters: _m("Clear filter", "مسح التصفية"),
    loadError: _m("Could not load safety visits", "تعذر تحميل زيارات السلامة"),
    export: _m("Export", "تصدير"),
    exportComingSoon: _m("Export will be available soon", "سيتوفر التصدير قريباً"),
    addWorkOrderComingSoon: _m(
      "Add work order will be available soon",
      "سيتوفر إضافة أمر العمل قريباً",
    ),
    importComingSoon: _m(
      "Excel import will be available soon",
      "سيتوفر استيراد Excel قريباً",
    ),
    invalidImportFile: _m(
      "Please select a valid Excel file (.xls or .xlsx)",
      "يرجى اختيار ملف Excel صالح (.xls أو .xlsx)",
    ),
    filters: new MessagesGroup({
      orderNumber: _m("Order number", "رقم الامر"),
      contractor: _m("Contractor", "المقاول"),
      consultant: _m("Consultant", "الاستشاري"),
      engineer: _m("Engineer", "المهندس"),
      date: _m("Date", "التاريخ"),
    }),
    workOrderTypes: new MessagesGroup({
      construction: _m("Construction", "انشاء"),
      emergency: _m("Emergency", "طوارئ"),
    }),
    table: new MessagesGroup({
      workOrderNumber: _m(
        "Notification number",
        "رقم الاشعار",
      ),
      workOrderType: _m("Work order type", "نوع أمر العمل"),
      date: _m("Date", "التاريخ"),
      time: _m("Time", "الوقت"),
      requiredGrade: _m("Required grade", "الدرجة المطلوبة"),
      earnedGrade: _m("Earned grade", "الدرجة المستحقة"),
      percentage: _m("Percentage", "النسبة المئوية"),
      consultantEngineer: _m("Consultant engineer", "مهندس الاستشاري"),
      consultant: _m("Consultant", "الاستشاري"),
      contractor: _m("Contractor", "المقاول"),
    }),
  }),
});
