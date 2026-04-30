import { _m, MessagesGroup } from "../../types";

export const hrReportsMessages = new MessagesGroup({
  title: _m("Reports", "التقارير"),
  description: _m(
    "View and export human resources reports",
    "عرض وتصدير تقارير الموارد البشرية"
  ),
  attendanceReports: _m("Attendance reports", "تقارير الحضور"),
  employeeReports: _m("Employee reports", "تقارير الموظفين"),
  performanceReports: _m("Performance reports", "تقارير الاداء"),
  generalReports: _m("General reports", "التقارير العامة"),
  categoryComingSoon: _m("Coming soon", "قريباً"),
  attendanceReport: new MessagesGroup({
    chartDailyTitle: _m(
      "Check-ins by weekday (dummy)",
      "عمليات التسجيل حسب أيام الأسبوع (وهمي)"
    ),
    chartDailySeries: _m("Check-ins", "تسجيلات الدخول"),
    chartStatusTitle: _m(
      "Attendance status (dummy)",
      "حالات الحضور (وهمي)"
    ),
    chartWeekdays: new MessagesGroup({
      sun: _m("Sun", "أحد"),
      mon: _m("Mon", "إثن"),
      tue: _m("Tue", "ثلا"),
      wed: _m("Wed", "أرب"),
      thu: _m("Thu", "خمي"),
      fri: _m("Fri", "جمع"),
      sat: _m("Sat", "سبت"),
    }),
    statusPresent: _m("Present", "حاضر"),
    statusLate: _m("Late", "متأخر"),
    statusAbsent: _m("Absent", "غائب"),
    tablePlaceholder: _m(
      "Search table…",
      "بحث في الجدول…"
    ),
    table: new MessagesGroup({
      employee: _m("Employee", "الموظف"),
      department: _m("Department", "القسم"),
      date: _m("Date", "التاريخ"),
      checkIn: _m("Check-in", "دخول"),
      checkOut: _m("Check-out", "خروج"),
      workingHours: _m("Hours", "الساعات"),
      status: _m("Status", "الحالة"),
      createdReportsTitle: _m(
        "Generated reports",
        "التقارير المُنشأة",
      ),
      colCreated: _m("Created", "تاريخ الإنشاء"),
      colPeriod: _m("Period", "الفترة"),
      colReportTypes: _m("Report types", "أنواع التقرير"),
      colBranch: _m("Branch", "الفرع"),
      colEmployeeStatus: _m("Employee status", "حالة الموظف"),
      colExport: _m("Export", "التصدير"),
      colLanguage: _m("Language", "اللغة"),
      colEmail: _m("Email delivery", "إرسال بالبريد"),
      colSorting: _m("Sorting", "الترتيب"),
      colActions: _m("Actions", "إجراءات"),
      viewReport: _m("View", "عرض"),
      viewReportTitle: _m("Report details", "تفاصيل التقرير"),
      viewReportClose: _m("Close", "إغلاق"),
      viewReportLoading: _m("Loading report…", "جاري تحميل التقرير…"),
      viewReportEmpty: _m(
        "Could not display this report.",
        "تعذر عرض هذا التقرير.",
      ),
      viewReportErrorTitle: _m(
        "Could not load report",
        "تعذر تحميل التقرير",
      ),
      viewReportErrorDesc: _m(
        "Please try again later.",
        "يُرجى المحاولة لاحقاً.",
      ),
      viewReportInvalidTitle: _m(
        "Unexpected response",
        "استجابة غير متوقعة",
      ),
      viewReportInvalidDesc: _m(
        "The server returned data we could not read.",
        "أعاد الخادم بيانات لا يمكن قراءتها.",
      ),
      downloadReport: _m("Download", "تحميل"),
      downloadReportLoading: _m("Downloading…", "جاري التحميل…"),
      downloadReportErrorTitle: _m(
        "Could not download report",
        "تعذر تحميل التقرير",
      ),
      downloadReportErrorDesc: _m(
        "Please try again later.",
        "يُرجى المحاولة لاحقاً.",
      ),
      emptyReports: _m(
        "No reports yet. Create one using the button above.",
        "لا توجد تقارير بعد. أنشئ تقريراً باستخدام الزر أعلاه.",
      ),
      createReportSuccessTitle: _m(
        "Report created",
        "تم إنشاء التقرير",
      ),
      createReportSuccessDesc: _m(
        "Your report request was submitted successfully.",
        "تم إرسال طلب التقرير بنجاح.",
      ),
      createReportErrorTitle: _m(
        "Could not create report",
        "تعذر إنشاء التقرير",
      ),
      createReportErrorDesc: _m(
        "Something went wrong. Please try again.",
        "حدث خطأ. يُرجى المحاولة مرة أخرى.",
      ),
      fetchReportsErrorTitle: _m(
        "Could not load reports",
        "تعذر تحميل التقارير",
      ),
      fetchReportsErrorDesc: _m(
        "Please refresh the page or try again later.",
        "يُرجى تحديث الصفحة أو المحاولة لاحقاً.",
      ),
      saveTemplateSuccessTitle: _m(
        "Template saved",
        "تم حفظ القالب",
      ),
      saveTemplateSuccessDesc: _m(
        "You can reuse this template when creating your next report.",
        "يمكنك إعادة استخدام هذا القالب عند إنشاء تقرير لاحقاً.",
      ),
      saveTemplateErrorTitle: _m(
        "Could not save template",
        "تعذر حفظ القالب",
      ),
      saveTemplateErrorDesc: _m(
        "Something went wrong. Please try again.",
        "حدث خطأ. يُرجى المحاولة مرة أخرى.",
      ),
    }),
    createAttendanceReport: _m(
      "Create attendance report",
      "إنشاء تقرير حضور",
    ),
    wizard: new MessagesGroup({
      title: _m("Report Creation Wizard", "معالج إنشاء التقارير"),
      subtitle: _m(
        "Follow the steps to create a custom professional report",
        "اتبع الخطوات لإنشاء تقرير احترافي مخصص",
      ),
      stepIndicator: _m("Step {current} of {total}", "الخطوة {current} من {total}"),
      stepSectionHeading: _m("{step} — {title}", "{step} — {title}"),
      next: _m("Next", "التالي"),
      back: _m("Back", "السابق"),
      submit: _m("Create report", "إنشاء التقرير"),
      submitting: _m("Submitting…", "جاري الإرسال…"),
      savingTemplate: _m("Saving template…", "جاري حفظ القالب…"),
      stepLabelTemplate: _m("Template", "القالب"),
      skipToReview: _m("Skip to review", "تخطي إلى المراجعة"),
      stepLabel1: _m("Report type", "نوع التقرير"),
      stepLabel2: _m("Employee data", "بيانات الموظفين"),
      stepLabel3: _m("Attendance data", "بيانات الحضور"),
      stepLabel4: _m("Payroll data", "بيانات الرواتب"),
      stepLabel5: _m("Filters and options", "الفلاتر والخيارات"),
      stepLabel6: _m("Review and create", "مراجعة وإنشاء"),
      sectionReportType: _m(
        "What is the required report type?",
        "ما نوع التقرير المطلوب؟",
      ),
      sectionPeriod: _m("Report time period", "الفترة الزمنية للتقرير"),
      sectionOutput: _m(
        "Report shape and output format",
        "شكل التقرير وتنسيق الإخراج",
      ),
      periodType: _m("Period type", "نوع الفترة"),
      periodMonthly: _m("Monthly", "شهري"),
      periodWeekly: _m("Weekly", "أسبوعي"),
      periodQuarterly: _m("Quarterly", "ربع سنوي"),
      periodYearly: _m("Yearly", "سنوي"),
      quarterField: _m("Quarter", "الربع"),
      year: _m("Year", "السنة"),
      monthField: _m("Month", "الشهر"),
      exportFormat: _m("Export format", "تنسيق التصدير"),
      fmtPdf: _m("PDF", "PDF"),
      fmtExcel: _m("Excel", "Excel"),
      fmtCsv: _m("CSV", "CSV"),
      quarterYearShort: _m("Q{quarter} {year}", "الربع {quarter} {year}"),
      reportLanguage: _m("Report language", "لغة التقرير"),
      langAr: _m("Arabic", "العربية"),
      langEn: _m("English", "English"),
      paperSize: _m("Paper size", "حجم الورقة"),
      printOrientation: _m("Print orientation", "اتجاه الطباعة"),
      orientationPortrait: _m("Portrait", "عمودي"),
      orientationLandscape: _m("Landscape", "أفقي"),
      stepPlaceholder: _m(
        "This step will be configured in a later iteration.",
        "سيتم ضبط هذا القسم في تحديث لاحق.",
      ),
      reviewTitle: _m("Review payload", "مراجعة البيانات"),
      reviewHint: _m(
        "The following object will be submitted:",
        "سيتم إرسال الكائن التالي:",
      ),
      templatePick: new MessagesGroup({
        title: _m("Choose a starting point", "اختر نقطة البداية"),
        subtitle: _m(
          "Start blank or load a saved template. You can edit every step before creating.",
          "ابدأ من الصفر أو حمّل قالباً محفوظاً. يمكنك تعديل كل خطوة قبل الإنشاء.",
        ),
        startFromScratch: _m("Start from scratch", "بدء من جديد"),
        templatesLoading: _m("Loading templates…", "جاري تحميل القوالب…"),
        templatesLoadErrorTitle: _m(
          "Could not load templates",
          "تعذر تحميل القوالب",
        ),
        templatesLoadErrorDesc: _m(
          "Please try again later.",
          "يُرجى المحاولة لاحقاً.",
        ),
        noTemplates: _m(
          "No templates on this page. Save one after configuring a report, try another page, or start from scratch.",
          "لا توجد قوالب في هذه الصفحة. احفظ قالباً بعد ضبط التقرير، أو انتقل لصفحة أخرى، أو ابدأ من جديد.",
        ),
        unnamedTemplate: _m("Template {id}", "قالب {id}"),
        scratchCardHint: _m(
          "Default settings on every step",
          "إعدادات افتراضية في كل خطوة",
        ),
        templateCardHint: _m(
          "Pre-filled — edit anything before creating",
          "جاهز للتعديل — غيّر ما تشاء قبل الإنشاء",
        ),
        selectedFromOtherPageHint: _m(
          "Shown because this template is on another page",
          "يُعرض لأن القالب موجود في صفحة أخرى",
        ),
        keptTemplateChoice: _m(
          "Keep selected template (id: {id})",
          "الإبقاء على القالب المحدد (المعرّف: {id})",
        ),
      }),
      reviewScreen: new MessagesGroup({
        summaryTitle: _m(
          "Report settings summary",
          "ملخص إعدادات التقرير",
        ),
        labelReportTypes: _m("Report type", "نوع التقرير"),
        labelPeriod: _m("Period", "الفترة"),
        labelEmployeeStatus: _m("Employee status", "حالة الموظف"),
        labelBranches: _m("Branches", "الفروع"),
        labelExport: _m("Export format", "تنسيق التصدير"),
        labelLanguage: _m("Language", "اللغة"),
        labelEmailEnabled: _m("Send email", "إرسال بالبريد"),
        labelSorting: _m("Sorting", "الترتيب"),
        tagsAttendanceTitle: _m(
          "Selected attendance data",
          "بيانات الحضور المختارة",
        ),
        tagsSalaryTitle: _m(
          "Selected salary components",
          "مكونات الراتب المختارة",
        ),
        footerHint: _m(
          "The report will be generated and sent automatically to the emails you specified when you click Create report.",
          "سيتم إنشاء التقرير وإرساله تلقائياً إلى البريد المحدد فور النقر على «إنشاء التقرير».",
        ),
        btnCreateNow: _m(
          "Create report now",
          "إنشاء التقرير الآن",
        ),
        btnSaveTemplate: _m(
          "Save these settings as a template",
          "حفظ هذه الإعدادات كقالب",
        ),
        enabled: _m("Enabled", "مفعل"),
        disabled: _m("Disabled", "غير مفعل"),
        noneSelected: _m("None selected", "لم يتم الاختيار"),
      }),
      reportTypes: new MessagesGroup({
        attendance_absence: _m(
          "Attendance and absence report",
          "تقرير الحضور والغياب",
        ),
        leaves: _m("Leaves report", "تقرير الإجازات"),
        overtime: _m("Overtime report", "تقرير العمل الإضافي"),
        monthly_performance: _m(
          "Monthly performance report",
          "تقرير الأداء الشهري",
        ),
        salaries: _m("Salaries report", "تقرير الرواتب"),
        lateness: _m("Lateness report", "تقرير التأخيرات"),
        deductions: _m("Deductions report", "تقرير الخصومات"),
        branches_comparison: _m(
          "Branches comparison report",
          "تقرير مقارنة الفروع",
        ),
      }),
      month: new MessagesGroup({
        m1: _m("January", "يناير"),
        m2: _m("February", "فبراير"),
        m3: _m("March", "مارس"),
        m4: _m("April", "أبريل"),
        m5: _m("May", "مايو"),
        m6: _m("June", "يونيو"),
        m7: _m("July", "يوليو"),
        m8: _m("August", "أغسطس"),
        m9: _m("September", "سبتمبر"),
        m10: _m("October", "أكتوبر"),
        m11: _m("November", "نوفمبر"),
        m12: _m("December", "ديسمبر"),
      }),
      employeesData: new MessagesGroup({
        section1Title: _m("Employee status", "حالة الموظف"),
        section2Title: _m(
          "Filter by location and management",
          "تصفية حسب الموقع والإدارة",
        ),
        section3Title: _m(
          "Contract and employment type",
          "نوع العقد والتوظيف",
        ),
        section4Title: _m("Nationality and gender", "الجنسية والجنس"),
        fieldBranch: _m("Branch", "الفرع"),
        fieldManagement: _m("Management", "الإدارة"),
        fieldDepartment: _m("Department", "القسم"),
        fieldJobTitle: _m("Job title", "المسمى الوظيفي"),
        fieldNationality: _m("Nationality", "الجنسية"),
        fieldGender: _m("Gender", "الجنس"),
        filterNotSet: _m("No filter", "بدون تصفية"),
        statusAll: _m("All", "الكل"),
        statusActive: _m("Active only", "نشط فقط"),
        statusInactive: _m("Inactive", "غير نشط"),
        statusOnLeave: _m("On leave", "في إجازة"),
        statusDismissed: _m("Dismissed", "مفصول"),
        contracts: new MessagesGroup({
          full_time: _m("Full time", "دوام كامل"),
          part_time: _m("Part-time", "دوام جزئي"),
          temporary: _m("Temporary contract", "عقد مؤقت"),
          intern: _m("Intern", "متدرب"),
          external_consultant: _m(
            "External consultant",
            "مستشار خارجي",
          ),
          seasonal: _m("Seasonal labor", "عمالة موسمية"),
        }),
        branches: new MessagesGroup({
          jeddah: _m("Jeddah", "جدة"),
          riyadh: _m("Riyadh", "الرياض"),
          dammam: _m("Dammam", "الدمام"),
          remote: _m("Remote", "عن بُعد"),
        }),
        managements: new MessagesGroup({
          hr: _m("Human Resources", "الموارد البشرية"),
          finance: _m("Finance", "المالية"),
          operations: _m("Operations", "التشغيل"),
          sales: _m("Sales", "المبيعات"),
        }),
        departments: new MessagesGroup({
          recruitment: _m("Recruitment", "قسم التوظيف"),
          training: _m("Training", "التدريب"),
          payroll: _m("Payroll", "الرواتب"),
          relations: _m("Employee relations", "علاقات الموظفين"),
        }),
        jobTitles: new MessagesGroup({
          hr: _m("HR", "HR"),
          accountant: _m("Accountant", "محاسب"),
          developer: _m("Developer", "مطور"),
          manager: _m("Manager", "مدير"),
        }),
        nationalities: new MessagesGroup({
          saudi: _m("Saudi", "سعودي"),
          egyptian: _m("Egyptian", "مصري"),
          indian: _m("Indian", "هندي"),
          pakistani: _m("Pakistani", "باكستاني"),
          other: _m("Other", "أخرى"),
        }),
        genders: new MessagesGroup({
          all: _m("All", "الكل"),
          male: _m("Male", "ذكر"),
          female: _m("Female", "أنثى"),
        }),
      }),
      attendanceData: new MessagesGroup({
        section1Title: _m(
          "Required attendance data types",
          "نوع بيانات الحضور المطلوبة",
        ),
        section2Title: _m(
          "Filter by attendance pattern",
          "تصفية حسب نمط الحضور",
        ),
        section3Title: _m(
          "Additional attendance data",
          "بيانات إضافية للحضور",
        ),
        fieldAttendancePattern: _m("Attendance pattern", "نمط الحضور"),
        fieldAttendanceRate: _m(
          "Attendance rate (minimum)",
          "نسبة الحضور (الحد الأدنى)",
        ),
        fieldDelayLimit: _m(
          "Delay limit (minutes)",
          "حد التأخر (بالدقيقة)",
        ),
        fieldMinOvertime: _m(
          "Minimum overtime",
          "الحد الأدنى للعمل الإضافي",
        ),
        patterns: new MessagesGroup({
          all: _m("All employees", "جميع الموظفين"),
          absentees_only: _m("Absentees only", "الغائبون فقط"),
          late_only: _m("Late only", "المتأخرون فقط"),
          overtime_only: _m("Overtime only", "من لديهم عمل إضافي فقط"),
          present_only: _m("Present only", "الحاضرون فقط"),
        }),
        rateFilters: new MessagesGroup({
          no_filter: _m("No filtering", "بدون تصفية"),
          fifty: _m("At least 50%", "50% فأكثر"),
          seventy: _m("At least 70%", "70% فأكثر"),
          ninety: _m("At least 90%", "90% فأكثر"),
        }),
        delayLimits: new MessagesGroup({
          no_filter: _m("No limit", "بدون حد"),
          five_min_or_more: _m("5 minutes or more", "5 دقائق فأكثر"),
          fifteen_min_or_more: _m(
            "15 minutes or more",
            "15 دقيقة فأكثر",
          ),
          thirty_min_or_more: _m(
            "30 minutes or more",
            "30 دقيقة فأكثر",
          ),
          sixty_min_or_more: _m(
            "60 minutes or more",
            "60 دقيقة فأكثر",
          ),
        }),
        minOvertimeOpts: new MessagesGroup({
          no_filter: _m("None", "بدون"),
          half_hour_or_more: _m(
            "Half an hour or more",
            "نصف ساعة فأكثر",
          ),
          one_hour_or_more: _m("One hour or more", "ساعة فأكثر"),
          two_hours_or_more: _m("Two hours or more", "ساعتان فأكثر"),
          four_hours_or_more: _m("Four hours or more", "4 ساعات فأكثر"),
        }),
        dataTypes: new MessagesGroup({
          attendance_days: _m("Attendance days", "أيام الحضور"),
          delays: _m("Delays", "التأخيرات"),
          taken_leaves: _m("Taken leaves", "الإجازات المأخوذة"),
          unpaid_leave: _m("Unpaid leaves", "إجازات بدون راتب"),
          absence_days: _m("Absence days", "أيام الغياب"),
          overtime: _m("Overtime", "العمل الإضافي"),
          sick_leaves: _m("Sick leaves", "الإجازات المرضية"),
          early_departure: _m(
            "Early departure time",
            "وقت الانصراف المبكر",
          ),
        }),
        toggleEntryTitle: _m(
          "Include entry and exit times",
          "تضمين وقت الدخول والخروج",
        ),
        toggleEntryDesc: _m(
          "Show actual time for each day",
          "عرض الوقت الفعلي لكل يوم",
        ),
        toggleShiftTitle: _m("Include shift name", "تضمين اسم الشفت"),
        toggleShiftDesc: _m(
          "Morning / evening / night",
          "صباحي / مسائي / ليلي",
        ),
        toggleNotesTitle: _m(
          "Include attendance notes",
          "تضمين ملاحظات الحضور",
        ),
        toggleNotesDesc: _m(
          "Manually recorded supervisor notes",
          "ملاحظات المشرف المسجلة يدوياً",
        ),
        toggleHoursTitle: _m(
          "Calculate total work hours",
          "حساب إجمالي ساعات العمل",
        ),
        toggleHoursDesc: _m(
          "Monthly total of actual hours",
          "المجموع الشهري للساعات الفعلية",
        ),
        toggleCompareTitle: _m(
          "Show comparison with previous month",
          "إظهار المقارنة بالشهر السابق",
        ),
        toggleCompareDesc: _m(
          "Percentage change vs previous period",
          "نسبة التغيير مقارنة بالفترة السابقة",
        ),
      }),
      salaryData: new MessagesGroup({
        section1Title: _m(
          "Salary components to display",
          "مكونات الراتب المطلوب عرضها",
        ),
        section2Title: _m(
          "Deductions and withholdings",
          "الخصومات والاستقطاعات",
        ),
        section3Title: _m(
          "Salary disbursement status",
          "حالة صرف الراتب",
        ),
        section4Title: _m(
          "Advanced salary options",
          "خيارات متقدمة للرواتب",
        ),
        salaryComponents: new MessagesGroup({
          basic_salary: _m("Basic salary", "الراتب الأساسي"),
          transportation: _m(
            "Transportation allowance",
            "بدل المواصلات",
          ),
          phone: _m("Phone allowance", "بدل الهاتف"),
          overtime_allowance: _m(
            "Overtime allowance",
            "بدل العمل الإضافي",
          ),
          housing: _m("Housing allowance", "بدل السكن"),
          food: _m("Food allowance", "بدل الغذاء"),
          representation: _m(
            "Representation allowance",
            "بدل التمثيل",
          ),
          bonuses: _m("Bonuses and incentives", "المكافآت والحوافز"),
        }),
        deductions: new MessagesGroup({
          absence_deduction: _m("Absence deduction", "خصم الغياب"),
          social_insurance: _m(
            "Social insurance",
            "التأمينات الاجتماعية",
          ),
          disciplinary: _m(
            "Disciplinary deductions",
            "خصومات تأديبية",
          ),
          delay_deduction: _m("Delay deduction", "خصم التأخير"),
          advances_loans: _m(
            "Advances and loans",
            "السلف والقروض",
          ),
          income_tax: _m("Income tax", "ضريبة الدخل"),
        }),
        disbursementAll: _m("All", "الجميع"),
        disbursementPaid: _m("Disbursed", "تم الصرف"),
        disbursementPending: _m(
          "Under approval",
          "قيد الاعتماد",
        ),
        disbursementSuspended: _m("Suspended", "موقوف"),
        toggleNetTitle: _m(
          "Show net salary only",
          "عرض صافي الراتب فقط",
        ),
        toggleNetDesc: _m(
          "Without component details",
          "بدون تفاصيل المكونات",
        ),
        toggleCompareSalTitle: _m(
          "Include comparison with previous month",
          "تضمين مقارنة بالشهر السابق",
        ),
        toggleCompareSalDesc: _m(
          "Difference in net salary",
          "الفرق في صافي الراتب",
        ),
        toggleSeparatePageTitle: _m(
          "Show each employee on a separate page",
          "عرض تفاصيل كل موظف في صفحة منفصلة",
        ),
        toggleSeparatePageDesc: _m(
          "Suitable for individual payroll lists",
          "مناسب للكشوف الفردية",
        ),
        toggleSummaryTitle: _m(
          "Add total summary at end of report",
          "إضافة ملخص إجمالي في نهاية التقرير",
        ),
        toggleSummaryDesc: _m(
          "Totals and averages",
          "المجاميع والمتوسطات",
        ),
      }),
      filtersOptions: new MessagesGroup({
        section1Title: _m(
          "Data sorting and grouping",
          "ترتيب وتجميع البيانات",
        ),
        section2Title: _m(
          "Visual elements and charts",
          "العناصر البصرية والمخططات",
        ),
        section3Title: _m(
          "Distribution and delivery settings",
          "إعدادات التوزيع والإرسال",
        ),
        fieldMainSort: _m("Main sort by", "الترتيب الرئيسي حسب"),
        fieldSortDirection: _m("Sort direction", "اتجاه الترتيب"),
        fieldGroupBy: _m("Group data by", "تجميع البيانات حسب"),
        fieldPerPage: _m(
          "Employees per page",
          "عدد الموظفين في الصفحة",
        ),
        mainSortValues: new MessagesGroup({
          employee_name_alpha: _m(
            "Employee name (alphabetical)",
            "اسم الموظف (أبجدي)",
          ),
          employee_code: _m("Employee code", "رمز الموظف"),
          department: _m("Department", "القسم"),
          branch: _m("Branch", "الفرع"),
          job_title: _m("Job title", "المسمى الوظيفي"),
          hire_date: _m("Hire date", "تاريخ التعيين"),
        }),
        sortDirections: new MessagesGroup({
          asc: _m("Ascending", "تصاعدي"),
          desc: _m("Descending", "تنازلي"),
        }),
        groupByValues: new MessagesGroup({
          none: _m("No grouping", "بدون تجميع"),
          branch: _m("Branch", "الفرع"),
          department: _m("Department", "القسم"),
          management: _m("Management", "الإدارة"),
          job_title: _m("Job title", "المسمى الوظيفي"),
        }),
        perPageValues: new MessagesGroup({
          "10": _m("10", "10"),
          "25": _m("25", "25"),
          "50": _m("50", "50"),
          "100": _m("100", "100"),
        }),
        visuals: new MessagesGroup({
          attendance_pct_chart: _m(
            "Attendance percentage chart",
            "مخطط نسبة الحضور",
          ),
          weekly_delays_chart: _m(
            "Weekly delays chart",
            "مخطط التأخيرات الأسبوعي",
          ),
          executive_summary_table: _m(
            "Executive summary table",
            "جدول ملخص تنفيذي",
          ),
          salary_distribution_chart: _m(
            "Salary distribution chart",
            "مخطط توزيع الرواتب",
          ),
          branch_comparison_chart: _m(
            "Branch comparison chart",
            "مخطط مقارنة الفروع",
          ),
          attendance_heatmap: _m(
            "Attendance heatmap",
            "خريطة حرارية للحضور",
          ),
        }),
        toggleAutoEmailTitle: _m(
          "Automatic email when report is ready",
          "إرسال تلقائي بالبريد الإلكتروني",
        ),
        toggleAutoEmailDesc: _m(
          "Send after generation completes",
          "عند اكتمال إنشاء التقرير",
        ),
        toggleManagerCopyTitle: _m(
          "Send copy to direct manager",
          "إرسال نسخة للمدير المباشر",
        ),
        toggleManagerCopyDesc: _m(
          "Carbon-copy the reporting line",
          "نسخة لخط الإشراف",
        ),
        toggleMonthlyScheduleTitle: _m(
          "Monthly report scheduling",
          "جدولة التقرير شهرياً",
        ),
        toggleMonthlyScheduleDesc: _m(
          "Repeat on a fixed day each month",
          "تكرار في يوم محدد من كل شهر",
        ),
        toggleHeaderFooterTitle: _m(
          "Add company header and footer",
          "إضافة رأس وتذييل الشركة",
        ),
        toggleHeaderFooterDesc: _m(
          "Logo and contact details",
          "الشعار ومعلومات التواصل",
        ),
        toggleSignatureTitle: _m(
          "Add digital approval signature",
          "إضافة توقيع رقمي للاعتماد",
        ),
        toggleSignatureDesc: _m(
          "Electronic signature block",
          "كتلة توقيع إلكتروني",
        ),
        fieldRecipientEmails: _m(
          "Recipient email addresses",
          "البريد الإلكتروني للمستلمين",
        ),
        emailsPlaceholder: _m(
          "e.g. hr@company.com, ceo@company.com",
          "مثال: hr@company.com, ceo@company.com",
        ),
      }),
    }),
  }),
});
