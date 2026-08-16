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
      search: _m(
        "Notification or work order number",
        "رقم الاشعار أو رقم امر العمل",
      ),
      contractor: _m("Contractor", "المقاول"),
      consultant: _m("Consultant", "الاستشاري"),
      engineer: _m("Engineer", "المهندس"),
      date: _m("Date", "التاريخ"),
      assignedUser: _m("Assigned user", "المستخدم المكلف"),
    }),
    workOrderTypes: new MessagesGroup({
      construction: _m("Construction", "انشاء"),
      emergency: _m("Emergency", "طوارئ"),
    }),
    table: new MessagesGroup({
      workOrderNumber: _m(
        "Work order / notification number",
        "رقم أمر العمل / الإشعار",
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
      actions: _m("Actions", "الإجراءات"),
      downloadReport: _m("Download Report", "تحميل التقرير"),
      downloadReportDisabledTooltip: _m(
        "The report can only be downloaded after the violation is completed.",
        "لا يمكن تحميل التقرير إلا بعد اكتمال المخالفة.",
      ),
      downloadReportNoViolationsTooltip: _m(
        "The report can only be downloaded when at least one violation exists.",
        "لا يمكن تحميل التقرير إلا عند وجود مخالفة واحدة على الأقل.",
      ),
      downloadReportError: _m(
        "Failed to download the report. Please try again.",
        "فشل تحميل التقرير. يرجى المحاولة مرة أخرى.",
      ),
    }),
    reportDownloadDialog: new MessagesGroup({
      title: _m("Download Report", "تحميل التقرير"),
      downloadMakkahReport: _m(
        "Download Makkah Report",
        "تنزيل تقرير مكة",
      ),
      downloadJeddahReport: _m(
        "Download Jeddah Report",
        "تنزيل تقرير جدة",
      ),
      cancel: _m("Cancel", "إلغاء"),
      downloadReportError: _m(
        "Failed to download the report. Please try again.",
        "فشل تحميل التقرير. يرجى المحاولة مرة أخرى.",
      ),
    }),
    evidenceDialog: new MessagesGroup({
      title: _m("Violation evidence", "أدلة المخالفة"),
      empty: _m("No images available", "لا توجد صور"),
      openFullSize: _m("Open full size", "فتح بالحجم الكامل"),
      close: _m("Close", "إغلاق"),
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
      downloadReport: _m("Download Report", "تحميل التقرير"),
      downloadReportDisabledTooltip: _m(
        "The report can only be downloaded after the violation is completed.",
        "لا يمكن تحميل التقرير إلا بعد اكتمال المخالفة.",
      ),
      downloadReportError: _m(
        "Failed to download the report. Please try again.",
        "فشل تحميل التقرير. يرجى المحاولة مرة أخرى.",
      ),
    }),
  }),
  weeklyReports: new MessagesGroup({
    createdReportsTitle: _m("Generated reports", "التقارير المُنشأة"),
    createReport: _m("Create report", "إنشاء تقرير"),
    resetFilters: _m("Reset", "إعادة تعيين"),
    emptyReports: _m(
      "No reports yet. Create one using the button above.",
      "لا توجد تقارير بعد. أنشئ تقريراً باستخدام الزر أعلاه.",
    ),
    loadError: _m(
      "Could not load weekly reports",
      "تعذر تحميل التقارير الأسبوعية",
    ),
    createSuccess: _m(
      "Report created successfully",
      "تم إنشاء التقرير بنجاح",
    ),
    createError: _m(
      "Could not create the report. Please try again.",
      "تعذر إنشاء التقرير. يُرجى المحاولة مرة أخرى.",
    ),
    filters: new MessagesGroup({
      fromDate: _m("From", "من"),
      toDate: _m("To", "إلى"),
    }),
    createDialog: new MessagesGroup({
      title: _m("Create report", "إنشاء تقرير"),
      startDate: _m("Start date", "تاريخ البداية"),
      endDate: _m("End date", "تاريخ النهاية"),
      cancel: _m("Cancel", "إلغاء"),
      create: _m("Create", "إنشاء"),
      creating: _m("Creating…", "جاري الإنشاء…"),
    }),
    fileDialog: new MessagesGroup({
      title: _m("Report file", "ملف التقرير"),
      unavailable: _m(
        "No file is available for this report.",
        "لا يوجد ملف متاح لهذا التقرير.",
      ),
      previewUnsupported: _m(
        "Preview is not available for this file type. Open it in a new tab instead.",
        "المعاينة غير متاحة لهذا النوع من الملفات. افتحه في تبويب جديد.",
      ),
      openInNewTab: _m("Open in new tab", "فتح في تبويب جديد"),
      close: _m("Close", "إغلاق"),
    }),
    statuses: new MessagesGroup({
      ready: _m("Ready", "جاهز"),
      processing: _m("Processing", "قيد المعالجة"),
      failed: _m("Failed", "فشل"),
      pending: _m("Pending", "قيد الانتظار"),
    }),
    table: new MessagesGroup({
      serialNumber: _m("Serial number", "الرقم التسلسلي"),
      name: _m("Report name", "اسم التقرير"),
      fromDate: _m("From date", "من تاريخ"),
      toDate: _m("To date", "إلى تاريخ"),
      status: _m("Status", "الحالة"),
      createdAt: _m("Created", "تاريخ الإنشاء"),
      actions: _m("Actions", "إجراءات"),
      show: _m("Show", "عرض"),
    }),
  }),
  indicators: new MessagesGroup({
    filtersTitle: _m("Filter", "فلتر"),
    all: _m("All", "الكل"),
    clearFilters: _m("Clear filter", "مسح التصفية"),
    loadError: _m("Could not load safety indicators", "تعذر تحميل مؤشرات السلامة"),
    unknownGroup: _m("Unassigned", "غير محدد"),
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
