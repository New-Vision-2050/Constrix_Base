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
  reports: new MessagesGroup({
    filtersTitle: _m("Search filter", "فلتر البحث"),
    all: _m("All", "الكل"),
    clearFilters: _m("Clear filter", "مسح التصفية"),
    export: _m("Export", "تصدير"),
    exportComingSoon: _m("Export will be available soon", "سيتوفر التصدير قريباً"),
    viewComingSoon: _m("View will be available soon", "سيتوفر العرض قريباً"),
    loadError: _m("Could not load safety reports", "تعذر تحميل تقارير السلامة"),
    filters: new MessagesGroup({
      reference: _m("Reference", "المرجع"),
      contractor: _m("Contractor", "المقاول"),
      consultant: _m("Consultant", "الاستشاري"),
      engineer: _m("Engineer", "المهندس"),
    }),
    statuses: new MessagesGroup({
      inProgress: _m("In progress", "قيد المعالجة"),
      completed: _m("Completed", "مكتملة"),
      pending: _m("Pending", "قيد الانتظار"),
      late: _m("Late", "متأخر"),
    }),
    table: new MessagesGroup({
      reference: _m("Reference", "المرجع"),
      status: _m("Status", "الحالة"),
      totalAssignments: _m("Total assignments", "إجمالي التكليفات"),
      completedCount: _m("Completed", "المكتمل"),
      pendingCount: _m("Pending", "قيد الانتظار"),
      contractorName: _m("Contractor name", "اسم المقاول"),
      consultant: _m("Consultant", "الاستشاري"),
      consultantEngineer: _m("Consultant engineer", "مهندس الاستشاري"),
      actions: _m("Actions", "الإجراءات"),
      action: _m("Action", "إجراء"),
      view: _m("View", "عرض"),
    }),
  }),
  indicators: new MessagesGroup({
    filtersTitle: _m("Filter", "فلتر"),
    all: _m("All", "الكل"),
    clearFilters: _m("Clear filter", "مسح التصفية"),
    loadError: _m("Could not load safety indicators", "تعذر تحميل مؤشرات السلامة"),
    noData: _m(
      "No data available for the selected filters.",
      "لا توجد بيانات للفلاتر المحددة.",
    ),
    filters: new MessagesGroup({
      dateFrom: _m("From date", "التاريخ من"),
      dateTo: _m("To date", "التاريخ إلى"),
      contractor: _m("Contractor", "المقاول"),
      consultant: _m("Consultant", "الاستشاري"),
    }),
    kpis: new MessagesGroup({
      overallRating: _m("Overall safety rating", "التقييم العام للسلامة"),
      committedSites: _m("Committed sites", "المواقع الملتزمة"),
      highRiskObservations: _m(
        "High-risk observations",
        "الملاحظات عالية الخطورة",
      ),
      repeatedViolations: _m("Repeated violations", "المخالفات المتكررة"),
    }),
    status: new MessagesGroup({
      good: _m("Good", "جيد"),
      attention: _m("Needs attention", "يجب الانتباه"),
      critical: _m("Critical", "حرج"),
    }),
    charts: new MessagesGroup({
      siteAssessment: _m(
        "Assessment of safety regulation application at the site",
        "تقييم تطبيق لائحة السلامة في الموقع",
      ),
      contractorConsultantErrors: _m(
        "Frequency of errors for all contractors with all consultants",
        "نسبة تكرار الأخطاء لجميع المقاولين مع جميع الاستشاريين",
      ),
      topViolations: _m(
        "Top five repeated violations for all contractors",
        "نسب تكرار أكبر خمس مخالفات لجميع المقاولين",
      ),
      legend: new MessagesGroup({
        excellent: _m("Excellent (90–100%)", "ممتاز (90–100%)"),
        good: _m("Good (70–89%)", "جيد (70–89%)"),
        attention: _m("Needs attention (50–69%)", "يجب الانتباه (50–69%)"),
        critical: _m("Critical (below 50%)", "حرج (أقل من 50%)"),
      }),
    }),
  }),
});
