import { _m, MessagesGroup } from "../../types";

export const attendanceDepartureModuleMessages = new MessagesGroup({
  WorkdayPeriods: new MessagesGroup({
    numberOfPeriods: _m("Number of periods:", "عدد الفترات:"),
    workingHours: _m("Working hours:", "عدد ساعات العمل:")
  }),
  shared: new MessagesGroup({
    EmployeeInfoSection: new MessagesGroup({
      branch: _m("Branch", "الفرع"),
      jobId: _m("Job ID", "الرقم الوظيفي"),
      department: _m("Department", "الإدارة"),
      approver: _m("Approver", "المحدد"),
      clickToViewApproverDetails: _m("Click to view approver details", "انقر لعرض تفاصيل المحدد"),
      attendanceStatus: _m("Attendance Status", "حالة الحضور"),
      unspecified: _m("Not specified", "غير محدد"),
      status: new MessagesGroup({
        present: _m("Present", "حاضر"),
        late: _m("Late", "متأخر"),
        absent: _m("Absent", "غائب")
      })
    })
  }),
  AttendanceDateSelector: new MessagesGroup({
    startDate: _m("Start Date", "تاريخ البداية"),
    endDate: _m("End Date", "تاريخ الانتهاء"),
    search: _m("Search", "بحث"),
    clearFilters: _m("Clear Filters", "مسح الفلاتر")
  }),
  EmployeeDetailsSheet: new MessagesGroup({
    fields: new MessagesGroup({
      employeeName: _m("Employee Name", "اسم الموظف"),
      phone: _m("Mobile Number", "رقم الجوال"),
      department: _m("Department", "القسم"),
      management: _m("Management", "الإدارة"),
      email: _m("Email", "البريد الالكتروني"),
      branch: _m("Branch", "الفرع")
    }),
    personalInfo: new MessagesGroup({
      gender: _m("Gender", "الجنس"),
      birthDate: _m("Birth Date", "تاريخ الميلاد"),
      nationality: _m("Nationality", "الجنسية")
    }),
    status: new MessagesGroup({
      attendanceStatus: _m("Attendance Status", "حالة الحضور"),
      employeeStatus: _m("Employee Status", "حالة الموظف")
    }),
    times: new MessagesGroup({
      checkIn: _m("Check-in", "الحضور"),
      checkOut: _m("Check-out", "الانصراف"),
      morning: _m("AM", "صباحاً"),
      afternoon: _m("PM", "مساءاً"),
      from: _m("From", "من"),
      to: _m("To", "إلى")
    })
  }),
  Map: new MessagesGroup({
    errorLoading: _m("Error loading data", "حدث خطأ أثناء التحميل"),
    retry: _m("Retry", "إعادة المحاولة"),
    noAttendanceData: _m("No attendance has been recorded by any employee yet", "لم يتم تسجيل حضور من قبل اي موظف بعد"),
    layers: new MessagesGroup({
      standard: _m("Standard Map", "خريطة قياسية"),
      satellite: _m("Satellite Map", "صور الأقمار الصناعية"),
      hybrid: _m("Hybrid", "مختلطة")
    }),
    employeeStatus: new MessagesGroup({
      present: _m("Present", "حاضر"),
      absent: _m("Absent", "غائب"),
      late: _m("Late", "متأخر"),
      holiday: _m("On Leave", "في إجازة"),
      unspecified: _m("Unspecified", "غير محدد"),
      active: _m("Active", "نشط"),
      inactive: _m("Inactive", "غير نشط")
    }),
    employeeDetails: new MessagesGroup({
      unspecified: _m("Unspecified", "غير محدد"),
      attendanceHistory: _m("Attendance History", "سجل الحضور"),
      present: _m("Present", "حاضر"),
      absent: _m("Absent", "غائب"),
      late: _m("Late", "متأخر"),
      hours: _m("hrs", "ساعات"),
      checkIn: _m("Check-in", "تسجيل الدخول"),
      checkOut: _m("Check-out", "تسجيل الخروج"),
      noAttendanceRecords: _m("No attendance records found", "لا توجد سجلات حضور"),
      errorLoadingHistory: _m("Error loading attendance history", "خطأ في تحميل سجل الحضور"),
      scheduledHours: _m("Scheduled Hours", "ساعات الجدول"),
      totalActualHours: _m("Total actual hours", "إجمالي الساعات الفعلية"),
      totalDeductedTime: _m("Total deducted time", "إجمالي الوقت المستقطع")
    }),
    loading: _m("Loading employee data...", "جاري تحميل بيانات الموظفين..."),
    tooltip: new MessagesGroup({
      employee: _m("Employee:", "الموظف:"),
      branch: _m("Branch:", "الفرع:"),
      department: _m("Department:", "الإدارة:"),
      lastSeen: _m("Last Seen:", "آخر ظهور:"),
      clockIn: _m("Clock In:", "وقت الدخول:"),
      phone: _m("Phone", "الهاتف")
    })
  }),
  MapSearchFilter: new MessagesGroup({
    searchPlaceholder: _m("Search", "البحث"),
    tableView: _m("Table", "الجدول"),
    export: _m("Export", "تصدير"),
    refresh: _m("Refresh", "تحديث")
  }),
  SearchFilter: new MessagesGroup({
    title: _m("Search Filter", "فلتر البحث"),
    branch: _m("Branch", "الفرع"),
    all: _m("All", "الكل"),
    loadingBranches: _m("Loading branches...", "جاري تحميل الفروع..."),
    loadingDepartments: _m("Loading managements...", "جاري تحميل الادارات..."),
    department: _m("Department", "الإدارة"),
    approver: _m("Approver", "المحدد المعتمد"),
    loadingApprovers: _m("Loading approvers...", "جاري تحميل المشرفين..."),
    searchPlaceholder: _m("Name/Email", "الاسم/الأيميل")
  }),
  StatisticsCards: new MessagesGroup({
    totalAttendance: _m("Total Attendance", "إجمالي عدد الحضور"),
    totalAbsence: _m("Total Absences", "إجمالي عدد الغياب"),
    totalDepartures: _m("Total Departures", "إجمالي عدد الانصراف"),
    totalHolidays: _m("Total Holiday Days", "إجمالي أيام الإجازات")
  }),
  Table: new MessagesGroup({
    mapView: _m("Map View", "الخريطة"),
    columns: new MessagesGroup({
      name: _m("Name", "الاسم"),
      date: _m("Date", "التاريخ"),
      jobCode: _m("Job ID", "الرقم الوظيفي"),
      branch: _m("Branch", "الفرع"),
      management: _m("Department", "الادارة"),
      approver: _m("Approved By", "المحدد المعتمد"),
      employeeStatus: _m("Employee Status", "حالة الموظف"),
      attendanceStatus: _m("Attendance Status", "حالة الحضور")
    }),
    filters: new MessagesGroup({
      searchPlaceholder: _m("Search", "بحث"),
      branchPlaceholder: _m("Branch", "الفرع"),
      managementPlaceholder: _m("Department", "الادارة"),
      constraintPlaceholder: _m("Constraint", "المحدد"),
      searchText: _m("Search Text", "نص البحث"),
      searchEmployee: _m("Employee", "الموظف"),
      employeeSearchPlaceholder: _m("Search employee...", "بحث عن موظف..."),
      branch: _m("Branch", "الفرع"),
      management: _m("Management", "الإدارة"),
      constraint: _m("Constraint", "المحدد"),
      startDate: _m("Start Date", "تاريخ البداية"),
      endDate: _m("End Date", "تاريخ النهاية")
    }),
    deleteConfirm: _m("Confirm deletion of attendance record", "تأكيد حذف سجل الحضور والانصراف"),
    status: new MessagesGroup({
      onTime: _m("On Time", "في الوقت"),
      late: _m("Late", "متأخر")
    }),
    dialogs: new MessagesGroup({
      approver: new MessagesGroup({
        title: _m("Attendance Status", "حالة الحضور"),
        approverName: _m("Approver Name", "اسم المحدد"),
        approverSystem: _m("Approver System", "نظام المحدد"),
        unspecified: _m("Not specified", "غير محدد"),
        period: _m("Period", "الفترة"),
        noWeeklySchedule: _m("No weekly schedule available", "لا يوجد جدول أسبوعي"),
        workHours: _m("Working hours:", "عدد ساعات العمل:"),
        DateOfAttendance: _m("Date of Attendance", "تاريخ الحضور"),
        DateOfDeparture: _m("Date of Departure", "تاريخ الانصراف"),
        from: _m("From", "من"),
        to: _m("To", "إلى"),
        loading: _m("Loading attendance data...", "جاري تحميل بيانات الحضور..."),
        noRecords: _m("No Attendance Records", "لا توجد سجلات حضور"),
        noRecordsMessage: _m("There are no attendance records for this employee on the selected date.", "لا توجد سجلات حضور لهذا الموظف في التاريخ المحدد"),
        summary: _m("Attendance Summary", "ملخص الحضور"),
        totalAttendance: _m("Total Attendance Hours", "إجمالي ساعات الحضور"),
        totalDelay: _m("Total Delay Hours", "إجمالي ساعات التأخير"),
        totalDeparture: _m("Total Departure Hours", "إجمالي ساعات الانصراف"),
        attendance: _m("Attendance", "الحضور"),
        departure: _m("Departure", "الانصراف"),
        days: new MessagesGroup({
          sunday: _m("Sunday", "الأحد"),
          monday: _m("Monday", "الإثنين"),
          tuesday: _m("Tuesday", "الثلاثاء"),
          wednesday: _m("Wednesday", "الأربعاء"),
          thursday: _m("Thursday", "الخميس"),
          friday: _m("Friday", "الجمعة"),
          saturday: _m("Saturday", "السبت")
        })
      }),
      attendanceStatus: new MessagesGroup({
        title: _m("Attendance Approver Details", "بيانات محدد الحضور"),
        attendance: _m("Check-in", "الحضور"),
        departure: _m("Check-out", "الانصراف"),
        period: _m("Period", "الفترة"),
        todaySchedule: _m("Today's Schedule", "جدول اليوم"),
        actualRecords: _m("Actual Records", "السجلات الفعلية"),
        actualHours: _m("Actual Hours Worked", "عدد ساعات الحضور الفعلي"),
        deductedHours: _m("Deducted Hours", "عدد الساعات المستقطعة")
      })
    })
  })
});
